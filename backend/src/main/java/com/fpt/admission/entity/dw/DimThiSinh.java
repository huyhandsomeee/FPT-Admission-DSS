package com.fpt.admission.entity.dw;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "dw_dim_thi_sinh")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DimThiSinh {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "thi_sinh_key")
    private Long thiSinhKey; // Surrogate key

    @Column(name = "thi_sinh_id", nullable = false, unique = true)
    private Long thiSinhId; // Natural key from operational system

    @Column(name = "ma_thi_sinh", length = 50)
    private String maThiSinh;

    @Column(name = "ho_ten", length = 200, nullable = false)
    private String hoTen;

    @Column(name = "email", length = 200)
    private String email;

    @Column(name = "so_dien_thoai", length = 20)
    private String soDienThoai;

    @Column(name = "ngay_sinh")
    private LocalDate ngaySinh;

    @Column(name = "gioi_tinh", length = 10)
    private String gioiTinh;

    @Column(name = "cccd", length = 20)
    private String cccd;

    @Column(name = "dia_chi_thuong_tru", columnDefinition = "TEXT")
    private String diaChiThuongTru;

    @Column(name = "tinh_thanh_key")
    private Long tinhThanhKey; // FK to DimTinhThanh

    @Column(name = "ten_tinh_thanh", length = 100)
    private String tenTinhThanh;

    @Column(name = "vung_mien", length = 20)
    private String vungMien; // NORTH, CENTRAL, SOUTH

    @Column(name = "ten_truong_thpt", length = 200)
    private String tenTruongTHPT;

    @Column(name = "nam_tot_nghiep")
    private Integer namTotNghiep;

    @Column(name = "diem_toan", precision = 4, scale = 2)
    private java.math.BigDecimal diemToan;

    @Column(name = "diem_van", precision = 4, scale = 2)
    private java.math.BigDecimal diemVan;

    @Column(name = "diem_anh", precision = 4, scale = 2)
    private java.math.BigDecimal diemAnh;

    @Column(name = "diem_ly", precision = 4, scale = 2)
    private java.math.BigDecimal diemLy;

    @Column(name = "diem_hoa", precision = 4, scale = 2)
    private java.math.BigDecimal diemHoa;

    @Column(name = "diem_sinh", precision = 4, scale = 2)
    private java.math.BigDecimal diemSinh;

    @Column(name = "diem_su", precision = 4, scale = 2)
    private java.math.BigDecimal diemSu;

    @Column(name = "diem_dia", precision = 4, scale = 2)
    private java.math.BigDecimal diemDia;

    @Column(name = "diem_gdcd", precision = 4, scale = 2)
    private java.math.BigDecimal diemGdcd;

    @Column(name = "diem_tin", precision = 4, scale = 2)
    private java.math.BigDecimal diemTin;

    @Column(name = "diem_cn", precision = 4, scale = 2)
    private java.math.BigDecimal diemCn;

    @Column(name = "diem_tb_10", precision = 4, scale = 2)
    private java.math.BigDecimal diemTb10;

    @Column(name = "diem_tb_11", precision = 4, scale = 2)
    private java.math.BigDecimal diemTb11;

    @Column(name = "diem_tb_12", precision = 4, scale = 2)
    private java.math.BigDecimal diemTb12;

    @Column(name = "diem_xet_tuyen", precision = 5, scale = 2)
    private java.math.BigDecimal diemXetTuyen;

    @Column(name = "ma_to_hop", length = 10)
    private String maToHop;

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;

    @Column(name = "ngay_cap_nhat")
    private LocalDateTime ngayCapNhat;

    @Column(name = "etl_batch_id")
    private String etlBatchId;

    @Column(name = "is_current")
    private Boolean isCurrent = true;

    @Column(name = "valid_from")
    private LocalDateTime validFrom;

    @Column(name = "valid_to")
    private LocalDateTime validTo;
}