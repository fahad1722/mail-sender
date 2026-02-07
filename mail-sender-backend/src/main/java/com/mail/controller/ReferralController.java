package com.mail.controller;

import com.mail.model.Referral;
import com.mail.repository.ReferralRepository;

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
public class ReferralController {

    private final ReferralRepository referralRepository;

    public ReferralController(ReferralRepository referralRepository) {
        this.referralRepository = referralRepository;
    }

    @PostMapping("/referrals")
    @CacheEvict(value = "referrals", allEntries = true)
    public ResponseEntity<Referral> addReferral(@RequestBody Referral referral) {
        log.info("Adding new referral for company: {}", referral.getCompanyName());
        return ResponseEntity.ok(referralRepository.save(referral));
    }

    @GetMapping("/referrals")
    @Cacheable("referrals")
    public ResponseEntity<List<Referral>> getAllReferrals() {
        log.info("Fetching all referrals from database (cache miss)");
        return ResponseEntity.ok(referralRepository.findAll());
    }

    @PutMapping("/referrals/{id}")
    @CacheEvict(value = "referrals", allEntries = true)
    public ResponseEntity<Referral> updateReferral(@PathVariable Long id, @RequestBody Referral referralDetails) {
        log.info("Updating referral ID: {}", id);
        return referralRepository.findById(id)
                .map(referral -> {
                    referral.setCompanyName(referralDetails.getCompanyName());
                    referral.setLinkedInUrl(referralDetails.getLinkedInUrl());
                    return ResponseEntity.ok(referralRepository.save(referral));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/referrals/{id}")
    @CacheEvict(value = "referrals", allEntries = true)
    public ResponseEntity<Void> deleteReferral(@PathVariable Long id) {
        log.info("Deleting referral ID: {}", id);
        if (referralRepository.existsById(id)) {
            referralRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
