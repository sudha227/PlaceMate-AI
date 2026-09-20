
package PlaceMateBackend.controller;

import PlaceMateBackend.model.StudentSkill;
import PlaceMateBackend.repository.StudentSkillRepository;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentSkillController {

    private final StudentSkillRepository repository;

    public StudentSkillController(
            StudentSkillRepository repository) {

        this.repository = repository;
    }


    // SAVE / UPDATE SKILLS

    @PostMapping
    public StudentSkill saveSkills(
            @RequestBody StudentSkill skill) {

        StudentSkill existing =
                repository
                        .findByEmail(skill.getEmail())
                        .orElse(null);


        // If student already has skills,
        // update the existing row

        if (existing != null) {

            existing.setJava(
                    skill.getJava()
            );

            existing.setPython(
                    skill.getPython()
            );

            existing.setSqlSkill(
                    skill.getSqlSkill()
            );

            existing.setDsa(
                    skill.getDsa()
            );

            existing.setHtmlCss(
                    skill.getHtmlCss()
            );

            existing.setReact(
                    skill.getReact()
            );

            return repository.save(existing);
        }


        // Otherwise create new row

        return repository.save(skill);
    }


    // GET SKILLS

    @GetMapping("/{email}")
    public StudentSkill getSkills(
            @PathVariable String email) {

        return repository
                .findByEmail(email)
                .orElse(null);
    }
}

