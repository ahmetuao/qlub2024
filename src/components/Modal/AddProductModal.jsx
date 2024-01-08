import styled from '@emotion/styled'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Box, Button, Grid, TextField, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useModal } from '../../Context/ModalContext'
import { db } from '../../services/firebaseConfig'


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

export default function AddProductModal() {
  const [product, setProduct] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
    stock: '',
  })
  const [convertedFile, setConvertedFile] = useState(null)
  const [loader, setLoader] = useState(false)
  // Dosya seçildiğinde çalışacak fonksiyon
  // const handleFileChange = (event) => {
  //   setSelectedFile(event.target.files[0])
  // }

  useEffect(() => {
    console.log(convertedFile, 'converted file')
  }, [convertedFile])
  useEffect(() => {
    if (product.imageUrl) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result.replace(/^data:.+;base64,/, '')
        setConvertedFile(base64String)
      }
      reader.readAsDataURL(product.imageUrl)
    }
  }, [product.imageUrl])

  const { closeModal } = useModal()

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      // Dosya seçme inputu için
      setProduct({ ...product, imageUrl: e.target.files[0] })
    } else {
      // Diğer tüm inputlar için
      setProduct({ ...product, [e.target.id]: e.target.value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let imageUrl = product.imageUrl // Varsayılan olarak mevcut imageUrl'ı kullan

    // Eğer dönüştürülmüş dosya varsa, ImgBB'ye yükle
    if (convertedFile) {
      console.log('converted versiyon')
      try {
        setLoader(true)
        const response = await fetch('https://api.imgbb.com/1/upload', {
          method: 'POST',
          body: new URLSearchParams({
            key: 'ec880c3a29378e7ac0c2afc2dab7ccd4',
            image: convertedFile,
          }),
        })
        const data = await response.json()

        if (data.success) {
          imageUrl = data.data.url // ImgBB'den dönen URL'yi kullan
          setLoader(false)
        }
      } catch (error) {
        console.error('Resim yüklenirken hata oluştu:', error)
        setLoader(false)
        // Resim yükleme hatası durumunda işleme devam et
      }
    }

    try {
      const docRef = await addDoc(collection(db, 'products'), {
        title: product.title,
        description: product.description,
        price: Number(product.price),
        imageUrl: imageUrl,
        stock: Number(product.stock),
        addedDate: new Date(), // Ürün ekleme anının zamanını kaydet
      })

      const productId = docRef.id

      await updateDoc(doc(db, 'products', productId), {
        id: productId,
        constant: false,
        imageApproved: false,
      })
      console.log('Ürün başarıyla eklendi!', product)
      alert('Ürün başarıyla eklendi!')
      closeModal()
    } catch (error) {
      console.error('Ürün eklenirken hata oluştu:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ borderBottom: '2px solid #000000', marginBottom: '2rem' }}>
        <Typography variant="h6" color={'black'}>
          Add Product
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            type={'text'}
            id="title"
            label="Product Title"
            variant="outlined"
            value={product.title}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            type={'text'}
            id="description"
            label="Product Description"
            variant="outlined"
            value={product.description}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            type={'number'}
            id="price"
            label="Product Price"
            variant="outlined"
            value={product.price}
            onChange={handleChange}
          />
        </Grid>
        {/* <Grid item xs={12}>
          <TextField
            fullWidth
            type={'text'}
            id="imageUrl"
            label="Product Image URL"
            variant="outlined"
            value={product.imageUrl}
            onChange={handleChange}
          />
        </Grid> */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            type={'number'}
            id="stock"
            label="Product Stock Count"
            variant="outlined"
            value={product.stock}
            onChange={handleChange}
          />
        </Grid>
        <Grid sx={{ display: 'flex', alignItems: 'center' }} item xs={12}>
          <Typography sx={{ marginRight: '.5rem' }} variant="subtitle1">
            Upload Image
          </Typography>
          <Button
            onChange={handleChange}
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Upload file
            <VisuallyHiddenInput type="file" />
          </Button>
          {loader ? (
            <Box sx={{ display: 'flex' }}>
              <CircularProgress />
            </Box>
          ) : null}
        </Grid>
        {/* <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleUploadImage}
          >
            Upload Image
          </Button>
        </Grid> */}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" fullWidth type="submit">
            Submit
          </Button>

          {/* <input
            accept="image/*"
            style={{ display: 'none' }}
            id="raised-button-file"
            multiple
            type="file"
            onChange={handleChange} */}
        </Grid>
      </Grid>
    </form>
  )
}
