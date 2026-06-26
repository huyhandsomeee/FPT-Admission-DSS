package com.fpt.admission.mapper;

import com.fpt.admission.entity.StudentProfile;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;

@Component
public class StudentProfileMapper {

    public Map<String, Object> toDashboardMap(StudentProfile profile, long unreadNotifications) {
        Map<String, Object> m = new LinkedHashMap<>();
        if (profile == null) {
            m.put("totalApplications", 0);
            m.put("applications", java.util.List.of());
            m.put("hasProfile", false);
            m.put("allowNewApplication", false);
            m.put("newApplicationRequest", "NONE");
            m.put("unreadNotifications", unreadNotifications);
            return m;
        }

        m.put("hasProfile", true);
        m.put("allowNewApplication", profile.getAllowNewApplication() != null ? profile.getAllowNewApplication() : false);
        m.put("newApplicationRequest", profile.getNewApplicationRequest() != null ? profile.getNewApplicationRequest() : "NONE");
        m.put("unreadNotifications", unreadNotifications);
        return m;
    }
}
