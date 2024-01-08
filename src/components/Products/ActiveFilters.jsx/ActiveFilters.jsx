import { Box, Chip } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setFilters } from '../../../redux/Actions/actions'

function ActiveFilters() {
  const filters = useSelector((state) => {
    // searchTerm hariç diğer tüm filtreleri al
    const { searchTerm, ...otherFilters } = state.filters.filters
    return otherFilters
  })

  const searchTerm = useSelector((state) => state.filters.searchTerm)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleDelete = (filterKey) => {
    // Güncellenmiş filtreleri oluştur
    const updatedFilters = { ...filters }
    delete updatedFilters[filterKey]

    // Redux store'u güncelle (searchTerm dahil)
    dispatch(setFilters({ ...updatedFilters, searchTerm }))

    // URL'deki query parametrelerini güncelle (searchTerm hariç)
    const searchParams = new URLSearchParams()

    // Filtreleri URL query parametrelerine ekle
    for (const key in updatedFilters) {
      if (updatedFilters[key]) {
        searchParams.set(key, updatedFilters[key])
      }
    }

    navigate({ search: searchParams.toString() })
  }

  const getFilterLabel = (filterKey, filterValue) => {
    switch (filterKey) {
      case 'inStock':
        return 'In Stock'
      case 'newArrival':
        return 'New Arrivals'
      case 'lastItems':
        return 'Last Items'
      case 'soldOut':
        return 'Sold Out'
      case 'priceRange':
        return `Price: ${filterValue[0]} - ${filterValue[1]}`
      case 'sort':
        return filterValue === 'lowToHigh'
          ? 'Low To High Price'
          : 'High To Low Price'
      case 'rate':
        return filterValue === 'lowToHigh'
          ? 'Low To High Rate'
          : 'High To Low Rate'
      default:
        return `${filterKey}: ${filterValue}`
    }
  }

  const hasActiveFilters = Object.keys(filters).some((key) => filters[key])

  return (
    <>
      {hasActiveFilters ? (
        <Box
          sx={{
            display: 'flex',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          {Object.keys(filters).map(
            (key) =>
              filters[key] && (
                <Chip
                  key={key}
                  label={getFilterLabel(key, filters[key])}
                  onDelete={() => handleDelete(key)}
                  color="primary"
                />
              ),
          )}
        </Box>
      ) : null}
    </>
  )
}

export default ActiveFilters
