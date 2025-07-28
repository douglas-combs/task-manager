import axios, { AxiosError } from 'axios'
import type { Task, CreateTaskRequest, UpdateTaskRequest, UpdateTaskStatusRequest, ApiError } from '../types'
import { API_BASE_URL } from '../constants'
import { handleApiError } from '../utils'

// Configure axios defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging and auth
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error: AxiosError) => {
    console.error(`API Error: ${error.response?.status} ${error.config?.url}`, error)
    return Promise.reject(error)
  }
)

export class TaskApiService {
  static async getAllTasks(): Promise<Task[]> {
    try {
      const response = await apiClient.get<Task[]>('/tasks')
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      throw apiError
    }
  }

  static async createTask(taskData: CreateTaskRequest): Promise<Task> {
    try {
      const response = await apiClient.post<Task>('/tasks', taskData)
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      throw apiError
    }
  }

  static async updateTask(id: string, taskData: UpdateTaskRequest): Promise<Task> {
    try {
      const response = await apiClient.put<Task>(`/tasks/${id}`, taskData)
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      throw apiError
    }
  }

  static async deleteTask(id: string): Promise<void> {
    try {
      await apiClient.delete(`/tasks/${id}`)
    } catch (error) {
      const apiError = handleApiError(error)
      throw apiError
    }
  }

  static async updateTaskStatus(id: string, statusData: UpdateTaskStatusRequest): Promise<Task> {
    try {
      const response = await apiClient.patch<Task>(`/tasks/${id}/status`, statusData)
      return response.data
    } catch (error) {
      const apiError = handleApiError(error)
      throw apiError
    }
  }
}

export default TaskApiService 