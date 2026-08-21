import React, { createContext, useContext, useState } from 'react';

const StaffContext = createContext();

export const useStaff = () => useContext(StaffContext);

export const StaffProvider = ({ children }) => {
  // 1. Dữ liệu nhân sự dùng chung cho HR, Finance, Academic
  const [staffList, setStaffList] = useState([
    {
      id: "EMP-00124",
      name: "Nguyễn Văn Tuấn",
      initials: "NT",
      avatarBg: "#2563EB",
      avatarColor: "#FFFFFF",
      dept: "Kỹ thuật Phần mềm",
      role: "Giảng viên Cao cấp",
      category: "ACADEMIC",
      baseSalary: 25000000,
      workDays: 20,
      deduction: 0,
      status: "PENDING", // PENDING = Chưa duyệt lương, PAID = Đã duyệt
      joinDate: "2020-05-15",
      type: "Toàn thời gian"
    },
    {
      id: "EMP-00215",
      name: "Trần Thị Lan",
      initials: "TL",
      avatarBg: "#10B981",
      avatarColor: "#FFFFFF",
      dept: "Kinh tế",
      role: "Trưởng bộ môn",
      category: "ACADEMIC",
      baseSalary: 28000000,
      workDays: 22,
      deduction: 0,
      status: "PENDING",
      joinDate: "2018-09-01",
      type: "Toàn thời gian"
    },
    {
      id: "EMP-00342",
      name: "Lê Minh Tuấn",
      initials: "LM",
      avatarBg: "#F59E0B",
      avatarColor: "#FFFFFF",
      dept: "Công tác sinh viên",
      role: "Chuyên viên",
      category: "ADMIN",
      baseSalary: 15000000,
      workDays: 22,
      deduction: 0,
      status: "PENDING",
      joinDate: "2022-02-10",
      type: "Toàn thời gian"
    },
    {
      id: "EMP-00411",
      name: "Phạm Hồng Ngọc",
      initials: "PN",
      avatarBg: "#8B5CF6",
      avatarColor: "#FFFFFF",
      dept: "Kế toán",
      role: "Kế toán trưởng",
      category: "ADMIN",
      baseSalary: 20000000,
      workDays: 22,
      deduction: 0,
      status: "PENDING",
      joinDate: "2019-11-20",
      type: "Toàn thời gian"
    }
  ]);

  // 2. Trạng thái bảng lương chung của tháng
  const [isPayrollApproved, setIsPayrollApproved] = useState(false);

  // 3. Đơn xin nghỉ phép (HR duyệt)
  const [leaveRequests, setLeaveRequests] = useState([
    { id: "LR-001", staffId: "EMP-00124", name: "Nguyễn Văn Tuấn", date: "24/10/2026", reason: "Việc gia đình", status: "PENDING", isUnpaid: true },
    { id: "LR-002", staffId: "EMP-00342", name: "Lê Minh Tuấn", date: "25/10/2026", reason: "Khám sức khỏe", status: "PENDING", isUnpaid: false }
  ]);

  // --- Các hàm nghiệp vụ ---

  // HR Nghiệp vụ 1: Onboard ứng viên (Tuyển dụng thành công)
  const onboardStaff = (newStaff) => {
    setStaffList(prev => [...prev, newStaff]);
  };

  // HR Nghiệp vụ 2: Duyệt đơn nghỉ phép
  const approveLeave = (leaveId) => {
    setLeaveRequests(prev =>
      prev.map(req => {
        if (req.id === leaveId) {
          // Nếu đơn xin nghỉ là "không lương", trừ 1 ngày công của staff trong staffList
          if (req.isUnpaid) {
            setStaffList(staffs => staffs.map(staff =>
              staff.id === req.staffId
                ? { ...staff, workDays: staff.workDays - 1, deduction: staff.deduction + (staff.baseSalary / 22) }
                : staff
            ));
          }
          return { ...req, status: "APPROVED" };
        }
        return req;
      })
    );
  };

  const rejectLeave = (leaveId) => {
    setLeaveRequests(prev => prev.map(req => req.id === leaveId ? { ...req, status: "REJECTED" } : req));
  }

  // Finance Nghiệp vụ 1: Duyệt bảng lương toàn trường
  const approvePayroll = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setStaffList(prev => prev.map(staff => ({ ...staff, status: "PAID" })));
        setIsPayrollApproved(true);
        resolve(true);
      }, 1000); // Giả lập call API 1 giây
    });
  };

  const value = {
    staffList,
    leaveRequests,
    isPayrollApproved,
    onboardStaff,
    approveLeave,
    rejectLeave,
    approvePayroll
  };

  return (
    <StaffContext.Provider value={value}>
      {children}
    </StaffContext.Provider>
  );
};
