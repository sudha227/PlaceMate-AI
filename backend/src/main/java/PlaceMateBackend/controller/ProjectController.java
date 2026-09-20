package PlaceMateBackend.controller;

import PlaceMateBackend.model.Project;
import PlaceMateBackend.repository.ProjectRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectController {

    private final ProjectRepository projectRepository;

    public ProjectController(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    // ADD PROJECT
    @PostMapping
    public Project addProject(@RequestBody Project project) {
        return projectRepository.save(project);
    }

    // GET PROJECTS FOR A STUDENT
    @GetMapping("/{email}")
    public List<Project> getProjects(@PathVariable String email) {
        return projectRepository.findByEmail(email);
    }

    // UPDATE PROJECT
    @PutMapping("/{id}")
    public Project updateProject(
            @PathVariable Long id,
            @RequestBody Project projectData) {

        return projectRepository.findById(id)
                .map(project -> {

                    project.setProjectName(
                            projectData.getProjectName()
                    );

                    project.setDescription(
                            projectData.getDescription()
                    );

                    project.setTechnologies(
                            projectData.getTechnologies()
                    );

                    project.setProjectLink(
                            projectData.getProjectLink()
                    );

                    return projectRepository.save(project);
                })
                .orElse(null);
    }

    // DELETE PROJECT
    @DeleteMapping("/{id}")
    public String deleteProject(@PathVariable Long id) {

        if (!projectRepository.existsById(id)) {
            return "Project not found.";
        }

        projectRepository.deleteById(id);

        return "Project deleted successfully.";
    }
}