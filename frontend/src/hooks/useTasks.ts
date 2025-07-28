import { useState, useEffect, useCallback } from 'react'
import type { Task, CreateTaskRequest, UpdateTaskRequest, UpdateTaskStatusRequest, ApiError } from '../types'
import { TaskApiService } from '../services/taskApi'
import { groupTasksByStatus, calculateTaskStats } from '../utils'
import { ERROR_MESSAGES } from '../constants'

interface UseTasksReturn {
  tasks: Task[]
  groupedTasks: ReturnType<typeof groupTasksByStatus>
  stats: ReturnType<typeof calculateTaskStats>
  loading: boolean
  error: ApiError | null
  fetchTasks: () => Promise<void>
  createTask: (taskData: CreateTaskRequest) => Promise<Task>
  updateTask: (id: string, taskData: UpdateTaskRequest) => Promise<Task>
  deleteTask: (id: string) => Promise<void>
  updateTaskStatus: (id: string, statusData: UpdateTaskStatusRequest) => Promise<Task>
  clearError: () => void
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const fetchedTasks = await TaskApiService.getAllTasks()
      setTasks(fetchedTasks)
    } catch (err) {
      const apiError = err as ApiError
      setError({
        ...apiError,
        message: apiError.message || ERROR_MESSAGES.FETCH_TASKS_FAILED,
      })
    } finally {
      setLoading(false)
    }
  }, [])

  const createTask = useCallback(async (taskData: CreateTaskRequest): Promise<Task> => {
    setError(null)
    try {
      const newTask = await TaskApiService.createTask(taskData)
      setTasks(prevTasks => [...prevTasks, newTask])
      return newTask
    } catch (err) {
      const apiError = err as ApiError
      const error = {
        ...apiError,
        message: apiError.message || ERROR_MESSAGES.CREATE_TASK_FAILED,
      }
      setError(error)
      throw error
    }
  }, [])

  const updateTask = useCallback(async (id: string, taskData: UpdateTaskRequest): Promise<Task> => {
    setError(null)
    try {
      const updatedTask = await TaskApiService.updateTask(id, taskData)
      setTasks(prevTasks => 
        prevTasks.map(task => task.id === id ? updatedTask : task)
      )
      return updatedTask
    } catch (err) {
      const apiError = err as ApiError
      const error = {
        ...apiError,
        message: apiError.message || ERROR_MESSAGES.UPDATE_TASK_FAILED,
      }
      setError(error)
      throw error
    }
  }, [])

  const deleteTask = useCallback(async (id: string): Promise<void> => {
    setError(null)
    try {
      await TaskApiService.deleteTask(id)
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id))
    } catch (err) {
      const apiError = err as ApiError
      const error = {
        ...apiError,
        message: apiError.message || ERROR_MESSAGES.DELETE_TASK_FAILED,
      }
      setError(error)
      throw error
    }
  }, [])

  const updateTaskStatus = useCallback(async (id: string, statusData: UpdateTaskStatusRequest): Promise<Task> => {
    setError(null)
    try {
      const updatedTask = await TaskApiService.updateTaskStatus(id, statusData)
      setTasks(prevTasks => 
        prevTasks.map(task => task.id === id ? updatedTask : task)
      )
      return updatedTask
    } catch (err) {
      const apiError = err as ApiError
      const error = {
        ...apiError,
        message: apiError.message || ERROR_MESSAGES.UPDATE_STATUS_FAILED,
      }
      setError(error)
      throw error
    }
  }, [])

  // Load tasks on mount
  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const groupedTasks = groupTasksByStatus(tasks)
  const stats = calculateTaskStats(tasks)

  return {
    tasks,
    groupedTasks,
    stats,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    clearError,
  }
} 