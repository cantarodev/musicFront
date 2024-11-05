import { combineReducers } from '@reduxjs/toolkit';

import { reducer as calendarReducer } from 'src/slices/calendar';
import { reducer as chatReducer } from 'src/slices/chat';
import { reducer as kanbanReducer } from 'src/slices/kanban';
import { reducer as mailReducer } from 'src/slices/mail';
import { reducer as accountReducer } from 'src/slices/account';
import { reducer as reportDetailsReducer } from 'src/slices/report';
import { reducer as filteredResultsReducer } from 'src/slices/filtered-results';

export const rootReducer = combineReducers({
  calendar: calendarReducer,
  chat: chatReducer,
  kanban: kanbanReducer,
  mail: mailReducer,
  account: accountReducer,
  report: reportDetailsReducer,
  filteredResults: filteredResultsReducer,
});
