import { useState, useCallback } from 'react'
import type { SnackbarState } from '../types'

interface UseSnackbarReturn {
  snackbar: SnackbarState
  showSnackbar: (message: string, severity?: SnackbarState['severity']) => void
  hideSnackbar: () => void
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showWarning: (message: string) => void
  showInfo: (message: string) => void
}

export const useSnackbar = (): UseSnackbarReturn => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  })

  const showSnackbar = useCallback((message: string, severity: SnackbarState['severity'] = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    })
  }, [])

  const hideSnackbar = useCallback(() => {
    setSnackbar(prev => ({
      ...prev,
      open: false,
    }))
  }, [])

  const showSuccess = useCallback((message: string) => {
    showSnackbar(message, 'success')
  }, [showSnackbar])

  const showError = useCallback((message: string) => {
    showSnackbar(message, 'error')
  }, [showSnackbar])

  const showWarning = useCallback((message: string) => {
    showSnackbar(message, 'warning')
  }, [showSnackbar])

  const showInfo = useCallback((message: string) => {
    showSnackbar(message, 'info')
  }, [showSnackbar])

  return {
    snackbar,
    showSnackbar,
    hideSnackbar,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
} 