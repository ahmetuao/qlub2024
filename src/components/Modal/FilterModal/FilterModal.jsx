import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { useModal } from '../../../Context/ModalContext'
import { resetFilters, setFilters } from '../../../redux/Actions/actions'
import PriceRange from './PriceRange'

export default function FilterModal() {
  const savedFilters = useSelector((state) => state.filters.filters)

  const minPrice = useSelector((state) => state.products.minPrice)
  const maxPrice = useSelector((state) => state.products.maxPrice)

  const [values, setValues] = useState({
    ...savedFilters, // Redux store'dan alınan filtre değerlerini kullan
    priceRange: savedFilters.priceRange || [minPrice, maxPrice],
    sort: savedFilters.sort || '',
    rate: savedFilters.rate || '',
  })

  // const [values, setValues] = useState({
  //   inStock: '',
  //   soldOut: '',
  //   newArrival: '',
  //   lastItems: '',
  //   priceRange: [minPrice, maxPrice],
  //   sort: '',
  //   rate: '',
  // })

  const { closeModal } = useModal()
  const dispatch = useDispatch()
  const navigate = useNavigate() 
  const location = useLocation()

  const handleSubmit = () => {
    dispatch(setFilters(values)) // Filtre değerlerini gönder
    updateQueryParams(values) // URL'i güncelle
    closeModal()
  }

  const updateQueryParams = (filters) => {
    const searchParams = new URLSearchParams()

    // Filtreleri URL query parametrelerine dönüştür
    for (const key in filters) {
      if (filters[key] && key !== 'searchTerm') {
        searchParams.set(key, filters[key])
      }
    }

    // URL'i güncelle
    navigate({ search: searchParams.toString() }) 
  }

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.checked })
  }

  const handlePriceRangeChange = (newValue) => {
    setValues({ ...values, priceRange: newValue })
  }

  const handleSortChange = (event) => {
    setValues({ ...values, sort: event.target.value })
  }

  const handleRateSortChange = (event) => {
    setValues({ ...values, rate: event.target.value })
  }

  useEffect(() => {
    console.log(values, 'this is values for filters')
  }, [values])

  const handleClearFilters = () => {
    dispatch(resetFilters()) // Redux store'daki filtreleri sıfırla
    setValues({
      // Yerel state'i sıfırla
      inStock: '',
      soldOut: '',
      newArrival: '',
      lastItems: '',
      priceRange: [minPrice, maxPrice],
      sort: '',
      rate: '',
    })
    closeModal()
    navigate({ pathname: location.pathname, search: '' }) // Sadece query parametreleri sıf
  }

  return (
    <>
      <Box sx={{ borderBottom: '2px solid #000000', marginBottom: '2rem' }}>
        <Typography variant="h6" color={'black'}>
          Filter Products
        </Typography>
      </Box>
      <Box>
        <FormGroup>
          <Select
            value={values.sort || ''}
            onChange={handleSortChange}
            displayEmpty
            fullWidth
            sx={{ marginBottom: '1rem' }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="lowToHigh">Lowest Price to Highest Price</MenuItem>
            <MenuItem value="highToLow">Highest Price to Lowest Price</MenuItem>
          </Select>
          <Select
            value={values.rate || ''}
            onChange={handleRateSortChange}
            displayEmpty
            fullWidth
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="lowToHigh">Lowest Rate to Highest Rate</MenuItem>
            <MenuItem value="highToLow">Highest Rate to Lowest Rate</MenuItem>
          </Select>

          <PriceRange
            value={values.priceRange}
            onPriceRangeChange={handlePriceRangeChange}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />

          <Box sx={{ marginTop: '1rem', display: 'flex', flexDirection: 'column' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.newArrival}
                  onChange={handleChange}
                  name="newArrival"
                />
              }
              label="New Arrival"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.soldOut}
                  onChange={handleChange}
                  name="soldOut"
                />
              }
              label="Sold Out"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.inStock}
                  onChange={handleChange}
                  name="inStock"
                />
              }
              label="In Stock"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.lastItems}
                  onChange={handleChange}
                  name="lastItems"
                />
              }
              label="Last Items"
            />
          </Box>

          <Button
            onClick={handleSubmit}
            sx={{
              marginTop: '2rem',
            }}
            variant="contained"
            color="primary"
            fullWidth
          >
            Submit
          </Button>
          <Button
            onClick={handleClearFilters}
            sx={{
              marginTop: '2rem',
            }}
            variant="contained"
            color="error"
            fullWidth
          >
            Clear Filters
          </Button>
        </FormGroup>
      </Box>
    </>
  )
}
