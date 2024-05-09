import { applyPagination } from 'src/utils/apply-pagination';
import { deepCopy } from 'src/utils/deep-copy';
import { wait } from 'src/utils/wait';

import { getBots, createBot, deleteBot, updateBot } from './data';

class BotsApi {
  async getBots(request = {}) {
    const { filters, page, rowsPerPage } = request;
    let bots = deepCopy(await getBots());
    let data = bots;

    if (filters && filters.name) {
      data = data.filter((bot) => bot.name.toLowerCase().includes(filters.name.toLowerCase()));
    }

    if (page !== undefined && rowsPerPage !== undefined) {
      data = applyPagination(data, page, rowsPerPage);
    }

    return {
      data,
      count: data.length,
    };
  }

  async createBot(request = {}) {
    const { bot_id, identifier_tag, name, description, required_clave_sol } = request;
    await wait(1000);
    try {
      const response = bot_id
        ? await updateBot(bot_id, name, description, required_clave_sol)
        : await createBot(name, description, identifier_tag, required_clave_sol);
      return response;
    } catch (error) {
      console.error('[Bots Api - createBot]: ', error);
      throw new Error('Internal server error');
    }
  }

  async deleteBot(request) {
    const { botId } = request;
    await wait(500);

    try {
      const response = await deleteBot(botId);
      if (!response?.status) {
        throw new Error('Por favor, inténtalo más tarde.');
      }
      return response;
    } catch (error) {
      console.error('[Bots Api - deleteBot]: ', error);
      throw new Error('Internal server error');
    }
  }

  async updateBot(request) {
    const { id, name, description } = request;
    await wait(1000);

    try {
      const response = await updateBot(id, name, description);
      if (response.status !== 'SUCCESS') {
        throw new Error(response.message);
      }
      return response;
    } catch (error) {
      console.error('[Bots Api - updateBot]: ', error);
      throw new Error('Internal server error');
    }
  }
}

export const botsApi = new BotsApi();
