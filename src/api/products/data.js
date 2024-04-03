import { subDays, subHours } from 'date-fns';
import axios from 'axios';

const now = new Date();

// export const getSolKeyAccounts = [
//   {
//     id: '5ece2c077e39da27658aa8a9',
//     attributes: ['Healthcare'],
//     category: 'healthcare',
//     createdAt: subDays(now, 1).getTime(),
//     currency: '$',
//     image: '/assets/products/product-1.png',
//     inStock: true,
//     isAvailable: true,
//     isShippable: false,
//     name: 'Healthcare Erbology',
//     price: 23.99,
//     quantity: 85,
//     sku: '401_1BBXBK',
//     status: 'published',
//     updatedAt: subHours(now, 6).getTime(),
//     variants: 2,
//   },
//   {
//     id: '5ece2c0d16f70bff2cf86cd8',
//     attributes: ['Makeup'],
//     category: 'makeup',
//     createdAt: subDays(now, 3).getTime(),
//     currency: '$',
//     image: '/assets/products/product-2.png',
//     inStock: false,
//     isAvailable: false,
//     isShippable: true,
//     name: 'Makeup Lancome Rouge',
//     price: 95.0,
//     quantity: 0,
//     sku: '978_UBFGJC',
//     status: 'published',
//     updatedAt: subDays(subHours(now, 8), 2).getTime(),
//     variants: 1,
//   },
//   {
//     id: '5ece2c123fad30cbbff8d060',
//     attributes: ['Variety of styles'],
//     category: 'jewelry',
//     createdAt: subDays(now, 6).getTime(),
//     currency: '$',
//     image: null,
//     inStock: true,
//     isAvailable: true,
//     isShippable: false,
//     name: 'Layering Bracelets Collection',
//     price: 155.0,
//     quantity: 48,
//     sku: '211_QFEXJO',
//     status: 'draft',
//     updatedAt: subDays(subHours(now, 2), 1).getTime(),
//     variants: 5,
//   },
//   {
//     id: '5ece2c1be7996d1549d94e34',
//     attributes: ['Skincare'],
//     category: 'skincare',
//     createdAt: subDays(now, 12).getTime(),
//     currency: '$',
//     image: '/assets/products/product-4.png',
//     inStock: true,
//     isAvailable: false,
//     isShippable: true,
//     name: 'Skincare Necessaire',
//     price: 17.99,
//     quantity: 5,
//     sku: '321_UWEAJT',
//     status: 'published',
//     updatedAt: subDays(subHours(now, 7), 1).getTime(),
//     variants: 1,
//   },
//   {
//     id: 'b393ce1b09c1254c3a92c827',
//     attributes: ['Skincare'],
//     category: 'skincare',
//     createdAt: subDays(now, 4).getTime(),
//     currency: '$',
//     image: '/assets/products/product-5.png',
//     inStock: true,
//     isAvailable: false,
//     isShippable: true,
//     name: 'Skincare Soja CO',
//     price: 65.99,
//     quantity: 10,
//     sku: '592_LDKDI',
//     status: 'draft',
//     updatedAt: subDays(subHours(now, 1), 1).getTime(),
//     variants: 1,
//   },
//   {
//     id: 'a6ede15670da63f49f752c89',
//     attributes: ['Makeup'],
//     category: 'makeup',
//     createdAt: subDays(now, 6).getTime(),
//     currency: '$',
//     image: '/assets/products/product-6.png',
//     inStock: true,
//     isAvailable: false,
//     isShippable: true,
//     name: 'Makeup Lipstick',
//     price: 76.99,
//     quantity: 22,
//     sku: '324_DKSEKD',
//     status: 'draft',
//     updatedAt: subDays(subHours(now, 3), 3).getTime(),
//     variants: 1,
//   },
//   {
//     id: 'bcad5524fe3a2f8f8620ceda',
//     attributes: ['Healthcare'],
//     category: 'healthcare',
//     createdAt: subDays(now, 7).getTime(),
//     currency: '$',
//     image: '/assets/products/product-7.png',
//     inStock: true,
//     isAvailable: false,
//     isShippable: true,
//     name: 'Healthcare Ritual',
//     price: 115.2,
//     quantity: 15,
//     sku: '598_DOKEII',
//     status: 'published',
//     updatedAt: subDays(subHours(now, 5), 6).getTime(),
//     variants: 1,
//   },
// ];

export const getSolKeyAccounts = async (userId) => {
  try {
    const { data } = await axios.get(`http://localhost:5000/api/v1/solKeyAccount/${userId}`);
    const solKeyAccounts = JSON.parse(data.solKeyAccounts);
    return solKeyAccounts;
  } catch (error) {
    const { response } = error;
    return response.data;
  }
};

export const createSolKeyAccount = async (userId, ruc, username, password) => {
  try {
    const { data } = await axios.post('http://localhost:5000/api/v1/solKeyAccount/', {
      userId,
      ruc,
      username,
      password,
    });
    return data;
  } catch (error) {
    const { response } = error;
    return response.data;
  }
};

export const updateSolKeyAccount = async (id, ruc, username, password) => {
  try {
    const { data } = await axios.put('http://localhost:5000/api/v1/solKeyAccount/', {
      id,
      ruc,
      username,
      password,
    });
    return data;
  } catch (error) {
    const { response } = error;
    return response.data;
  }
};
