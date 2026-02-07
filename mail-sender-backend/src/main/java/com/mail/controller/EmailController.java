package com.mail.controller;

import com.mail.model.EmailLog;
import com.mail.model.EmailRequest;
import com.mail.repository.EmailLogRepository;

import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.PostConstruct;
import jakarta.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
public class EmailController {

    private final JavaMailSender mailSender;
    private final EmailLogRepository emailLogRepository;

    @Value("${app.sender.email}")
    private String senderEmail;

    private String emailSubject;
    private String emailBodyTemplate;

    public EmailController(JavaMailSender mailSender, EmailLogRepository emailLogRepository) {
        this.mailSender = mailSender;
        this.emailLogRepository = emailLogRepository;
    }

    @PostConstruct
    public void loadTemplates() {
        log.info("Loading email templates...");
        try {
            // Load subject from template file
            ClassPathResource subjectResource = new ClassPathResource("templates/email-subject.txt");
            emailSubject = new String(subjectResource.getInputStream().readAllBytes(), StandardCharsets.UTF_8).trim();

            // Load body from template file
            ClassPathResource bodyResource = new ClassPathResource("templates/email-body.txt");
            emailBodyTemplate = new String(bodyResource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

            log.info("✅ Email templates loaded successfully!");
        } catch (Exception e) {
            log.error("❌ Failed to load email templates: {}", e.getMessage());
            emailSubject = "Job Application";
            emailBodyTemplate = "Please find my resume attached.";
        }
    }

    @PostMapping("/send-email")
    public ResponseEntity<Map<String, String>> sendEmail(@RequestBody EmailRequest request) {
        log.info("Attempting to send email to: {}", request.getEmail());
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(senderEmail);
            helper.setTo(request.getEmail());
            helper.setSubject(emailSubject);

            // Replace placeholders in body template
            String body = emailBodyTemplate.replace("{{SENDER_EMAIL}}", senderEmail);
            helper.setText(body);

            // Attach resume
            FileSystemResource file = new FileSystemResource("src/main/resources/Fahad_Resume.pdf");
            helper.addAttachment("Fahad_Resume.pdf", file);

            mailSender.send(message);
            log.info("✅ Successfully sent email to: {}", request.getEmail());

            // Save email log to database
            EmailLog emailLog = new EmailLog(request.getEmail(), LocalDateTime.now(), "SUCCESS");
            emailLogRepository.save(emailLog);
            log.info("Saved success log for representative: {}", request.getEmail());

            return ResponseEntity.ok(Map.of("status", "success", "message", "Email sent to " + request.getEmail()));

        } catch (Exception e) {
            log.error("❌ Failed to send email to: {}. Error: {}", request.getEmail(), e.getMessage());

            // Save failed email log to database
            EmailLog emailLog = new EmailLog(request.getEmail(), LocalDateTime.now(), "FAILED");
            emailLogRepository.save(emailLog);
            log.info("Saved failure log for representative: {}", request.getEmail());

            return ResponseEntity.internalServerError().body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    @GetMapping("/emails")
    public ResponseEntity<List<EmailLog>> getAllEmails() {
        log.info("Fetching all email logs from database");
        List<EmailLog> emails = emailLogRepository.findAllByOrderBySentAtDesc();
        log.info("Retrieved {} email logs", emails.size());
        return ResponseEntity.ok(emails);
    }

    @GetMapping("/templates")
    public ResponseEntity<Map<String, String>> getTemplates() {
        return ResponseEntity.ok(Map.of(
                "subject", emailSubject,
                "body", emailBodyTemplate.replace("{{SENDER_EMAIL}}", senderEmail)));
    }
}
