import React, { memo } from 'react'
import {
  Box,
  CircularProgress,
  Typography,
} from '@mui/material'

interface LoadingSpinnerProps {
  message?: string
  size?: number
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = memo(({ 
  message = 'Loading...',
  size = 40 
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
        gap: 2,
      }}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <CircularProgress size={size} aria-hidden="true" />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  )
})

LoadingSpinner.displayName = 'LoadingSpinner'

export default LoadingSpinner 