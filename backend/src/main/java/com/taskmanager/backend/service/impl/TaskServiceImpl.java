package com.taskmanager.backend.service.impl;

import com.taskmanager.backend.dto.CreateTaskRequest;
import com.taskmanager.backend.dto.UpdateTaskRequest;
import com.taskmanager.backend.dto.UpdateTaskStatusRequest;
import com.taskmanager.backend.exception.TaskNotFoundException;
import com.taskmanager.backend.model.Task;
import com.taskmanager.backend.model.TaskStatus;
import com.taskmanager.backend.repository.TaskRepository;
import com.taskmanager.backend.service.TaskService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    public TaskServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public Task createTask(CreateTaskRequest request) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(TaskStatus.TODO);
        return taskRepository.save(task);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException("Task not found with id: " + id));
    }

    @Override
    public Task updateTask(Long id, UpdateTaskRequest request) {
        Task task = getTaskById(id);
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        return taskRepository.save(task);
    }

    @Override
    public Task updateTaskStatus(Long id, UpdateTaskStatusRequest request) {
        Task task = getTaskById(id);
        task.setStatus(request.getStatus());
        return taskRepository.save(task);
    }

    @Override
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new TaskNotFoundException("Task not found with id: " + id);
        }
        taskRepository.deleteById(id);
    }
} 