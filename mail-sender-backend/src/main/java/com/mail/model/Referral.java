package com.mail.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "referrals")
@Data
@NoArgsConstructor
public class Referral {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String companyName;

    @Column(nullable = false)
    private String linkedInUrl;

    public Referral(String companyName, String linkedInUrl) {
        this.companyName = companyName;
        this.linkedInUrl = linkedInUrl;
    }
}
