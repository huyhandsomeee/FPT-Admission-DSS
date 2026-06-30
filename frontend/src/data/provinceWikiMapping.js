/**
 * Maps new 34-province codenames (from provinces.open-api.vn) to
 * the list of old (63-province) Wikipedia page suffixes used in:
 * "Danh sách trường trung học phổ thông tại {suffix}"
 *
 * Vietnam merged 63 → 34 provinces in 2025.
 * Each new province may cover multiple old provinces.
 */
export const PROVINCE_WIKI_MAPPING = {
  // Thành phố Hà Nội (code 1) = Hà Nội + Hòa Bình + Vĩnh Phúc + Hà Nam
  ha_noi: ["Hà Nội", "Hòa Bình", "Vĩnh Phúc", "Hà Nam"],

  // Tỉnh Cao Bằng (code 4) = Cao Bằng + Bắc Kạn
  cao_bang: ["Cao Bằng", "Bắc Kạn"],

  // Tỉnh Tuyên Quang (code 8) = Tuyên Quang + Hà Giang
  tuyen_quang: ["Tuyên Quang", "Hà Giang"],

  // Tỉnh Điện Biên (code 11) = Điện Biên
  dien_bien: ["Điện Biên"],

  // Tỉnh Lai Châu (code 12) = Lai Châu
  lai_chau: ["Lai Châu"],

  // Tỉnh Sơn La (code 14) = Sơn La
  son_la: ["Sơn La"],

  // Tỉnh Lào Cai (code 15) = Lào Cai + Yên Bái
  lao_cai: ["Lào Cai", "Yên Bái"],

  // Tỉnh Thái Nguyên (code 19) = Thái Nguyên
  thai_nguyen: ["Thái Nguyên"],

  // Tỉnh Lạng Sơn (code 20) = Lạng Sơn
  lang_son: ["Lạng Sơn"],

  // Tỉnh Quảng Ninh (code 22) = Quảng Ninh + Bắc Giang + Hải Dương
  quang_ninh: ["Quảng Ninh", "Bắc Giang", "Hải Dương"],

  // Tỉnh Bắc Ninh (code 24) = Bắc Ninh
  bac_ninh: ["Bắc Ninh"],

  // Tỉnh Phú Thọ (code 25) = Phú Thọ
  phu_tho: ["Phú Thọ"],

  // Thành phố Hải Phòng (code 31) = Hải Phòng + Thái Bình
  hai_phong: ["Hải Phòng", "Thái Bình"],

  // Tỉnh Hưng Yên (code 33) = Hưng Yên
  hung_yen: ["Hưng Yên"],

  // Tỉnh Ninh Bình (code 37) = Ninh Bình + Nam Định
  ninh_binh: ["Ninh Bình", "Nam Định"],

  // Tỉnh Thanh Hóa (code 38) = Thanh Hóa
  thanh_hoa: ["Thanh Hóa"],

  // Tỉnh Nghệ An (code 40) = Nghệ An
  nghe_an: ["Nghệ An"],

  // Tỉnh Hà Tĩnh (code 42) = Hà Tĩnh + Quảng Bình
  ha_tinh: ["Hà Tĩnh", "Quảng Bình"],

  // Tỉnh Quảng Trị (code 44) = Quảng Trị
  quang_tri: ["Quảng Trị"],

  // Thành phố Huế (code 46) = Thừa Thiên-Huế
  hue: ["Thành phố Huế", "Thừa Thiên Huế"],

  // Thành phố Đà Nẵng (code 48) = Đà Nẵng + Quảng Nam
  da_nang: ["Đà Nẵng", "Quảng Nam"],

  // Tỉnh Quảng Ngãi (code 51) = Quảng Ngãi + Bình Định
  quang_ngai: ["Quảng Ngãi", "Bình Định"],

  // Tỉnh Gia Lai (code 52) = Gia Lai + Kon Tum
  gia_lai: ["Gia Lai", "Kon Tum"],

  // Tỉnh Khánh Hòa (code 56) = Khánh Hòa + Phú Yên + Ninh Thuận
  khanh_hoa: ["Khánh Hòa", "Phú Yên", "Ninh Thuận"],

  // Tỉnh Đắk Lắk (code 66) = Đắk Lắk + Đắk Nông
  dak_lak: ["Đắk Lắk", "Đắk Nông"],

  // Tỉnh Lâm Đồng (code 68) = Lâm Đồng + Bình Thuận
  lam_dong: ["Lâm Đồng", "Bình Thuận"],

  // Tỉnh Đồng Nai (code 75) = Đồng Nai + Bình Dương + Bà Rịa - Vũng Tàu
  dong_nai: ["Đồng Nai", "Bình Dương", "Bà Rịa - Vũng Tàu"],

  // Thành phố Hồ Chí Minh (code 79)
  ho_chi_minh: ["Thành phố Hồ Chí Minh"],

  // Tỉnh Tây Ninh (code 80) = Tây Ninh + Bình Phước + Long An
  tay_ninh: ["Tây Ninh", "Bình Phước", "Long An"],

  // Tỉnh Đồng Tháp (code 82) = Đồng Tháp + Tiền Giang + Bến Tre
  dong_thap: ["Đồng Tháp", "Tiền Giang", "Bến Tre"],

  // Tỉnh Vĩnh Long (code 86) = Vĩnh Long + Trà Vinh
  vinh_long: ["Vĩnh Long", "Trà Vinh"],

  // Tỉnh An Giang (code 91) = An Giang + Kiên Giang
  an_giang: ["An Giang", "Kiên Giang"],

  // Thành phố Cần Thơ (code 92) = Cần Thơ + Hậu Giang + Sóc Trăng + Bạc Liêu
  can_tho: ["Cần Thơ", "Hậu Giang", "Sóc Trăng", "Bạc Liêu"],

  // Tỉnh Cà Mau (code 96) = Cà Mau
  ca_mau: ["Cà Mau"],
};
