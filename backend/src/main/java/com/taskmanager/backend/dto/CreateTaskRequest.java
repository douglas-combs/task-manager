package com.taskmanager.backend.dto;

import javax.validation.constraints.NotBlank;

public class CreateTaskRequest {
    
    @NotBlank(message = "Title must not be blank")
    private String title;
    
    private String description;

    public CreateTaskRequest() {}

    public CreateTaskRequest(String title, String description) {
        this.title = title;
        this.description = description;
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
} 