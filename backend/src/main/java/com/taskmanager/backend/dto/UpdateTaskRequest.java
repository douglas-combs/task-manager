package com.taskmanager.backend.dto;

import com.taskmanager.backend.model.TaskStatus;
import javax.validation.constraints.NotBlank;

public class UpdateTaskRequest {
    
    @NotBlank(message = "Title must not be blank")
    private String title;
    
    private String description;
    
    private TaskStatus status;

    public UpdateTaskRequest() {}

    public UpdateTaskRequest(String title, String description, TaskStatus status) {
        this.title = title;
        this.description = description;
        this.status = status;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }
} 