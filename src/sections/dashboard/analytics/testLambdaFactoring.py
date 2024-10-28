import json
import requests
import asyncio
import time
import pandas as pd
import numpy as np
from pymongo import MongoClient
from motor.motor_asyncio import AsyncIOMotorClient
import boto3
import os
from io import StringIO
from bson.objectid import ObjectId
from datetime import datetime, timedelta
import calendar
import locale
import re

MY_AWS_ACCESS_KEY_ID = os.getenv("ACCESS_KEY_ID")
MY_AWS_SECRET_ACCESS_KEY = os.getenv("SECRET_ACCESS_KEY")
print("NOTAS DE CREDITO - DEBITO")
tipo_cambio_cache = {}

cod_moneda = {
    "USD": "Dólar de N.A.",
    "EUR": "Euro"
}

columns_purchases = [
  "periodo",
  "cuo",
  "correlativo",
  "fecEmision",
  "fecVencimientoPago",
  "codCpe",
  "numSerie",
  "annEmisionDua",
  "numCpe",
  "numCpeRangoFinal",
  "codTipoDocIdentidadProveedor",
  "numDocIdentidadProveedor",
  "nomRazonSocialProveedor",
  "mtoBIGravadaDG",
  "mtoIGV",
  "mtoBIGravadaDGNG",
  "mtoIgvIpmDGNG",
  "mtoBIGravadaDNG",
  "mtoIgvIpmDNG",
  "mtoValorAdqNG",
  "mtoISC",
  "mtoIcbp",
  "mtoOtrosTrib",
  "mtoImporteTotal",
  "codMoneda",
  "mtoTipoCambio",
  "fecEmisionMod",
  "codTipoMod",
  "numSerieMod",
  "codDua",
  "numCpeMod",
  "fecEmisionCDD",
  "numCDD",
  "marcaCDRet",
  "clasifBS",
  "idOperSocIRR",
  "errTipo1",
  "errTipo2",
  "errTipo3",
  "errTipo4",
  "indCDPCancelados",
  "codEstadoComprobante"
];

columns_sales = [
  "periodo",
  "cuo",
  "correlativo",
  "fecEmision",
  "fecVencimientoPago",
  "codCpe",
  "numSerie",
  "numCpe",
  "numFinal",
  "codTipoDocIdentidadProveedor",
  "numDocIdentidadProveedor",
  "nomRazonSocialProveedor",
  "mtoValFactExpo",
  "mtoBIGravada",
  "mtoDsctoBI",
  "mtoIGV",
  "mtoDsctoIGV",
  "mtoExonerado",
  "mtoInafecto",
  "mtoISC",
  "mtoBIIvap",
  "mtoIvap",
  "mtoIcbp",
  "mtoOtrosTrib",
  "mtoImporteTotal",
  "codMoneda",
  "mtoTipoCambio",
  "fecEmisionMod",
  "codTipoCDPMod",
  "numSerieCDPMod",
  "numCDPMod",
  "idOperSocIRR",
  "errorTipo1",
  "indCDPCancelados",
  "codEstadoComprobante"
];

list_receipts = {'00': 'Otros', '01': 'Factura', '03': 'Boleta de venta', '04': 'Liquidación de Compras', '07': 'Nota de crédito', '08': 'Nota de débito'}


# client mongo
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = 'izitax'
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db["factoring"]

# client s3
s3_client = boto3.client('s3')

def lambda_handler(event, context):
    print("EVENT: ", event)
    collection_name = event.get("collectionName")
    ruc_account = event.get("rucAccount")
    period = event.get("periodo")
    key = event.get("key")
    
    all_s3_docs = get_file_content(collection_name, key)
    if not all_s3_docs:
        print("no se encontró data en S3: ", key)
        return ''
    
    columns = columns_purchases if collection_name == 'purchases' else columns_sales
    ple_result = transform_data_from_s3(all_s3_docs, columns, ruc_account, collection_name)
    df_ple_result = pd.DataFrame(ple_result)
    df_ple_result['observacion'] = ''
    #print("df_ple_result: ", df_ple_result)
    print("columns: ", df_ple_result.columns)

    if collection_name == "purchases" or collection_name == "sales":
        for index, row in df_ple_result.iterrows():
            observacion = df_ple_result.at[index, 'observacion']
            if row["codCpe"] in ["01", "03", "1", "3"]:
                identityInfo = row["identityInfo"]
                mtoImporteTotal = row["mtoImporteTotal"]

                result_factoring = collection.find_one({"identityInfo": identityInfo})

                if result_factoring:
                    estado = result_factoring["estado"]
                    print(estado)
                
                    if estado == "No válido":
                        identityInfoMod = f"{row['ruc']}{row['codTipoMod']}{row['numSerieMod']}{row['numCpeMod'].zfill(10)}"
                        codTipoMod = row["codTipoMod"]
                        numSerieMod = row["numSerieMod"]
                        numCpeMod = row["numCpeMod"]
                        result_nc = df_ple_result[df_ple_result["identityInfo"] == identityInfoMod]

                        if not result_nc.empty:
                            print("Se encontraron coincidencias:")
                            factura_monto = row['mtoImporteTotal']
                            nc_monto = result_nc['mtoImporteTotal'].values[0]
                            diferencia = factura_monto - nc_monto
                            if diferencia == 0:
                                 observacion += "No válido con nota de crédito: importes iguales"
                            else:
                                observacion += f"No válido con nota de crédito: importes distintos (Factura: {factura_monto}, Nota de Crédito: {nc_monto})."

                        else:
                            observacion += "Factoring: no valido sin nota de credito. "
                    else:
                        observacion += f"Factoring: {estado}"

                else:
                    print("No se encontró el documento.")

                df_ple_result.at[index, 'observacion'] = observacion
    
    inconsistent_records = df_ple_result[(df_ple_result['observacion'].notnull()) & (df_ple_result['observacion'] != '')]
    observations_json = inconsistent_records.to_dict(orient="records")
    print("OBSERVATIONS: ",observations_json)
    
    payload = {
        "all_results": observations_json,
        "relevant_data": {},
        "download_path": f""
    }

    return {
        'statusCode': 200,
        'body': json.dumps(payload),
        'headers': {
            'Content-Type': 'application/json'
        }
    }


def get_file_content(collection_name, key):
    s3 = boto3.client('s3', aws_access_key_id=MY_AWS_ACCESS_KEY_ID, aws_secret_access_key=MY_AWS_SECRET_ACCESS_KEY)
    bucket_name = 'files-analytia'
    MAX_COLUMNS = 42 if collection_name == 'purchases' else 35
     
    try:
        response = s3.get_object(Bucket=bucket_name, Key=key)
        file_content = response['Body'].read().decode('utf-8', errors='ignore')
        lines = file_content.strip().split('\n')
        
        data = []
        for line in lines:
            columns = line.split('|')
            if len(columns) > MAX_COLUMNS:
                columns = columns[:MAX_COLUMNS]
            else:
                columns += [''] * (MAX_COLUMNS - len(columns))
            data.append(columns)
        
        return data
    except Exception as e:
        print(f"Error al obtener el archivo de S3: {str(e)}")
        return []

def transform_data_from_s3(docs, updated_columns, ruc_account, collection_name):
    df = pd.DataFrame(docs, columns=updated_columns)
    df_transformed = df.apply(lambda row: calculate_s3_values(row, ruc_account, collection_name), axis=1, result_type='expand')
    df_transformed["mtoTipoCambio"] = df_transformed["mtoTipoCambio"].apply(lambda x: pd.to_numeric(x, errors='coerce') if pd.to_numeric(x, errors='coerce') is not None else x)
    df_transformed["mtoIGV"] = df_transformed['mtoIGV'].astype(float)
    df_transformed["mtoImporteTotal"] = df_transformed['mtoImporteTotal'].astype(float)
    df_transformed["key"] = df_transformed['identityInfo']
    df_transformed.set_index("key", inplace=True)
    
    return df_transformed.reset_index().to_dict(orient='records')


def calculate_s3_values(row, ruc_account, collection_name):  
    obj = {}
    if collection_name == "purchases":
        obj = {
            "identityInfo": f"{row['numDocIdentidadProveedor']}{row['codCpe']}{row['numSerie']}{row['numCpe'].zfill(10)}",
            "periodo": row['periodo'],
            "ruc": row['numDocIdentidadProveedor'],
            "razonSocial": row['nomRazonSocialProveedor'],
            "fecEmision": row['fecEmision'],
            "codCpe": row['codCpe'],
            "codMoneda": row['codMoneda'],
            "numSerie": row['numSerie'],
            "numCpe": row['numCpe'],
            "mtoBIGravadaDG": row['mtoBIGravadaDG'],
            "mtoIGV": row['mtoIGV'],
            "mtoBIGravadaDGNG": row['mtoBIGravadaDGNG'],
            "mtoIgvIpmDGNG": row['mtoIgvIpmDGNG'],
            "mtoBIGravadaDNG": row['mtoBIGravadaDNG'],
            "mtoIgvIpmDNG": row['mtoIgvIpmDNG'],
            "mtoValorAdqNG": row['mtoValorAdqNG'],
            "mtoISC": row['mtoISC'],
            "mtoIcbp": row['mtoIcbp'],
            "mtoOtrosTrib": row['mtoOtrosTrib'],
            "mtoImporteTotal": row['mtoImporteTotal'],
            "mtoTipoCambio": row['mtoTipoCambio'],
            "fecEmisionMod": row['fecEmisionMod'],
            "codTipoMod": row['codTipoMod'],
            "numSerieMod": row['numSerieMod'],
            "codDua": row['codDua'],
            "numCpeMod": row['numCpeMod'],
        }
    
    if collection_name == "sales":
        obj = {
            "identityInfo": f"{ruc_account}{row['codCpe']}{row['numSerie']}{row['numCpe'].zfill(10)}",
            "periodo": row['periodo'],
            "ruc": row['numDocIdentidadProveedor'],
            "razonSocial": row['nomRazonSocialProveedor'],
            "fecEmision": row['fecEmision'],
            "codCpe": row['codCpe'],
            "codMoneda": row['codMoneda'],
            "numSerie": row['numSerie'],
            "numCpe": row['numCpe'],
            "mtoValFactExpo": row['mtoValFactExpo'],
            "mtoBIGravada": row['mtoBIGravada'],
            "mtoDsctoBI": row['mtoDsctoBI'],
            "mtoIGV": row['mtoIGV'],
            "mtoDsctoIGV": row['mtoDsctoIGV'],
            "mtoExonerado": row['mtoExonerado'],
            "mtoInafecto": row['mtoInafecto'],
            "mtoISC": row['mtoISC'],
            "mtoBIIvap": row['mtoBIIvap'],
            "mtoIvap": row['mtoIvap'],
            "mtoIcbp": row['mtoIcbp'],
            "mtoOtrosTrib": row['mtoOtrosTrib'],
            "mtoImporteTotal": row['mtoImporteTotal'],
            "mtoTipoCambio": row['mtoTipoCambio'],
            
            "fecEmisionMod": row['fecEmisionMod'],
            "codTipoMod": row['codTipoCDPMod'],
            "numSerieMod": row['numSerieCDPMod'],
            "numCpeMod": row['numCDPMod'],
        }
        
    return obj

def save_csv_to_s3(df, bucket_name, file_name):
    csv_buffer = StringIO()
    df.to_csv(csv_buffer, index=False)
    s3_client = boto3.client('s3')
    try:
        s3_client.put_object(Bucket=bucket_name, Key=file_name, Body=csv_buffer.getvalue())
        print(f"Archivo guardado correctamente en s3://{bucket_name}/{file_name}")
    except Exception as e:
        print(f"Error al subir el archivo CSV a S3: {str(e)}")

def period_to_text(period):
    try:
        date = datetime.strptime(str(period), "%Y%m")
        locale.setlocale(locale.LC_TIME, 'es_ES.UTF-8')
        month_name = calendar.month_name[date.month].lower()
        return month_name
    except ValueError:
        return "Período inválido"
    finally:
        locale.setlocale(locale.LC_TIME, '')