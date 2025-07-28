import type { Task, TaskStats, GroupedTasks, ApiError } from '../types'
import { TASK_STATUS_CONFIG } from '../constants'

export const groupTasksByStatus = (tasks: Task[]): GroupedTasks => {
  return {
    TODO: tasks.filter(task => task.status === 'TODO'),
    IN_PROGRESS: tasks.filter(task => task.status === 'IN_PROGRESS'),
    DONE: tasks.filter(task => task.status === 'DONE'),
  }
}

export const calculateTaskStats = (tasks: Task[]): TaskStats => {
  const grouped = groupTasksByStatus(tasks)
  return {
    todo: grouped.TODO.length,
    inProgress: grouped.IN_PROGRESS.length,
    done: grouped.DONE.length,
    total: tasks.length,
  }
}

export const getTaskStatusConfig = (status: Task['status']) => {
  return TASK_STATUS_CONFIG[status]
}

export const isValidTaskTitle = (title: string): boolean => {
  return title.trim().length > 0
}

export const formatTaskStatusLabel = (status: Task['status']): string => {
  return status.replace('_', ' ')
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof Error) {
    return {
      message: error.message,
    }
  }
  
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const axiosError = error as any
    return {
      message: axiosError.response?.data?.message || axiosError.message || 'An error occurred',
      status: axiosError.response?.status,
      code: axiosError.code,
    }
  }
  
  return {
    message: 'An unexpected error occurred',
  }
}

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: number
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
} 