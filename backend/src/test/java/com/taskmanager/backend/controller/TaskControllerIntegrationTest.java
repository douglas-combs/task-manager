package com.taskmanager.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskmanager.backend.dto.CreateTaskRequest;
import com.taskmanager.backend.dto.UpdateTaskRequest;
import com.taskmanager.backend.dto.UpdateTaskStatusRequest;
import com.taskmanager.backend.model.Task;
import com.taskmanager.backend.model.TaskStatus;
import com.taskmanager.backend.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class TaskControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TaskRepository taskRepository;

    private Task savedTask;

    @BeforeEach
    void setUp() {
        taskRepository.deleteAll();
        
        Task task = new Task();
        task.setTitle("Test Task");
        task.setDescription("Test Description");
        task.setStatus(TaskStatus.TODO);
        savedTask = taskRepository.save(task);
    }

    @Test
    void createTask_ShouldReturn201() throws Exception {
        CreateTaskRequest request = new CreateTaskRequest();
        request.setTitle("New Task");
        request.setDescription("New Description");

        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title", is("New Task")))
                .andExpect(jsonPath("$.description", is("New Description")))
                .andExpect(jsonPath("$.status", is("TODO")));
    }

    @Test
    void createTask_WithInvalidData_ShouldReturn400() throws Exception {
        CreateTaskRequest request = new CreateTaskRequest();
        request.setTitle("");  // Invalid: blank title

        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getAllTasks_ShouldReturnListOfTasks() throws Exception {
        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", is("Test Task")));
    }

    @Test
    void getTaskById_WhenExists_ShouldReturn200() throws Exception {
        mockMvc.perform(get("/api/tasks/{id}", savedTask.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Test Task")))
                .andExpect(jsonPath("$.description", is("Test Description")));
    }

    @Test
    void getTaskById_WhenNotExists_ShouldReturn404() throws Exception {
        mockMvc.perform(get("/api/tasks/{id}", 999L))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateTask_ShouldReturn200() throws Exception {
        UpdateTaskRequest request = new UpdateTaskRequest();
        request.setTitle("Updated Task");
        request.setDescription("Updated Description");
        request.setStatus(TaskStatus.IN_PROGRESS);

        mockMvc.perform(put("/api/tasks/{id}", savedTask.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Updated Task")))
                .andExpect(jsonPath("$.status", is("IN_PROGRESS")));
    }

    @Test
    void updateTaskStatus_ShouldReturn200() throws Exception {
        UpdateTaskStatusRequest request = new UpdateTaskStatusRequest();
        request.setStatus(TaskStatus.DONE);

        mockMvc.perform(patch("/api/tasks/{id}/status", savedTask.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("DONE")));
    }

    @Test
    void deleteTask_WhenExists_ShouldReturn204() throws Exception {
        mockMvc.perform(delete("/api/tasks/{id}", savedTask.getId()))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteTask_WhenNotExists_ShouldReturn404() throws Exception {
        mockMvc.perform(delete("/api/tasks/{id}", 999L))
                .andExpect(status().isNotFound());
    }
}