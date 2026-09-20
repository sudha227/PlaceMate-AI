
package PlaceMateBackend.repository;

import PlaceMateBackend.model.Project;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByEmail(String email);

}

