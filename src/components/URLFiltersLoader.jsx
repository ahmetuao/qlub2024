import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { setFilters } from '../redux/Actions/actions'

function URLFiltersLoader() {
  const dispatch = useDispatch()
  const location = useLocation()
  const productsLoaded = useSelector((state) => state.products.productsLoaded)

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const filtersFromURL = {}

    for (const [key, value] of queryParams.entries()) {
      if (key === 'priceRange') {
        // 'priceRange' değerini bir diziye dönüştür
        filtersFromURL[key] = value.split(',').map(Number)
      } else {
        filtersFromURL[key] = value
      }
    }

    console.log(filtersFromURL, 'filtersFromURL')

    if (Object.keys(filtersFromURL).length > 0) {
      console.log('filtreler aktif')
      dispatch(setFilters(filtersFromURL))
    }
  }, [])

  return null 
}

export default URLFiltersLoader
