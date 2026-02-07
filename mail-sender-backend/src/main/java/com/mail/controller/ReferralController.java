package com.mail.controller;

import com.mail.model.Referral;
import com.mail.repository.ReferralRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ReferralController {

    private final ReferralRepository referralRepository;

    public ReferralController(ReferralRepository referralRepository) {
        this.referralRepository = referralRepository;
    }

    @PostMapping("/referrals")
    public ResponseEntity<Referral> addReferral(@RequestBody Referral referral) {
        return ResponseEntity.ok(referralRepository.save(referral));
    }

    @GetMapping("/referrals")
    public ResponseEntity<List<Referral>> getAllReferrals() {
        return ResponseEntity.ok(referralRepository.findAll());
    }

    @PutMapping("/referrals/{id}")
    public ResponseEntity<Referral> updateReferral(@PathVariable Long id, @RequestBody Referral referralDetails) {
        return referralRepository.findById(id)
                .map(referral -> {
                    referral.setCompanyName(referralDetails.getCompanyName());
                    referral.setLinkedInUrl(referralDetails.getLinkedInUrl());
                    return ResponseEntity.ok(referralRepository.save(referral));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/referrals/{id}")
    public ResponseEntity<Void> deleteReferral(@PathVariable Long id) {
        if (referralRepository.existsById(id)) {
            referralRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
