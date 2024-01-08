// productsReducer.js
import {
  FETCH_PRODUCTS_FAIL,
  FETCH_PRODUCTS_START,
  FETCH_PRODUCTS_SUCCESS
} from '../Actions/actionTypes'

const getProductPriceRange = (products) => {
  let minPrice = products.length ? products[0].price : 0
  let maxPrice = minPrice

  products.forEach((product) => {
    if (product.price < minPrice) minPrice = product.price
    if (product.price > maxPrice) maxPrice = product.price
  })

  return { minPrice, maxPrice }
}

const initialState = {
  products: [],
  loading: true, // Loader durumu eklendi
  minPrice: 0,
  maxPrice: 0,
}

const productsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS_START:
      return {
        ...state,
        loading: true,
      }
    case FETCH_PRODUCTS_SUCCESS:
      const { minPrice, maxPrice } = getProductPriceRange(action.payload)
      return {
        ...state,
        products: action.payload,
        minPrice: minPrice,
        maxPrice: maxPrice,
        loading: false,
      }
    case FETCH_PRODUCTS_FAIL:
      return {
        ...state,
        loading: false,
      }
    default:
      return state
  }
}

export default productsReducer
