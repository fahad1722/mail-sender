package com.mail.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "company_careers")
@Data
@NoArgsConstructor
public class CompanyCareer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String companyName;

    @Column(nullable = false)
    private String careerLink;

    public CompanyCareer(String companyName, String careerLink) {
        this.companyName = companyName;
        this.careerLink = careerLink;
    }
}
