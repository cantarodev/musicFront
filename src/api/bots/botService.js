import { applyPagination } from 'src/utils/apply-pagination';

import { getBots, createBot, deleteBot, updateBot } from './botApi';

class BotsApi {
  async getBots(request = {}) {
    const { filters, page, rowsPerPage } = request;
    let { data } = await getBots();
    console.log(data);

    let count = data.length;

    if (filters && filters.name) {
      data = data.filter((bot) => bot.name.toLowerCase().includes(filters.name.toLowerCase()));
    }

    if (page && rowsPerPage) {
      data = applyPagination(data, page, rowsPerPage);
    }

    return {
      data,
      count,
    };
  }

  async createBot(request = {}) {
    const { bot_id, identifier_tag, name, description, required_clave_sol } = request;
    console.log(bot_id);

    if (bot_id) {
      return await updateBot(bot_id, name, description, required_clave_sol);
    }
    return await createBot(name, description, identifier_tag, required_clave_sol);
  }

  async deleteBot(request) {
    const { botId } = request;
    return await deleteBot(botId);
  }

  async updateBot(request) {
    const { id, name, description } = request;
    return await updateBot(id, name, description);
  }
}

export const botsApi = new BotsApi();
