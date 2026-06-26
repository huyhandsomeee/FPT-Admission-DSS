package com.fpt.admission.util;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

public final class FileUploadUtil {
    private FileUploadUtil() {}

    public static String storeFile(Long userId, Long docTypeId, MultipartFile file) {
        if (file == null || file.isEmpty()) return null;

        try {
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String fileName = userId + "_" + docTypeId + "_" + System.currentTimeMillis() + extension;
            Path uploadPath = Paths.get(AppConstants.UPLOAD_DIR);
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

    public static String getRelativePath(String fileName) {
        return "/api/public/documents/" + fileName;
    }

    public static boolean isValidFileSize(MultipartFile file) {
        return file.getSize() <= AppConstants.MAX_FILE_SIZE;
    }

    public static String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) return "";
        return fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
    }

    public static boolean isImageFile(String fileName) {
        String ext = getFileExtension(fileName);
        return ext.matches("\\.(jpg|jpeg|png|gif|webp|bmp)$");
    }

    public static boolean isPdfFile(String fileName) {
        return getFileExtension(fileName).equals(".pdf");
    }
}
