package com.mail.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "hr_contacts")
@Data
@NoArgsConstructor
public class HrContact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String companyName;

    @Column(nullable = false)
    private String emailId;

    @Column(nullable = false)
    private String mobileNumber;

    @Column(nullable = false)
    private String linkedInUrl;

    public HrContact(String companyName, String emailId, String mobileNumber, String linkedInUrl) {
        this.companyName = companyName;
        this.emailId = emailId;
        this.mobileNumber = mobileNumber;
        this.linkedInUrl = linkedInUrl;
    }
}
