package com.fpt.admission.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationRequest {
    private String fullName;
    private String dob;
    private String gender;
    private String phone;
    private String cccd;
    private String permanentAddress;
    private Long provinceId;
    private String parentName;
    private String parentPhone;
    private String schoolName;
    private int graduationYear;
    private double mathScore;
    private double literatureScore;
    private double englishScore;
    private double gpa10;
    private double gpa11;
    private double gpa12;
    private Long campusId;
    private Long majorId;
    private Long methodId;
    private MultipartFile cccdFile;
    private MultipartFile hocBaFile;
    private MultipartFile bangTNFile;
    private MultipartFile anhTheFile;
    private MultipartFile giayKhaiSinhFile;
    private MultipartFile chungChiFile;
    private MultipartFile hoKhauFile;
}
