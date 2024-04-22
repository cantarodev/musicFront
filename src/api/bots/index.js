import { applyPagination } from 'src/utils/apply-pagination';
import { deepCopy } from 'src/utils/deep-copy';
import { wait } from 'src/utils/wait';

import { getBots, createBot, deleteBot, updateBot } from './data';

class BotsApi {
  async getBots(request = {}) {
    const { filters, page, rowsPerPage, userId } = request;
    let bots = deepCopy(await getBots(userId));
    let data = bots;
    let count = data.length;

    if (typeof filters !== 'undefined') {
      data = data.filter((product) => {
        if (typeof filters.name !== 'undefined' && filters.name !== '') {
          const nameMatched = product.name.toLowerCase().includes(filters.name.toLowerCase());

          if (!nameMatched) {
            return false;
          }
        }

        return true;
      });
      count = data.length;
    }

    if (typeof page !== 'undefined' && typeof rowsPerPage !== 'undefined') {
      data = applyPagination(data, page, rowsPerPage);
    }

    return Promise.resolve({
      data,
      count,
    });
  }

  async createBot(request) {
    const { id, tag, name, description } = request;

    await wait(1000);

    return new Promise((resolve, reject) => {
      try {
        // Check if a user already exists
        if (id) {
          updateBot(id, name, description).then((data) => {
            if (data.status !== 'SUCCESS') {
              reject(new Error(data.message));
              return;
            }

            resolve(data);
          });
        } else {
          createBot(tag, name, description).then((data) => {
            if (data.status !== 'SUCCESS') {
              reject(new Error(data.message));
              return;
            }

            resolve(data);
          });
        }
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async deleteBot(request) {
    const { botId } = request;
    await wait(500);

    return new Promise((resolve, reject) => {
      try {
        deleteBot(botId).then((data) => {
          if (!data?.status) {
            reject(new Error('Por favor, inténtalo más tarde.'));
            return;
          }

          resolve(data);
        });
      } catch (err) {
        reject(new Error('Internal server error'));
      }
    });
  }

  async updateBot(request) {
    const { id, name, description } = request;

    await wait(1000);

    return new Promise((resolve, reject) => {
      try {
        // Check if a user already exists
        updateBot(id, name, description).then((data) => {
          if (data.status !== 'SUCCESS') {
            reject(new Error(data.message));
            return;
          }

          resolve(data);
        });
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }
}

export const botsApi = new BotsApi();
