import FilterAltIcon from '@mui/icons-material/FilterAlt'
import { Badge, Box, Button, Grid, Stack, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddProductModal from '../components/Modal/AddProductModal'
import FilterModal from '../components/Modal/FilterModal/FilterModal'
import ActiveFilters from '../components/Products/ActiveFilters.jsx/ActiveFilters'
import ProductItem from '../components/Products/ProductItem'
import SearchBar from '../components/Products/SearchBar/SearchBar'
import { useModal } from '../Context/ModalContext'
import { fetchProducts } from '../redux/Actions/actions'

function Products() {
  const dispatch = useDispatch()
  const products = useSelector((state) => state.products.products) // Redux store'dan ürünleri al
  const filteredProducts = useSelector(
    (state) => state.filters.filteredProducts,
  ) // Filtrelenmiş ürünleri al
  const searchTerm = useSelector((state) => state.filters.searchTerm) // Arama terimini al
  const filters = useSelector((state) => state.filters.filters)

  // Aktif filtre sayısını hesapla
  const activeFiltersCount = Object.keys(filters).filter(
    (key) => filters[key] != null && filters[key] !== '',
  ).length

  const loading = useSelector((state) => state.products.loading) // Redux store'dan loading durumunu al
  //MODAL
  const { openModal } = useModal()
  const hasFilters = Object.keys(filters).length > 0 && !searchTerm

  const productsToShow =
    searchTerm && filteredProducts.length === 0
      ? []
      : filteredProducts.length > 0
      ? filteredProducts
      : products

  const openHandleModal = () => {
    openModal(<AddProductModal />)
  }

  const openFilterModal = () => {
    openModal(<FilterModal />)
  }

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center' },
          }}
        >
          <SearchBar />
          <Box sx={{ display: 'flex', marginLeft: { md: 'auto' } }}>
            <Button
              sx={{ marginLeft: 'auto' }}
              variant={'contained'}
              color={'primary'}
              onClick={openFilterModal}
            >
              Filters
              <Stack
                spacing={4}
                direction="row"
                sx={{ color: 'action.active' }}
              >
                <Badge
                  color="success"
                  badgeContent={activeFiltersCount}
                  showZero
                >
                  <FilterAltIcon sx={{ color: '#ffffff' }} />
                </Badge>
              </Stack>
            </Button>

            <Button
              sx={{ marginLeft: '1rem' }}
              variant={'contained'}
              color={'primary'}
              onClick={openHandleModal}
            >
              Add Product
            </Button>
          </Box>
        </Box>
        <h1>Products</h1>
        <ActiveFilters />
        {searchTerm && (
          <Typography variant="h6" sx={{ marginBottom: '1.5rem' }}>
            {filteredProducts.length === 0
              ? 'No Results'
              : `${filteredProducts.length} Result${
                  filteredProducts.length > 1 ? 's' : ''
                }`}{' '}
            for "{searchTerm}"
          </Typography>
        )}
        {hasFilters && products.length !== filteredProducts.length && (
          <Typography variant="h6" sx={{ marginBottom: '1.5rem' }}>
            {`${filteredProducts.length} product${
              filteredProducts.length !== 1 ? 's' : ''
            } listed`}
          </Typography>
        )}
        {!loading ? (
          products.length === 0 ? (
            <Box>
              <Typography
                variant="h6"
                sx={{ marginBottom: '1.5rem' }}
                color="danger"
              >
                No Products Available!
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {productsToShow.map((product, index) => (
                <ProductItem product={product} key={product.id} />
              ))}
            </Grid>
          )
        ) : null}
      </Box>
    </>
  )
}

export default Products
