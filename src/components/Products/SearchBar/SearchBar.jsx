import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setSearchTerm } from '../../../redux/Actions/actions'

const SearchBar = () => {
  const [term, setTerm] = useState('')
  const dispatch = useDispatch()

  const handleSearch = (e) => {
    console.log('denemedd')
    e.preventDefault()
    dispatch(setSearchTerm(term))
  }

  return (
    <Box sx={{ marginLeft: { md: 'auto' }, marginBottom: { xs: '1rem', md: '0' } }}>
      <form
        style={{ display: 'flex', alignItems: 'center' }}
        onSubmit={handleSearch}
      >
        <TextField
          id="outlined-basic"
          label="Search Products"
          variant="outlined"
          onChange={(e) => setTerm(e.target.value)}
          value={term}
          placeholder="Search products"
          type="text"
        />
        <Button
          sx={{
            height: '46px',
            width: '46px !important',
            marginLeft: '1rem',
            padding: '0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          variant="contained"
          color="success"
          type="submit"
        >
          <SearchIcon />
        </Button>
      </form>
    </Box>
  )
}

export default SearchBar
