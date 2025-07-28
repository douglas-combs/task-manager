package com.taskmanager.backend.dto;

import com.taskmanager.backend.model.TaskStatus;
import javax.validation.constraints.NotNull;

public class UpdateTaskStatusRequest {
    
    @NotNull(message = "Status must not be null")
    private TaskStatus status;

    public UpdateTaskStatusRequest() {}

    public UpdateTaskStatusRequest(TaskStatus status) {
        this.status = status;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }
} 