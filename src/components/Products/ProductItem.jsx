import DeleteIcon from '@mui/icons-material/Delete'
import { Avatar, Box, Button, Grid, IconButton } from '@mui/material'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import noImage from '../../assets/images/no-image.webp'
import { useModal } from '../../Context/ModalContext'
import ProductDetailsModal from '../Modal/ProductDetailsModal'

export default function ProductItem({ product }) {
  //MODAL
  const { openModal } = useModal()
  const [isValidImage, setIsValidImage] = useState(false)

  const openHandleModal = (product) => {
    openModal(<ProductDetailsModal product={product} />)
  }

  useEffect(() => {
    const image = new Image()
    image.src = product.imageUrl
    image.onload = () => setIsValidImage(true)
    image.onerror = () => setIsValidImage(false)
  }, [product.imageUrl])

  return (
    <Grid item xs={12} sm={'5'} md={'4'} lg={3} xxl={2}>
      <Card
        sx={{
          maxWidth: 345,
          height: '100%',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {product.stock <= 3 && product.stock !== 0 ? (
          <Box
            sx={{
              backgroundImage: `url(https://i.ibb.co/N9hfHHc/low-stock.jpg)`,
              position: 'absolute',
              right: 'calc(50% - 100px)',
              top: '20px',
              zIndex: '9',
              width: '200px',
              height: '200px',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              borderRadius: '100%',
              opacity: '.9',
            }}
          ></Box>
        ) : product.stock == 0 ? (
          <Box
            sx={{
              backgroundImage: `url(https://i.ibb.co/P1rk6RG/sold-out.png)`,
              position: 'absolute',
              right: 'calc(50% - 100px)',
              top: '20px',
              zIndex: '9',
              width: '200px',
              height: '200px',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              borderRadius: '100%',
              opacity: '.6',
            }}
          ></Box>
        ) : null}
        <CardMedia
          sx={{
            height: 240,
            position: 'relative',
            backgroundSize: 'contain !important;',
            overflow: 'hidden',
            ...(isValidImage && product.imageApproved
              ? {
                  '&:after': {
                    content: "''",
                    position: 'absolute',
                    backgroundImage: `url(${product.imageUrl})`,
                    width: '90%',
                    height: '200px',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    marginLeft: '5%',
                    marginTop: '20px',
                  },
                  '&:before': {
                    content: "''",
                    position: 'absolute',
                    backgroundImage: `url(${product.imageUrl})`,
                    width: '100%',
                    height: '100%',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPositionX: 'center',
                    backgroundPositionY: 'top',
                    opacity: '.8',
                    filter: 'blur(5px)',
                  },
                }
              : {
                  // '&:before': {
                  //   content: "''",
                  //   position: 'absolute',
                  //   backgroundImage: `url(${noImage})`,
                  //   width: '100%',
                  //   height: '100%',
                  //   backgroundSize: 'cover',
                  //   backgroundPositionX: 'center',
                  //   backgroundPositionY: 'top'
                  // },
                  '&:after': {
                    content: "''",
                    position: 'absolute',
                    backgroundImage: `url(${noImage})`,
                    width: '100%',
                    height: '100%',
                    backgroundSize: 'contain',
                    backgroundPositionX: 'center',
                    backgroundPositionY: 'top',
                  },
                }),
          }}
          title="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {product?.title}
          </Typography>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="body2" color="text.secondary">
              Stock: {product?.stock}
            </Typography>
            <Typography
              sx={{ marginLeft: '1rem' }}
              variant="body2"
              color="text.secondary"
            >
              Rate: {product?.rate}
            </Typography>
          </Box>
          <Typography
            sx={{ marginTop: '1rem' }}
            variant="body2"
            color="text.secondary"
          >
            {product?.description}
          </Typography>
        </CardContent>
        <CardActions sx={{ marginTop: 'auto' }}>
          <Button size="small">$ {product?.price}</Button>
          <Button size="small" onClick={() => openHandleModal(product)}>
            Edit
          </Button>
          {!product.constant ? (
            <Avatar
              sx={{ bgcolor: '#dedede', marginLeft: 'auto !important' }}
              aria-label="recipe"
            >
              <IconButton aria-label="settings">
                <DeleteIcon sx={{ color: '#ffffff' }} />
              </IconButton>
            </Avatar>
          ) : null}
        </CardActions>
      </Card>
    </Grid>
  )
}
