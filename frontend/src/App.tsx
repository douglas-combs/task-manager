import React, { useState, useCallback } from 'react'
import './App.css'
import {
  Container,
  Typography,
  Box,
  Button,
  Stack,
  alpha,
  useTheme,
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import type { Task, TaskFormData, TaskStatus } from './types'
import { useTasks } from './hooks/useTasks'
import { useSnackbar } from './hooks/useSnackbar'
import { 
  StatusColumn, 
  TaskDialog, 
  TaskStats, 
  LoadingSpinner, 
  NotificationSnackbar 
} from './components'
import { SUCCESS_MESSAGES } from './constants'

const App: React.FC = () => {
  const theme = useTheme()
  const [openDialog, setOpenDialog] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  
  const {
    groupedTasks,
    stats,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    clearError,
  } = useTasks()
  
  const { snackbar, showSuccess, showError, hideSnackbar } = useSnackbar()

  const handleOpenDialog = useCallback((task?: Task) => {
    setEditingTask(task || null)
    setOpenDialog(true)
  }, [])

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false)
    setEditingTask(null)
  }, [])

  const handleSubmit = useCallback(async (formData: TaskFormData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, {
          ...formData,
          status: editingTask.status,
        })
        showSuccess(SUCCESS_MESSAGES.TASK_UPDATED)
      } else {
        await createTask(formData)
        showSuccess(SUCCESS_MESSAGES.TASK_CREATED)
      }
    } catch (error) {
      // Error is already handled by the hook and displayed via snackbar
    }
  }, [editingTask, updateTask, createTask, showSuccess])

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteTask(id)
      showSuccess(SUCCESS_MESSAGES.TASK_DELETED)
    } catch (error) {
      // Error is already handled by the hook
    }
  }, [deleteTask, showSuccess])

  const handleStatusChange = useCallback(async (task: Task, newStatus: TaskStatus) => {
    try {
      await updateTaskStatus(task.id, { status: newStatus })
      showSuccess(SUCCESS_MESSAGES.STATUS_UPDATED)
    } catch (error) {
      // Error is already handled by the hook
    }
  }, [updateTaskStatus, showSuccess])

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        py: 4 
      }}>
        <Container maxWidth="xl">
          <LoadingSpinner message="Loading tasks..." />
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
      py: 4 
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ 
          mb: 4, 
          textAlign: 'center',
          py: 3,
        }}>
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            Task Manager
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Organize your work and boost productivity
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ 
              px: 4,
              py: 1.5,
              borderRadius: 3,
              boxShadow: theme.shadows[3],
              '&:hover': {
                boxShadow: theme.shadows[6],
              }
            }}
          >
            Add New Task
          </Button>
        </Box>

        {/* Task Statistics */}
        <TaskStats stats={stats} />

        {/* Kanban Board */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <StatusColumn 
            title="To Do" 
            status="TODO" 
            tasks={groupedTasks.TODO} 
            onEditTask={handleOpenDialog}
            onDeleteTask={handleDelete}
            onStatusChange={handleStatusChange}
          />
          <StatusColumn 
            title="In Progress" 
            status="IN_PROGRESS" 
            tasks={groupedTasks.IN_PROGRESS} 
            onEditTask={handleOpenDialog}
            onDeleteTask={handleDelete}
            onStatusChange={handleStatusChange}
          />
          <StatusColumn 
            title="Done" 
            status="DONE" 
            tasks={groupedTasks.DONE} 
            onEditTask={handleOpenDialog}
            onDeleteTask={handleDelete}
            onStatusChange={handleStatusChange}
          />
        </Stack>

        {/* Create/Edit Dialog */}
        <TaskDialog
          open={openDialog}
          editingTask={editingTask}
          onClose={handleCloseDialog}
          onSubmit={handleSubmit}
        />

        {/* Snackbar for notifications */}
        <NotificationSnackbar
          snackbar={snackbar}
          onClose={hideSnackbar}
        />
      </Container>
    </Box>
  )
}

export default App