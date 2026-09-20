package PlaceMateBackend.controller;

import PlaceMateBackend.model.StudentSkill;
import PlaceMateBackend.repository.StudentSkillRepository;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/roadmap")
@CrossOrigin(origins = "http://localhost:5173")
public class RoadmapController {

    private final StudentSkillRepository studentSkillRepository;

    public RoadmapController(
            StudentSkillRepository studentSkillRepository) {

        this.studentSkillRepository =
                studentSkillRepository;
    }

    // ==========================================
    // GET PERSONALIZED ROADMAP
    // ==========================================

    @GetMapping
    public Map<String, Object> getRoadmap(
            @RequestParam String email) {

        Map<String, Object> response =
                new HashMap<>();

        List<Map<String, String>> roadmap =
                new ArrayList<>();

        // ------------------------------------------
        // FIND STUDENT SKILLS
        // ------------------------------------------

        StudentSkill studentSkill =
                studentSkillRepository
                        .findByEmail(email)
                        .orElse(null);

        if (studentSkill == null) {

            response.put(
                    "status",
                    "error"
            );

            response.put(
                    "message",
                    "Skills not found for this student."
            );

            response.put(
                    "roadmap",
                    roadmap
            );

            return response;
        }

        // ------------------------------------------
        // ADD ROADMAP FOR WEAK SKILLS
        // ------------------------------------------

        addRoadmap(
                roadmap,
                "Java",
                studentSkill.getJava()
        );

        addRoadmap(
                roadmap,
                "Python",
                studentSkill.getPython()
        );

        addRoadmap(
                roadmap,
                "SQL",
                studentSkill.getSqlSkill()
        );

        addRoadmap(
                roadmap,
                "Data Structures",
                studentSkill.getDsa()
        );

        addRoadmap(
                roadmap,
                "HTML & CSS",
                studentSkill.getHtmlCss()
        );

        addRoadmap(
                roadmap,
                "React",
                studentSkill.getReact()
        );

        // ------------------------------------------
        // RESPONSE
        // ------------------------------------------

        response.put(
                "status",
                "success"
        );

        response.put(
                "roadmap",
                roadmap
        );

        if (roadmap.isEmpty()) {

            response.put(
                    "message",
                    "Excellent! No major skill gaps detected."
            );

        } else {

            response.put(
                    "message",
                    "Personalized roadmap generated based on your skill gaps."
            );
        }

        return response;
    }

    // ==========================================
    // ADD ROADMAP IF SCORE < 70
    // ==========================================

    private void addRoadmap(
            List<Map<String, String>> roadmap,
            String skill,
            int score) {

        if (score < 70) {

            Map<String, String> item =
                    new HashMap<>();

            item.put(
                    "skill",
                    skill
            );

            item.put(
                    "score",
                    String.valueOf(score)
            );

            item.put(
                    "duration",
                    getDuration(skill)
            );

            item.put(
                    "task",
                    getTask(skill)
            );

            roadmap.add(item);
        }
    }

    // ==========================================
    // DURATION
    // ==========================================

    private String getDuration(
            String skill) {

        switch (skill.toLowerCase()) {

            case "java":
                return "2 Weeks";

            case "python":
                return "2 Weeks";

            case "sql":
                return "1 Week";

            case "data structures":
                return "3 Weeks";

            case "html & css":
                return "1 Week";

            case "react":
                return "2 Weeks";

            default:
                return "1 Week";
        }
    }

    // ==========================================
    // TASK
    // ==========================================

    private String getTask(
            String skill) {

        switch (skill.toLowerCase()) {

            case "java":

                return "Practice Java OOP, collections, exception handling and coding problems.";

            case "python":

                return "Practice Python fundamentals, functions, OOP and problem-solving programs.";

            case "sql":

                return "Practice SELECT, JOIN, GROUP BY, subqueries and database problems.";

            case "data structures":

                return "Practice arrays, strings, linked lists, stacks, queues and sorting algorithms.";

            case "html & css":

                return "Practice semantic HTML, CSS Flexbox, Grid, responsive design and modern layouts.";

            case "react":

                return "Learn React components, props, state and hooks, then build a small React project.";

            default:

                return "Learn the fundamentals of "
                        + skill
                        + " and build a small project.";
        }
    }
}