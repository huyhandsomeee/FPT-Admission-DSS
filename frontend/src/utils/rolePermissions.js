// Role constants for FPT Admission System
export const ROLES = {
  STUDENT: 'STUDENT',
  ADMISSION_OFFICER: 'ADMISSION_OFFICER',
  ADMISSION_MANAGER: 'ADMISSION_MANAGER',
  BOD: 'BOD',
  ADMIN: 'ADMIN',
};

export const ROLE_LABELS = {
  STUDENT: 'Sinh viên',
  ADMISSION_OFFICER: 'Nhân viên tuyển sinh',
  ADMISSION_MANAGER: 'Trưởng phòng tuyển sinh',
  BOD: 'Ban giám hiệu',
  ADMIN: 'Quản trị viên',
};

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
    case ROLES.ADMISSION_OFFICER: return '/officer/dashboard';
    case ROLES.ADMISSION_MANAGER: return '/manager/dashboard';
    case ROLES.BOD: return '/bod/dashboard';
    case ROLES.ADMIN: return '/admin/dashboard';
    default: return '/login';
  }
};
