package com.mail.controller;

import com.mail.model.HrContact;
import com.mail.repository.HrContactRepository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@Slf4j
public class HrContactController {

    private final HrContactRepository hrContactRepository;

    public HrContactController(HrContactRepository hrContactRepository) {
        this.hrContactRepository = hrContactRepository;
    }

    @PostMapping("/hrs")
    @CacheEvict(value = "hrs", allEntries = true)
    public ResponseEntity<HrContact> addHrContact(@RequestBody HrContact hrContact) {
        log.info("Adding new HR contact for company: {}", hrContact.getCompanyName());
        return ResponseEntity.ok(hrContactRepository.save(hrContact));
    }

    @GetMapping("/hrs")
    @Cacheable("hrs")
    public ResponseEntity<List<HrContact>> getAllHrContacts() {
        log.info("Fetching all HR contacts from database (cache miss)");
        return ResponseEntity.ok(hrContactRepository.findAll());
    }

    @PutMapping("/hrs/{id}")
    @CacheEvict(value = "hrs", allEntries = true)
    public ResponseEntity<HrContact> updateHrContact(@PathVariable Long id, @RequestBody HrContact hrContactDetails) {
        log.info("Updating HR contact ID: {}", id);
        return hrContactRepository.findById(id)
                .map(hrContact -> {
                    hrContact.setCompanyName(hrContactDetails.getCompanyName());
                    hrContact.setEmailId(hrContactDetails.getEmailId());
                    hrContact.setMobileNumber(hrContactDetails.getMobileNumber());
                    hrContact.setLinkedInUrl(hrContactDetails.getLinkedInUrl());
                    return ResponseEntity.ok(hrContactRepository.save(hrContact));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/hrs/{id}")
    @CacheEvict(value = "hrs", allEntries = true)
    public ResponseEntity<Void> deleteHrContact(@PathVariable Long id) {
        log.info("Deleting HR contact ID: {}", id);
        if (hrContactRepository.existsById(id)) {
            hrContactRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
