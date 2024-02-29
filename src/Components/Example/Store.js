import {configureStore,combineReducers} from '@reduxjs/toolkit';
import todoReducer from '../Feauters/Todo/TodoSlice';
import cartReducer from '../CartSlice';
const rootReducer = combineReducers({
    todo: todoReducer,
    cart: cartReducer,
  });
  
  export const Store = configureStore({
    reducer: rootReducer,
  });