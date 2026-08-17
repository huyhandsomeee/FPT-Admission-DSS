// Role constants for FPT University Data Portal
export const ROLES = {
  STUDENT: 'STUDENT',
  ADMISSION_OFFICER: 'ADMISSION_OFFICER',
  ADMISSION_MANAGER: 'ADMISSION_MANAGER',
  BOD: 'BOD',
  ADMIN: 'ADMIN',
  // Department-specific officer roles
  FINANCE_OFFICER: 'FINANCE_OFFICER',
  HR_OFFICER: 'HR_OFFICER',
  ACADEMIC_OFFICER: 'ACADEMIC_OFFICER',
  LIBRARY_OFFICER: 'LIBRARY_OFFICER',
  RESEARCH_OFFICER: 'RESEARCH_OFFICER',
};

export const ROLE_LABELS = {
  STUDENT: 'Sinh viên',
  ADMISSION_OFFICER: 'Cán bộ tuyển sinh',
  ADMISSION_MANAGER: 'Quản lý tuyển sinh',
  BOD: 'Ban Giám Đốc',
  ADMIN: 'Quản trị hệ thống',
  FINANCE_OFFICER: 'Cán bộ Tài chính',
  HR_OFFICER: 'Cán bộ Nhân sự',
  ACADEMIC_OFFICER: 'Cán bộ Học vụ',
  LIBRARY_OFFICER: 'Cán bộ Thư viện',
  RESEARCH_OFFICER: 'Cán bộ Nghiên cứu',
};

// Portal groupings
export const OFFICER_ROLES = [
  'ADMISSION_OFFICER', 'FINANCE_OFFICER', 'HR_OFFICER',
  'ACADEMIC_OFFICER', 'LIBRARY_OFFICER', 'RESEARCH_OFFICER',
];

export const MANAGER_ROLES = [
  'ADMISSION_MANAGER', 'ADMIN',
];

export const getUserRole = (user) => {
  if (!user) return null;
  return user.role || null;
};

export const hasRole = (user, role) => {
  return getUserRole(user) === role;
};

export const hasAnyRole = (user, roles) => {
  const userRole = getUserRole(user);
  return roles.includes(userRole);
};

export const getDefaultPath = (role) => {
  switch (role) {
    case ROLES.STUDENT: return '/student/dashboard';
    case ROLES.ADMISSION_OFFICER:
    case ROLES.FINANCE_OFFICER:
    case ROLES.HR_OFFICER:
    case ROLES.ACADEMIC_OFFICER:
    case ROLES.LIBRARY_OFFICER:
    case ROLES.RESEARCH_OFFICER:
      return '/officer/dashboard';
    case ROLES.ADMISSION_MANAGER: return '/manager/dashboard';
    case ROLES.BOD: return '/bod/dashboard';
    case ROLES.ADMIN: return '/admin/dashboard';
    default: return '/login';
  }
};
