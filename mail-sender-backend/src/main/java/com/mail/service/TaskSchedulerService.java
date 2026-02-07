package com.mail.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class TaskSchedulerService {

    private static final Logger logger = LoggerFactory.getLogger(TaskSchedulerService.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private final RestTemplate restTemplate = new RestTemplate();

    @Scheduled(cron = "${app.scheduling.cron}")
    public void runScheduledTask() {
        String currentTime = LocalDateTime.now().format(formatter);
        try {
            // Self-ping to keep the app alive and verify health
            String response = restTemplate.getForObject("http://localhost:8080/ping", String.class);
            logger.info("Self-ping successful at {}: response={}", currentTime, response);
        } catch (Exception e) {
            logger.error("Self-ping failed at {}: {}", currentTime, e.getMessage());
        }
    }
}
