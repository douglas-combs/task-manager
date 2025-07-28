package com.taskmanager.backend.service;

import com.taskmanager.backend.dto.CreateTaskRequest;
import com.taskmanager.backend.dto.UpdateTaskRequest;
import com.taskmanager.backend.dto.UpdateTaskStatusRequest;
import com.taskmanager.backend.exception.TaskNotFoundException;
import com.taskmanager.backend.model.Task;
import com.taskmanager.backend.model.TaskStatus;
import com.taskmanager.backend.repository.TaskRepository;
import com.taskmanager.backend.service.impl.TaskServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskServiceImpl taskService;

    private Task testTask;
    private Long testId;

    @BeforeEach
    void setUp() {
        testId = 1L;
        testTask = new Task();
        testTask.setId(testId);
        testTask.setTitle("Test Task");
        testTask.setDescription("Test Description");
        testTask.setStatus(TaskStatus.TODO);
    }

    @Test
    void createTask_ShouldCreateNewTask() {
        // Given
        CreateTaskRequest request = new CreateTaskRequest();
        request.setTitle("New Task");
        request.setDescription("New Description");

        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        // When
        Task result = taskService.createTask(request);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo(testTask.getTitle());
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void getAllTasks_ShouldReturnAllTasks() {
        // Given
        List<Task> tasks = Arrays.asList(testTask, new Task());
        when(taskRepository.findAll()).thenReturn(tasks);

        // When
        List<Task> result = taskService.getAllTasks();

        // Then
        assertThat(result).hasSize(2);
        verify(taskRepository, times(1)).findAll();
    }

    @Test
    void getTaskById_WhenTaskExists_ShouldReturnTask() {
        // Given
        when(taskRepository.findById(testId)).thenReturn(Optional.of(testTask));

        // When
        Task result = taskService.getTaskById(testId);

        // Then
        assertThat(result).isEqualTo(testTask);
        verify(taskRepository, times(1)).findById(testId);
    }

    @Test
    void getTaskById_WhenTaskNotExists_ShouldThrowException() {
        // Given
        when(taskRepository.findById(testId)).thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> taskService.getTaskById(testId))
                .isInstanceOf(TaskNotFoundException.class)
                .hasMessageContaining("Task not found with id: " + testId);
    }

    @Test
    void updateTask_ShouldUpdateExistingTask() {
        // Given
        UpdateTaskRequest request = new UpdateTaskRequest();
        request.setTitle("Updated Title");
        request.setDescription("Updated Description");
        request.setStatus(TaskStatus.IN_PROGRESS);

        when(taskRepository.findById(testId)).thenReturn(Optional.of(testTask));
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        // When
        Task result = taskService.updateTask(testId, request);

        // Then
        assertThat(result).isNotNull();
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void updateTaskStatus_ShouldUpdateStatus() {
        // Given
        UpdateTaskStatusRequest request = new UpdateTaskStatusRequest();
        request.setStatus(TaskStatus.DONE);

        when(taskRepository.findById(testId)).thenReturn(Optional.of(testTask));
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        // When
        Task result = taskService.updateTaskStatus(testId, request);

        // Then
        assertThat(result).isNotNull();
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void deleteTask_WhenTaskExists_ShouldDeleteTask() {
        // Given
        when(taskRepository.existsById(testId)).thenReturn(true);

        // When
        taskService.deleteTask(testId);

        // Then
        verify(taskRepository, times(1)).deleteById(testId);
    }

    @Test
    void deleteTask_WhenTaskNotExists_ShouldThrowException() {
        // Given
        when(taskRepository.existsById(testId)).thenReturn(false);

        // When/Then
        assertThatThrownBy(() -> taskService.deleteTask(testId))
                .isInstanceOf(TaskNotFoundException.class)
                .hasMessageContaining("Task not found with id: " + testId);
    }
} 