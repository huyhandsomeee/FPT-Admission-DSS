package com.fpt.admission.service;

import com.fpt.admission.entity.*;
import com.fpt.admission.entity.enums.ApplicationStatus;
import com.fpt.admission.repository.*;
import com.fpt.admission.service.impl.PipelineServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PipelineServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private StudentProfileRepository studentProfileRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private ValidationResultRepository validationResultRepository;

    @Mock
    private ReviewRuleRepository reviewRuleRepository;

    @Mock
    private PriorityScoreRepository priorityScoreRepository;

    @Mock
    private AISummaryRepository aiSummaryRepository;

    @Mock
    private JdbcTemplate jdbcTemplate;

    @InjectMocks
    private PipelineServiceImpl pipelineService;

    private Application testApp;
    private StudentProfile testProfile;
    private User testUser;
    private AcademicBackground testBackground;

    @BeforeEach
    public void setup() {
        testUser = User.builder()
                .id(1L)
                .email("student@example.com")
                .fullName("Nguyen Van A")
                .phone("0912345678")
                .build();

        testProfile = StudentProfile.builder()
                .id(1L)
                .user(testUser)
                .dob(LocalDate.of(2000, 1, 1))
                .gender("MALE")
                .ethnicity("Kinh")
                .permanentAddress("Hanoi")
                .cccdNumber("123456789012")
                .build();

        testBackground = AcademicBackground.builder()
                .id(1L)
                .studentProfile(testProfile)
                .schoolName("High School A")
                .graduationYear(2018)
                .gpa10(BigDecimal.valueOf(8.5))
                .gpa11(BigDecimal.valueOf(9.0))
                .gpa12(BigDecimal.valueOf(8.8))
                .ieltsScore(BigDecimal.valueOf(6.5))
                .certIssueDate(LocalDate.now().minusYears(1))
                .academicAchievement("Excellent Student")
                .build();

        testProfile.setAcademicBackground(testBackground);

        testApp = Application.builder()
                .id(1L)
                .applicationCode("FPT123456")
                .studentProfile(testProfile)
                .status(ApplicationStatus.SUBMITTED)
                .submittedAt(LocalDateTime.now())
                .build();
    }

    @Test
    public void testValidateApplication_Success() {
        when(applicationRepository.findById(1L)).thenReturn(Optional.of(testApp));
        when(validationResultRepository.findByApplicationId(1L)).thenReturn(Optional.empty());
        when(validationResultRepository.save(any(ValidationResult.class))).thenAnswer(i -> i.getArgument(0));

        // Mock document lookup
        List<java.util.Map<String, Object>> mockDocs = new ArrayList<>();
        for (String code : List.of("CCCD", "HOC_BA", "BANG_TN", "ANH_THE", "GK_THPT", "CHUNG_CHI")) {
            java.util.Map<String, Object> doc = new HashMap<>();
            doc.put("code", code);
            doc.put("file_name", "test.pdf");
            mockDocs.add(doc);
        }
        when(jdbcTemplate.queryForList(anyString(), eq(1L))).thenReturn(mockDocs);

        // Mock duplicate counts
        when(jdbcTemplate.queryForObject(contains("student_profiles"), eq(Long.class), any(), any())).thenReturn(0L);
        when(jdbcTemplate.queryForObject(contains("users WHERE email"), eq(Long.class), any(), any())).thenReturn(0L);
        when(jdbcTemplate.queryForObject(contains("users WHERE phone"), eq(Long.class), any(), any())).thenReturn(0L);

        ValidationResult result = pipelineService.validateApplication(1L);

        assertNotNull(result);
        assertEquals("COMPLETE", result.getStatus());
        assertTrue(result.getRequiredDocsOk());
        assertTrue(result.getCccdFormatOk());
        assertTrue(result.getGpaValid());
        assertTrue(result.getCertNotExpired());
        assertTrue(result.getNoDuplicateCccd());
        assertTrue(result.getNoDuplicateEmail());
        assertTrue(result.getNoDuplicatePhone());
    }

    @Test
    public void testCalculatePriorityScore_Success() {
        when(applicationRepository.findById(1L)).thenReturn(Optional.of(testApp));
        when(priorityScoreRepository.findByApplicationId(1L)).thenReturn(Optional.empty());
        when(priorityScoreRepository.save(any(PriorityScore.class))).thenAnswer(i -> i.getArgument(0));

        // Mock validation lookup
        ValidationResult mockVr = ValidationResult.builder()
                .requiredDocsOk(true)
                .cccdFormatOk(true)
                .gpaValid(true)
                .certNotExpired(true)
                .noDuplicateCccd(true)
                .noDuplicateEmail(true)
                .noDuplicatePhone(true)
                .status("COMPLETE")
                .build();
        when(validationResultRepository.findByApplicationId(1L)).thenReturn(Optional.of(mockVr));

        // Mock documents
        List<java.util.Map<String, Object>> mockDocs = new ArrayList<>();
        for (String code : List.of("CCCD", "HOC_BA", "BANG_TN", "ANH_THE", "GK_THPT")) {
            java.util.Map<String, Object> doc = new HashMap<>();
            doc.put("code", code);
            mockDocs.add(doc);
        }
        when(jdbcTemplate.queryForList(anyString(), eq(1L))).thenReturn(mockDocs);

        PriorityScore result = pipelineService.calculatePriorityScore(1L);

        assertNotNull(result);
        // GPA = (8.5+9+8.8)/3 = 8.76 -> Score component: 8.76 / 10 * 100 * 0.40 = 35.07
        // English IELTS = 6.5 -> 100% -> Score component: 100 * 0.20 = 20.0
        // Documents complete = 5/5 -> 100% -> Score component: 100 * 0.20 = 20.0
        // Achievement present -> 100% -> Score component: 100 * 0.10 = 10.0
        // App date default component: 5.0
        // Expected total priority score close to: 35 + 20 + 20 + 10 + 5 = 90
        assertTrue(result.getScore() >= 85 && result.getScore() <= 95);
    }
}
