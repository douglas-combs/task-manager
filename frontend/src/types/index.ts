export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  createdAt?: string
  updatedAt?: string
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export interface CreateTaskRequest {
  title: string
  description?: string
}

export interface UpdateTaskRequest {
  title: string
  description?: string
  status: TaskStatus
}

export interface UpdateTaskStatusRequest {
  status: TaskStatus
}

export interface TaskFormData {
  title: string
  description: string
}

export interface ApiError {
  message: string
  status?: number
  code?: string
}

export interface SnackbarState {
  open: boolean
  message: string
  severity: 'success' | 'error' | 'warning' | 'info'
}

export interface TaskStats {
  todo: number
  inProgress: number
  done: number
  total: number
}

export interface GroupedTasks {
  TODO: Task[]
  IN_PROGRESS: Task[]
  DONE: Task[]
} 