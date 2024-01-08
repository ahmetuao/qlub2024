// filtersReducer.js

import {
  FETCH_PRODUCTS_SUCCESS,
  REMOVE_FILTER,
  RESET_FILTERS,
  SET_FILTERS,
  SET_SEARCH_TERM
} from '../Actions/actionTypes'

const applyFilters = (products, filters) => {
  let filteredProducts = [...products]

  console.log(filters, 'burası filters')
  if (filters.searchTerm) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.title
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        product.description
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()),
    )
    console.log(filteredProducts, 'search gil')
  }

  // Eğer hem 'soldOut' hem de 'inStock' filtreleri seçiliyse tüm ürünleri döndür
  if (filters.soldOut && filters.inStock) {
    return filteredProducts
  }

  // Yeni eklenen ürünleri öncelikli olarak filtreleme
  if (filters.newArrival) {
    filteredProducts = filteredProducts.sort(
      (a, b) => b.addedDate.seconds - a.addedDate.seconds,
    )
    //.slice(0, 2)
  }

  filteredProducts.sort((a, b) => {
    if (filters.sort === 'lowToHigh') {
      return a.price - b.price || compareRates(a, b, filters.rate)
    } else if (filters.sort === 'highToLow') {
      return b.price - a.price || compareRates(a, b, filters.rate)
    }
    return compareRates(a, b, filters.rate) // Eğer fiyat sıralaması yoksa sadece puan sıralaması
  })

  // Diğer filtreleri uygulama
  return filteredProducts.filter((product) => {
    for (const filterKey in filters) {
      const filterValue = filters[filterKey]
      // Filtre değeri varsa ve ürün bu filtreye uymuyorsa, bu ürünü hariç tut
      if (
        filterKey !== 'newArrival' &&
        filterValue &&
        !doesProductMeetFilterCriteria(product, filterKey, filterValue)
      ) {
        return false
      }
    }
    return true
  })
}

// Puan sıralaması yardımcı fonksiyonu
const compareRates = (a, b, rateSort) => {
  if (!rateSort) return 0 // Eğer puan sıralaması yoksa hiçbir şey yapma
  if (rateSort === 'lowToHigh') {
    return (a.rate || 0) - (b.rate || 0)
  } else if (rateSort === 'highToLow') {
    return (b.rate || 0) - (a.rate || 0)
  }
  return 0
}

// Ürünün belirli bir filtreye uyup uymadığını kontrol eden fonksiyon
const doesProductMeetFilterCriteria = (product, filterKey, filterValue) => {
  switch (filterKey) {
    case 'inStock':
      return product.stock > 0
    case 'soldOut':
      return product.stock === 0
    case 'lastItems':
      return product.stock <= 3 && product.stock !== 0
    case 'priceRange':
      const [minPrice, maxPrice] = filterValue
      return product.price >= minPrice && product.price <= maxPrice
    // Diğer filtreler için benzer kontroller
    default:
      return true
  }
}

const initialState = {
  filters: {},
  filteredProducts: [],
  products: [],
  searchTerm: '',
  filtersLoadedFromURL: false, // URL'den filtrelerin yüklendiğini belirtir
}

const filtersReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS_SUCCESS:
      if (state.filtersLoadedFromURL) {
        // URL'den filtreler yüklenmediyse, filtreleme işlemini yap
        const filteredProducts = applyFilters(action.payload, state.filters)
        console.log('YES filtersLoadedFromURL', filteredProducts)
        return {
          ...state,
          products: action.payload,
          filteredProducts: filteredProducts,
        }
      } else {
        // URL'den filtreler yüklendi ve SET_FILTERS tarafından uygulandıysa,
        // ürünleri güncelle ama filtrelenmiş ürünleri tekrar hesaplama
        console.log(action.payload, 'NO filtersLoadedFromURL action payload')
        return {
          ...state,
          products: action.payload,
        }
      }

    case SET_FILTERS:
      // Filtreler güncellendiğinde, filtrelenmiş ürün listesini güncelle
      if (!state.filtersLoadedFromURL) {
        console.log(
          'Filtreler güncellenmedidi, yeni filtrelenmiş ürünler:',
          action.payload,
          'action payload',
        )
        return {
          ...state,
          filters: action.payload,
          filtersLoadedFromURL: true, // URL'den filtreler yüklendi ve uygulandı
          filteredProducts: applyFilters(state.products, action.payload),
        }
      } else {
        const newFilteredProducts = applyFilters(state.products, action.payload)
        console.log(
          'Filtreler güncellendi, yeni filtrelenmiş ürünler:',
          newFilteredProducts,
          action.payload,
          'action payload',
        )
        return {
          ...state,
          filters: action.payload,
          filteredProducts: newFilteredProducts,
        }
      }

    case RESET_FILTERS:
      return {
        ...state,
        filters: {
          ...initialState.filters,
          searchTerm: state.filters.searchTerm, // searchTerm'ı koru
        },
        // filteredProducts'ı yeniden hesapla ama searchTerm'ı koru
        filteredProducts: applyFilters(state.products, {
          ...initialState.filters,
          searchTerm: state.filters.searchTerm,
        }),
      }

    case SET_SEARCH_TERM:
      // Filtreler güncellenirken, mevcut filtreler korunmalı ve sadece searchTerm güncellenmeli
      const updatedFilters = { ...state.filters, searchTerm: action.payload }

      const searchFilteredProducts = applyFilters(
        state.products,
        updatedFilters,
      )
      console.log(
        'Filtreler searche göre güncellendi, yeni filtrelenmiş ürünler:',
        searchFilteredProducts,
        updatedFilters,
        'updated filters',
      )

      return {
        ...state,
        searchTerm: action.payload,
        filters: updatedFilters,
        filteredProducts: searchFilteredProducts,
      }

    case REMOVE_FILTER:
      const newFilters = { ...state.filters }
      delete newFilters[action.payload]

      console.log(newFilters, 'new filters')
      return {
        ...state,
        filters: newFilters,
      }

    default:
      return state
  }
}

export default filtersReducer
