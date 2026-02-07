package com.mail.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "email_logs")
@Data
@NoArgsConstructor
public class EmailLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private LocalDateTime sentAt;

    @Column
    private String status;

    public EmailLog(String email, LocalDateTime sentAt, String status) {
        this.email = email;
        this.sentAt = sentAt;
        this.status = status;
    }
}
