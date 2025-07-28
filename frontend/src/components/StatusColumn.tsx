import React, { memo } from 'react'
import {
  Box,
  Typography,
  Chip,
  alpha,
  useTheme,
} from '@mui/material'
import {
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material'
import type { Task, TaskStatus } from '../types'
import TaskCard from './TaskCard'
import { TASK_STATUS_CONFIG } from '../constants'

interface StatusColumnProps {
  title: string
  status: TaskStatus
  tasks: Task[]
  onEditTask: (task: Task) => void
  onDeleteTask: (id: string) => void
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

const StatusColumn: React.FC<StatusColumnProps> = memo(({
  title,
  status,
  tasks,
  onEditTask,
  onDeleteTask,
  onStatusChange,
}) => {
  const theme = useTheme()
  const statusConfig = TASK_STATUS_CONFIG[status]
  const paletteColor = theme.palette[statusConfig.color]
  const mainColor = typeof paletteColor === 'object' && 'main' in paletteColor 
    ? paletteColor.main 
    : theme.palette.primary.main

  return (
    <Box sx={{ flex: 1 }} role="region" aria-label={`${title} tasks`}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2,
          p: 2,
          backgroundColor: alpha(mainColor, 0.1),
          borderRadius: 2,
          border: `1px solid ${alpha(mainColor, 0.2)}`,
        }}
        role="banner"
      >
        {getStatusIcon(status)}
        <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }} id={`column-title-${status}`}>
          {title}
        </Typography>
        <Chip
          label={tasks.length}
          size="small"
          color={statusConfig.color}
          sx={{ ml: 'auto' }}
          aria-label={`${tasks.length} tasks in ${title}`}
        />
      </Box>
      <Box 
        sx={{ minHeight: 400 }}
        role="list"
        aria-labelledby={`column-title-${status}`}
        aria-describedby={`column-description-${status}`}
      >
        <div id={`column-description-${status}`} style={{ display: 'none' }}>
          Column containing {tasks.length} {title.toLowerCase()} tasks
        </div>
        {tasks.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 4,
              border: `2px dashed ${alpha(theme.palette.grey[400], 0.5)}`,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.grey[50], 0.5),
            }}
            role="status"
            aria-label={`No ${title.toLowerCase()} tasks`}
          >
            <Typography variant="body2" color="text.secondary">
              No {title.toLowerCase()} tasks
            </Typography>
          </Box>
        ) : (
          tasks.map((task) => (
            <div key={task.id} role="listitem">
              <TaskCard
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onStatusChange={onStatusChange}
              />
            </div>
          ))
        )}
      </Box>
    </Box>
  )
})

StatusColumn.displayName = 'StatusColumn'

export default StatusColumn 