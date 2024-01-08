// actions.js
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../../services/firebaseConfig'
import {
  FETCH_PRODUCTS_FAIL,
  FETCH_PRODUCTS_START,
  FETCH_PRODUCTS_SUCCESS,
  REMOVE_FILTER,
  RESET_FILTERS,
  SET_FILTERS,
  SET_SEARCH_TERM
} from './actionTypes'

export const fetchProducts = () => async (dispatch) => {
  dispatch({ type: FETCH_PRODUCTS_START })

  try {
    const collectionRef = collection(db, 'products')
    onSnapshot(
      collectionRef,
      (snapshot) => {
        const products = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        dispatch({
          type: FETCH_PRODUCTS_SUCCESS,
          payload: products,
        })
      },
      (error) => {
        console.error('Error fetching products:', error)
        dispatch({ type: FETCH_PRODUCTS_FAIL })
      },
    )
  } catch (error) {
    console.error('Error setting up snapshot:', error)
    dispatch({ type: FETCH_PRODUCTS_FAIL })
  }
}

export const setFilters = (filters) => ({
  type: SET_FILTERS,
  payload: filters,
})

export const resetFilters = () => ({
  type: RESET_FILTERS,
})

export const setSearchTerm = (term) => ({
  type: SET_SEARCH_TERM,
  payload: term,
})

export const removeFilter = (filterKey) => (dispatch, getState) => {
  // Mevcut filtreleri al
  const currentFilters = getState().filters.filters

  // Kaldırılacak filtreyi çıkar
  const updatedFilters = { ...currentFilters }
  delete updatedFilters[filterKey]

  // Filtreleri güncelle
  dispatch({
    type: REMOVE_FILTER,
    payload: updatedFilters,
  })
}
