import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import React from 'react'

function valuetext(value) {
  return `${value}`
}

const minDistance = 10

export default function PriceRange({
  value,
  onPriceRangeChange,
  minPrice,
  maxPrice,
}) {
  const marks = [
    {
      value: minPrice,
      label: `$ ${minPrice}`,
    },
    {
      value: maxPrice,
      label: `$ ${maxPrice}`,
    },
  ]

  const handleChange2 = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance)
        onPriceRangeChange([clamped, clamped + minDistance])
      } else {
        const clamped = Math.max(newValue[1], minDistance)
        onPriceRangeChange([clamped - minDistance, clamped])
      }
    } else {
      onPriceRangeChange(newValue)
    }
  }

  return (
    <Box sx={{ width: '100%', marginTop: '2rem' }}>
      <Typography
        sx={{ marginBottom: '2rem', textAlign: 'center', fontSize: '20px', fontWeight: '700', color: '#000000' }}
      >
        Price Range
      </Typography>
      <Slider
        getAriaLabel={() => 'Minimum distance shift'}
        value={value} 
        onChange={handleChange2}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
        aria-label="Always visible"
        step={1}
        marks={marks}
        valueLabelDisplay="on"
        min={minPrice} 
        max={maxPrice} 
      />
    </Box>
  )
}
