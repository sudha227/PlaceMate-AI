package PlaceMateBackend.repository;

import PlaceMateBackend.model.StudentSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentSkillRepository
        extends JpaRepository<StudentSkill, Long> {

    Optional<StudentSkill> findByEmail(String email);
}