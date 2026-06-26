package com.fpt.admission.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String storeFile(Long userId, Long docTypeId, MultipartFile file);
    String getRelativePath(String fileName);
}
