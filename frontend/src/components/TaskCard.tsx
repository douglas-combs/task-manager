import React, { memo, useCallback } from 'react'
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
  Chip,
  Select,
  MenuItem,
  FormControl,
  alpha,
  useTheme,
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material'
import type { Task, TaskStatus } from '../types'
import { getTaskStatusConfig, formatTaskStatusLabel } from '../utils'
import { TASK_STATUS_CONFIG, DIALOG_SETTINGS } from '../constants'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onStatusChange: (task: Task, newStatus: TaskStatus) => void
}

const getStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case 'TODO':
      return <AssignmentIcon />
    case 'IN_PROGRESS':
      return <PlayArrowIcon />
    case 'DONE':
      return <CheckCircleIcon />
    default:
      return <AssignmentIcon />
  }
}

const TaskCard: React.FC<TaskCardProps> = memo(({ task, onEdit, onDelete, onStatusChange }) => {
  const theme = useTheme()
  const statusConfig = getTaskStatusConfig(task.status)

  const handleEdit = useCallback(() => {
    onEdit(task)
  }, [onEdit, task])

  const handleDelete = useCallback(() => {
    onDelete(task.id)
  }, [onDelete, task.id])

  const handleStatusChange = useCallback((event: { target: { value: string } }) => {
    onStatusChange(task, event.target.value as TaskStatus)
  }, [onStatusChange, task])

  const getStatusBackgroundColor = (status: TaskStatus) => {
    const config = TASK_STATUS_CONFIG[status]
    const paletteColor = theme.palette[config.color]
    const mainColor = typeof paletteColor === 'object' && 'main' in paletteColor 
      ? paletteColor.main 
      : theme.palette.primary.main
    return alpha(mainColor, 0.1)
  }

  const getBorderColor = (status: TaskStatus) => {
    const config = TASK_STATUS_CONFIG[status]
    const paletteColor = theme.palette[config.color]
    const mainColor = typeof paletteColor === 'object' && 'main' in paletteColor 
      ? paletteColor.main 
      : theme.palette.primary.main
    return alpha(mainColor, 0.2)
  }

  return (
    <Card
      sx={{
        mb: 2,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[DIALOG_SETTINGS.HOVER_ELEVATION],
        },
        backgroundColor: getStatusBackgroundColor(task.status),
        border: `1px solid ${getBorderColor(task.status)}`,
      }}
      role="article"
      aria-label={`Task: ${task.title}`}
    >
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography 
            variant="h6" 
            component="h3" 
            sx={{ fontWeight: 600, flex: 1 }}
            id={`task-title-${task.id}`}
          >
            {task.title}
          </Typography>
          <Chip
            icon={getStatusIcon(task.status)}
            label={formatTaskStatusLabel(task.status)}
            color={statusConfig.color}
            size="small"
            sx={{ ml: 1, fontWeight: 500 }}
            aria-label={`Status: ${formatTaskStatusLabel(task.status)}`}
          />
        </Box>
        {task.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 1,
              lineHeight: 1.5,
            }}
            id={`task-description-${task.id}`}
          >
            {task.description}
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{ pt: 0, justifyContent: 'space-between', alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={task.status}
            onChange={handleStatusChange}
            displayEmpty
            sx={{
              fontSize: '0.875rem',
              '& .MuiSelect-select': {
                py: 1,
              }
            }}
            aria-label="Change task status"
            aria-describedby={`task-title-${task.id}`}
          >
            <MenuItem value="TODO" aria-label="Set status to To Do">
              {TASK_STATUS_CONFIG.TODO.icon} {TASK_STATUS_CONFIG.TODO.label}
            </MenuItem>
            <MenuItem value="IN_PROGRESS" aria-label="Set status to In Progress">
              {TASK_STATUS_CONFIG.IN_PROGRESS.icon} {TASK_STATUS_CONFIG.IN_PROGRESS.label}
            </MenuItem>
            <MenuItem value="DONE" aria-label="Set status to Done">
              {TASK_STATUS_CONFIG.DONE.icon} {TASK_STATUS_CONFIG.DONE.label}
            </MenuItem>
          </Select>
        </FormControl>
        <Box>
          <IconButton
            size="small"
            onClick={handleEdit}
            sx={{
              color: theme.palette.primary.main,
              '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) }
            }}
            aria-label={`Edit task: ${task.title}`}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleDelete}
            sx={{
              color: theme.palette.error.main,
              '&:hover': { backgroundColor: alpha(theme.palette.error.main, 0.1) }
            }}
            aria-label={`Delete task: ${task.title}`}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  )
})

TaskCard.displayName = 'TaskCard'

export default TaskCard 