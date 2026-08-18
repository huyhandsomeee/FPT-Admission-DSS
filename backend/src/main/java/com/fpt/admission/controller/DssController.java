package com.fpt.admission.controller;

import com.fpt.admission.service.DssModelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/manager/dss")
@RequiredArgsConstructor
public class DssController {

    private final DssModelService dssModelService;

    @PostMapping("/simulate")
    public ResponseEntity<?> simulate(@RequestBody Map<String, Object> params) {
        return ResponseEntity.ok(dssModelService.simulate(params));
    }

    @PostMapping("/optimize-quota")
    public ResponseEntity<?> optimizeQuota(@RequestBody Map<String, Object> params) {
        return ResponseEntity.ok(dssModelService.optimizeQuota(params));
    }

    @GetMapping("/dw-metrics")
    public ResponseEntity<?> getDwMetrics() {
        return ResponseEntity.ok(dssModelService.getLiveDwMetrics());
    }

    @PostMapping("/run-quality-check")
    public ResponseEntity<?> runQualityCheck() {
        return ResponseEntity.ok(dssModelService.runLiveQualityCheck());
    }

    @PostMapping("/apply-scenario")
    public ResponseEntity<?> applyScenario(@RequestBody Map<String, Object> params) {
        return ResponseEntity.ok(dssModelService.applySimulationScenario(params));
    }
}
