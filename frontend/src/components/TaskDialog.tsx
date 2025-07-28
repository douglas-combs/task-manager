import React, { memo, useCallback, useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Divider,
  useTheme,
} from '@mui/material'
import type { Task, TaskFormData } from '../types'
import { isValidTaskTitle } from '../utils'
import { DIALOG_SETTINGS } from '../constants'

interface TaskDialogProps {
  open: boolean
  editingTask: Task | null
  onClose: () => void
  onSubmit: (formData: TaskFormData) => Promise<void>
}

const TaskDialog: React.FC<TaskDialogProps> = memo(({
  open,
  editingTask,
  onClose,
  onSubmit,
}) => {
  const theme = useTheme()
  const [formData, setFormData] = useState<TaskFormData>({ title: '', description: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update form data when editing task changes
  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description || '',
      })
    } else {
      setFormData({ title: '', description: '' })
    }
  }, [editingTask])

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      onClose()
    }
  }, [onClose, isSubmitting])

  const handleSubmit = useCallback(async () => {
    if (!isValidTaskTitle(formData.title) || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      handleClose()
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Task submission failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, onSubmit, handleClose, isSubmitting])

  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      handleSubmit()
    }
  }, [handleSubmit])

  const handleTitleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, title: event.target.value }))
  }, [])

  const handleDescriptionChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, description: event.target.value }))
  }, [])

  const isFormValid = isValidTaskTitle(formData.title)

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: theme.shadows[DIALOG_SETTINGS.DIALOG_ELEVATION],
        }
      }}
      aria-labelledby="task-dialog-title"
      aria-describedby="task-dialog-description"
    >
      <DialogTitle
        id="task-dialog-title"
        sx={{
          fontSize: '1.5rem',
          fontWeight: 600,
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {editingTask ? 'Edit Task' : 'Create New Task'}
      </DialogTitle>
      <Divider />
      <DialogContent 
        sx={{ pt: 3 }}
        id="task-dialog-description"
        onKeyDown={handleKeyPress}
      >
        <TextField
          autoFocus
          margin="dense"
          label="Task Title"
          fullWidth
          variant="outlined"
          value={formData.title}
          onChange={handleTitleChange}
          sx={{ mb: 3 }}
          placeholder="Enter a descriptive task title..."
          required
          error={formData.title.length > 0 && !isFormValid}
          helperText={
            formData.title.length > 0 && !isFormValid 
              ? 'Task title is required' 
              : ''
          }
          aria-describedby="title-helper-text"
          disabled={isSubmitting}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={formData.description}
          onChange={handleDescriptionChange}
          placeholder="Add any additional details about this task..."
          aria-describedby="description-helper-text"
          disabled={isSubmitting}
        />
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button 
          onClick={handleClose} 
          size="large"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isFormValid || isSubmitting}
          size="large"
          sx={{ px: 3 }}
        >
          {isSubmitting 
            ? 'Saving...' 
            : editingTask 
              ? 'Update Task' 
              : 'Create Task'
          }
        </Button>
      </DialogActions>
    </Dialog>
  )
})

TaskDialog.displayName = 'TaskDialog'

export default TaskDialog 