package com.mail.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;

/**
 * Load Templates - Use this class for loading email templates.
 * Email subject and body are loaded from template files in resources/templates/
 */
@Component
@Slf4j
public class LoadTemplates {
    private String emailSubject;
    private String emailBodyTemplate;

    @PostConstruct
    public void loadTemplates() {
        log.info("Starting to load email templates in LoadTemplates component...");
        try {
            // Load subject from template file
            ClassPathResource subjectResource = new ClassPathResource("templates/email-subject.txt");
            emailSubject = new String(subjectResource.getInputStream().readAllBytes(), StandardCharsets.UTF_8).trim();

            // Load body from template file
            ClassPathResource bodyResource = new ClassPathResource("templates/email-body.txt");
            emailBodyTemplate = new String(bodyResource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

            log.info("✅ Email templates loaded successfully in LoadTemplates!");
        } catch (Exception e) {
            log.error("❌ Failed to load email templates in LoadTemplates: {}", e.getMessage());
            // Fallback to default values
            emailSubject = "Job Application";
            emailBodyTemplate = "Please find my resume attached.";
        }
    }

}
