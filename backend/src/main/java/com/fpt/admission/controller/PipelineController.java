package com.fpt.admission.controller;

import com.fpt.admission.dto.response.ApiResponse;
import com.fpt.admission.service.PipelineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/officer/pipeline")
@RequiredArgsConstructor
public class PipelineController {

    private final PipelineService pipelineService;

    @GetMapping
    public ResponseEntity<?> getQueue() {
        try {
            return ResponseEntity.ok(ApiResponse.success("Tải danh sách hàng chờ thành công", pipelineService.getSmartReviewQueue()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Lỗi khi tải hàng chờ xét tuyển: " + e.getMessage()));
        }
    }

    @PostMapping("/recalculate/{id}")
    public ResponseEntity<?> recalculate(@PathVariable Long id) {
        try {
            pipelineService.processPipeline(id);
            return ResponseEntity.ok(ApiResponse.success("Tính toán lại thành công", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Lỗi tính toán lại: " + e.getMessage()));
        }
    }

    @PostMapping("/approve/{id}")
    public ResponseEntity<?> approve(@PathVariable Long id, Authentication authentication) {
        try {
            String officerEmail = authentication.getName();
            pipelineService.approveApplication(id, officerEmail);
            return ResponseEntity.ok(ApiResponse.success("Phê duyệt hồ sơ thành công", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Lỗi phê duyệt hồ sơ: " + e.getMessage()));
        }
    }

    @PostMapping("/approve-batch")
    public ResponseEntity<?> approveBatch(@RequestBody java.util.List<Long> ids, Authentication authentication) {
        try {
            String officerEmail = authentication.getName();
            if (ids == null || ids.isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Danh sách ID không được trống"));
            }
            pipelineService.approveApplicationsBatch(ids, officerEmail);
            return ResponseEntity.ok(ApiResponse.success("Phê duyệt hàng loạt thành công", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Lỗi phê duyệt hàng loạt: " + e.getMessage()));
        }
    }

    @PostMapping("/reject/{id}")
    public ResponseEntity<?> reject(@PathVariable Long id, @RequestBody Map<String, String> body, Authentication authentication) {
        try {
            String officerEmail = authentication.getName();
            String reason = body.get("reason");
            if (reason == null || reason.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Lý do từ chối không được để trống"));
            }
            pipelineService.rejectApplication(id, reason, officerEmail);
            return ResponseEntity.ok(ApiResponse.success("Từ chối hồ sơ thành công", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Lỗi từ chối hồ sơ: " + e.getMessage()));
        }
    }

    @PostMapping("/request-docs/{id}")
    public ResponseEntity<?> requestDocs(@PathVariable Long id, @RequestBody Map<String, String> body, Authentication authentication) {
        try {
            String officerEmail = authentication.getName();
            String notes = body.get("notes");
            if (notes == null || notes.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Chi tiết yêu cầu bổ sung không được để trống"));
            }
            pipelineService.requestMoreDocuments(id, notes, officerEmail);
            return ResponseEntity.ok(ApiResponse.success("Yêu cầu bổ sung tài liệu thành công", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Lỗi yêu cầu bổ sung tài liệu: " + e.getMessage()));
        }
    }
}
