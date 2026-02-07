package com.mail.controller;

import com.mail.model.CompanyCareer;
import com.mail.repository.CompanyCareerRepository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
public class CareerController {

    private final CompanyCareerRepository companyCareerRepository;

    public CareerController(CompanyCareerRepository companyCareerRepository) {
        this.companyCareerRepository = companyCareerRepository;
    }

    @PostMapping("/careers")
    public ResponseEntity<CompanyCareer> addCareer(@RequestBody CompanyCareer career) {
        log.info("Received request to add career for company: {}", career.getCompanyName());
        CompanyCareer savedCareer = companyCareerRepository.save(career);
        log.info("Successfully saved career with ID: {}", savedCareer.getId());
        return ResponseEntity.ok(savedCareer);
    }

    @GetMapping("/careers")
    public ResponseEntity<List<CompanyCareer>> getAllCareers() {
        log.info("Fetching all careers from database");
        List<CompanyCareer> careers = companyCareerRepository.findAll();
        log.info("Retrieved {} careers", careers.size());
        return ResponseEntity.ok(careers);
    }

    @PutMapping("/careers/{id}")
    public ResponseEntity<CompanyCareer> updateCareer(@PathVariable Long id, @RequestBody CompanyCareer careerDetails) {
        log.info("Received request to update career ID: {}", id);
        return companyCareerRepository.findById(id)
                .map(career -> {
                    career.setCompanyName(careerDetails.getCompanyName());
                    career.setCareerLink(careerDetails.getCareerLink());
                    CompanyCareer updated = companyCareerRepository.save(career);
                    log.info("Successfully updated career ID: {}", id);
                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> {
                    log.error("Career ID: {} not found for update", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @DeleteMapping("/careers/{id}")
    public ResponseEntity<Void> deleteCareer(@PathVariable Long id) {
        log.info("Received request to delete career ID: {}", id);
        if (companyCareerRepository.existsById(id)) {
            companyCareerRepository.deleteById(id);
            log.info("Successfully deleted career ID: {}", id);
            return ResponseEntity.ok().build();
        }
        log.error("Career ID: {} not found for deletion", id);
        return ResponseEntity.notFound().build();
    }
}
