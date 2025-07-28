import type { TaskStatus } from '../types'

export const API_BASE_URL = '/api'

export const TASK_STATUS_CONFIG = {
  TODO: {
    label: 'To Do',
    icon: '📋',
    color: 'warning' as const,
  },
  IN_PROGRESS: {
    label: 'In Progress',
    icon: '⚡',
    color: 'info' as const,
  },
  DONE: {
    label: 'Done',
    icon: '✅',
    color: 'success' as const,
  },
} as const

export const TASK_STATUS_ORDER: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE']

export const ERROR_MESSAGES = {
  FETCH_TASKS_FAILED: 'Failed to fetch tasks',
  CREATE_TASK_FAILED: 'Failed to create task',
  UPDATE_TASK_FAILED: 'Failed to update task',
  DELETE_TASK_FAILED: 'Failed to delete task',
  UPDATE_STATUS_FAILED: 'Failed to update task status',
  NETWORK_ERROR: 'Network error occurred',
  UNKNOWN_ERROR: 'An unexpected error occurred',
} as const

export const SUCCESS_MESSAGES = {
  TASK_CREATED: 'Task created successfully',
  TASK_UPDATED: 'Task updated successfully',
  TASK_DELETED: 'Task deleted successfully',
  STATUS_UPDATED: 'Status updated successfully',
} as const

export const DIALOG_SETTINGS = {
  SNACKBAR_AUTO_HIDE_DURATION: 4000,
  HOVER_ELEVATION: 4,
  DIALOG_ELEVATION: 8,
} as const 