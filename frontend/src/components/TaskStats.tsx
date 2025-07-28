import React, { memo } from 'react'
import {
  Grid,
  Card,
  Typography,
  alpha,
  useTheme,
} from '@mui/material'
import type { TaskStats as TaskStatsType } from '../types'

interface TaskStatsProps {
  stats: TaskStatsType
}

interface StatCardProps {
  title: string
  value: number
  color: 'warning' | 'info' | 'success'
}

const StatCard: React.FC<StatCardProps> = memo(({ title, value, color }) => {
  const theme = useTheme()
  const paletteColor = theme.palette[color]
  const mainColor = typeof paletteColor === 'object' && 'main' in paletteColor 
    ? paletteColor.main 
    : theme.palette.primary.main

  return (
    <Card 
      sx={{ 
        textAlign: 'center', 
        p: 2, 
        backgroundColor: alpha(mainColor, 0.1),
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
        }
      }}
      role="region"
      aria-label={`${title}: ${value} tasks`}
    >
      <Typography 
        variant="h4" 
        color={`${color}.main`} 
        sx={{ fontWeight: 700 }}
        aria-label={`${value} tasks`}
      >
        {value}
      </Typography>
      <Typography 
        variant="body1" 
        color="text.secondary"
        sx={{ fontWeight: 500 }}
      >
        {title}
      </Typography>
    </Card>
  )
})

StatCard.displayName = 'StatCard'

const TaskStats: React.FC<TaskStatsProps> = memo(({ stats }) => {
  return (
    <Grid 
      container 
      spacing={3} 
      sx={{ mb: 4 }}
      role="region"
      aria-label="Task statistics"
    >
      <Grid item xs={12} sm={4}>
        <StatCard 
          title="To Do" 
          value={stats.todo} 
          color="warning" 
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <StatCard 
          title="In Progress" 
          value={stats.inProgress} 
          color="info" 
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <StatCard 
          title="Completed" 
          value={stats.done} 
          color="success" 
        />
      </Grid>
    </Grid>
  )
})

TaskStats.displayName = 'TaskStats'

export default TaskStats