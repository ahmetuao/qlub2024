// rootReducer.js
import { combineReducers } from 'redux';
import filtersReducer from './filterReducers';
import productsReducer from './productReducers';

const rootReducer = combineReducers({
  products: productsReducer,
  filters: filtersReducer
});

export default rootReducer;
