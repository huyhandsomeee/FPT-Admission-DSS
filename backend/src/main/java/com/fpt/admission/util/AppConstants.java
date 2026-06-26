package com.fpt.admission.util;

public final class AppConstants {
    private AppConstants() {}

    // Roles
    public static final String ROLE_STUDENT = "STUDENT";
    public static final String ROLE_OFFICER = "ADMISSION_OFFICER";
    public static final String ROLE_MANAGER = "ADMISSION_MANAGER";
    public static final String ROLE_BOD = "BOD";
    public static final String ROLE_ADMIN = "ADMIN";

    // Application Statuses
    public static final String STATUS_DRAFT = "DRAFT";
    public static final String STATUS_SUBMITTED = "SUBMITTED";
    public static final String STATUS_UNDER_REVIEW = "UNDER_REVIEW";
    public static final String STATUS_APPROVED = "APPROVED";
    public static final String STATUS_REJECTED = "REJECTED";
    public static final String STATUS_ENROLLED = "ENROLLED";

    // New Application Request Statuses
    public static final String REQ_NONE = "NONE";
    public static final String REQ_PENDING = "PENDING";
    public static final String REQ_APPROVED = "APPROVED";
    public static final String REQ_REJECTED = "REJECTED";

    // Pagination
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MAX_PAGE_SIZE = 100;

    // File upload
    public static final String UPLOAD_DIR = "./uploads";
    public static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    // Document type IDs
    public static final long DOC_TYPE_CCCD = 1L;
    public static final long DOC_TYPE_HOC_BA = 2L;
    public static final long DOC_TYPE_BANG_TN = 3L;
    public static final long DOC_TYPE_CHUNG_CHI = 4L;
    public static final long DOC_TYPE_ANH_THE = 5L;
    public static final long DOC_TYPE_GIAY_KHAI_SINH = 6L;
    public static final long DOC_TYPE_HO_KHAU = 7L;

    // API Paths
    public static final String API_PREFIX = "/api";
}
