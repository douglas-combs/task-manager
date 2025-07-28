package com.taskmanager.backend.service;

import com.taskmanager.backend.dto.CreateTaskRequest;
import com.taskmanager.backend.dto.UpdateTaskRequest;
import com.taskmanager.backend.dto.UpdateTaskStatusRequest;
import com.taskmanager.backend.model.Task;

import java.util.List;

public interface TaskService {
    
    Task createTask(CreateTaskRequest request);
    
    List<Task> getAllTasks();
    
    Task getTaskById(Long id);
    
    Task updateTask(Long id, UpdateTaskRequest request);
    
    Task updateTaskStatus(Long id, UpdateTaskStatusRequest request);
    
    void deleteTask(Long id);
} 