package PlaceMateBackend.service;

import PlaceMateBackend.model.Student;
import PlaceMateBackend.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }

    public Optional<Student> getStudentByEmail(String email) {
        return studentRepository.findByEmail(email);
    }
    public Student updateStudentProfile(
        String email,
        Student profileData) {

    Optional<Student> existingStudent =
            studentRepository.findByEmail(email);

    if (existingStudent.isPresent()) {

        Student student = existingStudent.get();

        student.setFull_name(profileData.getFull_name());
        student.setBranch(profileData.getBranch());
        student.setGraduation_year(
                profileData.getGraduation_year()
        );

        student.setTechnical_skills(
                profileData.getTechnical_skills()
        );

        student.setProjects(
                profileData.getProjects()
        );

        student.setTarget_job_role(
                profileData.getTarget_job_role()
        );

        return studentRepository.save(student);
    }

    return null;
}
}