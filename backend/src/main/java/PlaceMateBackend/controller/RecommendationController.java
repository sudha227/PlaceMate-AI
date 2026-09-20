package PlaceMateBackend.controller;

import PlaceMateBackend.model.StudentSkill;
import PlaceMateBackend.repository.StudentSkillRepository;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "http://localhost:5173")
public class RecommendationController {

    private final StudentSkillRepository studentSkillRepository;

    public RecommendationController(
            StudentSkillRepository studentSkillRepository) {

        this.studentSkillRepository =
                studentSkillRepository;
    }

    // ==========================================
    // GET PERSONALIZED RECOMMENDATIONS
    // ==========================================

    @GetMapping
    public Map<String, Object> getRecommendations(
            @RequestParam String email) {

        Map<String, Object> response =
                new HashMap<>();

        List<Map<String, String>> recommendations =
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
                    "recommendations",
                    recommendations
            );

            return response;
        }

        // ------------------------------------------
        // CHECK EACH SKILL
        // ------------------------------------------

        addRecommendation(
                recommendations,
                "Java",
                studentSkill.getJava()
        );

        addRecommendation(
                recommendations,
                "Python",
                studentSkill.getPython()
        );

        addRecommendation(
                recommendations,
                "SQL",
                studentSkill.getSqlSkill()
        );

        addRecommendation(
                recommendations,
                "Data Structures",
                studentSkill.getDsa()
        );

        addRecommendation(
                recommendations,
                "HTML & CSS",
                studentSkill.getHtmlCss()
        );

        addRecommendation(
                recommendations,
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
                "recommendations",
                recommendations
        );

        if (recommendations.isEmpty()) {

            response.put(
                    "message",
                    "Excellent! No major skill gaps detected."
            );

        } else {

            response.put(
                    "message",
                    "Here are the skills you should improve."
            );
        }

        return response;
    }

    // ==========================================
    // ADD RECOMMENDATION IF SCORE < 70
    // ==========================================

    private void addRecommendation(
            List<Map<String, String>> recommendations,
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
                    "recommendation",
                    getRecommendation(skill)
            );

            recommendations.add(item);
        }
    }

    // ==========================================
    // RECOMMENDATION MESSAGES
    // ==========================================

    private String getRecommendation(
            String skill) {

        switch (skill.toLowerCase()) {

            case "java":

                return "Practice Java OOP, collections, exception handling and coding problems regularly.";

            case "python":

                return "Practice Python fundamentals, functions, OOP, libraries and problem-solving.";

            case "sql":

                return "Practice SELECT, JOIN, GROUP BY, subqueries and database problems.";

            case "data structures":

                return "Practice arrays, strings, linked lists, stacks, queues, trees and sorting algorithms.";

            case "html & css":

                return "Practice semantic HTML, CSS Flexbox, Grid, responsive design and modern layouts.";

            case "react":

                return "Learn React components, props, state, hooks and routing. Build small React projects.";

            default:

                return "Improve your " +
                        skill +
                        " skills through regular practice and projects.";
        }
    }
}