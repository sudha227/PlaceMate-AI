package PlaceMateBackend.controller;

import PlaceMateBackend.model.LoginRequest;
import PlaceMateBackend.model.Student;
import PlaceMateBackend.service.StudentService;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // REGISTER
    @PostMapping
    public Map<String, Object> registerStudent(@RequestBody Student student) {

        Student savedStudent = studentService.saveStudent(student);

        Map<String, Object> response = new HashMap<>();

        response.put("status", "success");
        response.put("message", "Student registered successfully!");
        response.put("user", savedStudent);

        return response;
    }

    // LOGIN
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest loginRequest) {

        Map<String, Object> response = new HashMap<>();

        var student = studentService
                .getStudentByEmail(loginRequest.getEmail());

        if (student.isPresent()
                && student.get().getPassword()
                    .equals(loginRequest.getPassword())) {

            response.put("status", "success");
            response.put("message", "Login successful!");

            Map<String, Object> user = new HashMap<>();

            user.put("id", student.get().getId());
            user.put("full_name", student.get().getFull_name());
            user.put("email", student.get().getEmail());
            user.put("branch", student.get().getBranch());
            user.put("graduation_year",
                    student.get().getGraduation_year());

            response.put("user", user);

        } else {

            response.put("status", "error");
            response.put("message", "Invalid email or password.");
        }

        return response;
    }
    // UPDATE PROFILE
@PutMapping("/profile/{email}")
public Map<String, Object> updateProfile(
        @PathVariable String email,
        @RequestBody Student profileData) {

    Map<String, Object> response = new HashMap<>();

    Student updatedStudent =
            studentService.updateStudentProfile(
                    email,
                    profileData
            );

    if (updatedStudent != null) {

        response.put("status", "success");
        response.put("message", "Profile updated successfully! 🎉");
        response.put("user", updatedStudent);

    } else {

        response.put("status", "error");
        response.put("message", "Student not found.");
    }

    return response;
}
}