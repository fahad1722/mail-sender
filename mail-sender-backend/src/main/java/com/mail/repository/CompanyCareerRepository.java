package com.mail.repository;

import com.mail.model.CompanyCareer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyCareerRepository extends JpaRepository<CompanyCareer, Long> {
}
