import { Button, Grid, TextField, Typography } from '@mui/material'
import { doc, updateDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useModal } from '../../Context/ModalContext'
import { db } from '../../services/firebaseConfig'

export default function ProductDetailsModal({ product }) {
  const [values, setValues] = useState({
    title: product.title || '',
    description: product.description || '',
    price: product.price || '',
    rate: product.rate || '',
    stock: product.stock || '',
    addedDate: product.addedDate || '',
  })

  const handleChange = (event) => {
    const { id, value } = event.target

    if (id === 'price' || id === 'stock') {
      setValues({ ...values, [id]: parseFloat(value) })
    } else {
      setValues({ ...values, [id]: value })
    }
  }

  const { closeModal } = useModal()

  const handleSubmit = async () => {
    try {
      const productRef = doc(db, 'products', product.id) 
      await updateDoc(productRef, {
        ...values,
      })
      console.log('Product updated successfully')
      closeModal()
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  useEffect(() => {
    console.log(values, 'values')
  }, [values])
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6">{product.title}</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          id="title"
          label="Title"
          variant="outlined"
          onChange={handleChange}
          value={values.title}
          placeholder="Update Title"
          type="text"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          id="description"
          label="Description"
          variant="outlined"
          onChange={handleChange}
          value={values.description}
          placeholder="Update Description"
          type="text"
          multiline
          rows={4}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          id="price"
          label="Price"
          variant="outlined"
          onChange={handleChange}
          value={values.price}
          placeholder="Update price"
          type="number"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          id="rate"
          label="Rate"
          variant="outlined"
          onChange={handleChange}
          value={values.rate}
          placeholder="Update rate"
          type="number"
          disabled
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          id="stock"
          label="Stock"
          variant="outlined"
          onChange={handleChange}
          value={values.stock}
          placeholder="Update stock"
          type="number"
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          onClick={handleSubmit}
          type="button"
          variant="contained"
          color="primary"
        >
          Update
        </Button>
      </Grid>
    </Grid>
  )
}
