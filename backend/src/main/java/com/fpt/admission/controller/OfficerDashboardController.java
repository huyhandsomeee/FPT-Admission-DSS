package com.fpt.admission.controller;

import com.fpt.admission.service.OfficerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/officer/dashboard")
@RequiredArgsConstructor
public class OfficerDashboardController {

    private final OfficerService officerService;

    @GetMapping({"", "/stats"})
    public ResponseEntity<?> getDashboardStats() {
        return ResponseEntity.ok(officerService.getDashboardStats());
    }

    @GetMapping("/by-major")
    public ResponseEntity<?> getStatsByMajor() {
        return ResponseEntity.ok(officerService.getStatsByMajor());
    }

    @GetMapping("/by-status")
    public ResponseEntity<?> getStatsByStatus() {
        return ResponseEntity.ok(officerService.getStatsByStatus());
    }

    @GetMapping("/by-method")
    public ResponseEntity<?> getStatsByMethod() {
        return ResponseEntity.ok(officerService.getStatsByMethod());
    }

    @GetMapping("/by-campus")
    public ResponseEntity<?> getStatsByCampus() {
        return ResponseEntity.ok(officerService.getStatsByCampus());
    }
}
