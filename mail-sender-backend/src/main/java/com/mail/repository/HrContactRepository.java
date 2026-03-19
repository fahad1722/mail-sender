package com.mail.repository;

import com.mail.model.HrContact;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HrContactRepository extends JpaRepository<HrContact, Long> {
}
