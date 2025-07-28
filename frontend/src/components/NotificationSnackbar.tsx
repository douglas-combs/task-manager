import React, { memo } from 'react'
import {
  Snackbar,
  Alert,
  useTheme,
} from '@mui/material'
import type { SnackbarState } from '../types'
import { DIALOG_SETTINGS } from '../constants'

interface NotificationSnackbarProps {
  snackbar: SnackbarState
  onClose: () => void
}

const NotificationSnackbar: React.FC<NotificationSnackbarProps> = memo(({
  snackbar,
  onClose,
}) => {
  const theme = useTheme()

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={DIALOG_SETTINGS.SNACKBAR_AUTO_HIDE_DURATION}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={snackbar.severity}
        sx={{
          width: '100%',
          borderRadius: 2,
          boxShadow: theme.shadows[3],
        }}
        role="alert"
        aria-live="assertive"
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  )
})

NotificationSnackbar.displayName = 'NotificationSnackbar'

export default NotificationSnackbar 