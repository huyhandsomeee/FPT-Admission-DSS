package com.fpt.admission.service.impl;

import com.fpt.admission.service.FileStorageService;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private final JdbcTemplate jdbcTemplate;

    public FileStorageServiceImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public String storeFile(Long userId, Long docTypeId, MultipartFile file) {
        if (file == null || file.isEmpty()) return null;

        try {
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String fileName = userId + "_" + docTypeId + "_" + System.currentTimeMillis() + extension;
            Path uploadPath = Paths.get("./uploads");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("Lỗi lưu file: " + e.getMessage());
        }
    }

    @Override
    public String getRelativePath(String fileName) {
        return "/api/public/documents/" + fileName;
    }

    public void saveApplicationDoc(Long appId, Long docTypeId, MultipartFile file, Long userId) {
        if (file == null || file.isEmpty()) return;

        String fileName = storeFile(userId, docTypeId, file);
        String relativePath = getRelativePath(fileName);
        String originalFilename = file.getOriginalFilename();

        jdbcTemplate.update(
                "INSERT INTO application_documents (application_id, document_type_id, file_name, file_path, file_size, mime_type, status) " +
                        "VALUES (?, ?, ?, ?, ?, ?, 'PENDING')",
                appId, docTypeId, originalFilename, relativePath, file.getSize(), file.getContentType()
        );
    }
}
