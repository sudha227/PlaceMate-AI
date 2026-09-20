package PlaceMateBackend.controller;

import PlaceMateBackend.model.Assessment;
import PlaceMateBackend.repository.AssessmentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/assessment")
@CrossOrigin(origins = "http://localhost:5173")
public class AssessmentController {

    private final AssessmentRepository assessmentRepository;

    public AssessmentController(AssessmentRepository assessmentRepository) {
        this.assessmentRepository = assessmentRepository;
    }

    @PostMapping
    public Map<String, Object> saveAssessment(@RequestBody Assessment assessment) {

        Map<String, Object> response = new HashMap<>();

        Assessment existing =
                assessmentRepository.findByEmail(assessment.getEmail()).orElse(null);

        if (existing != null) {
            existing.setScore(assessment.getScore());
            assessmentRepository.save(existing);
        } else {
            assessmentRepository.save(assessment);
        }

        response.put("status", "success");
        response.put("message", "Assessment score saved successfully.");
        response.put("score", assessment.getScore());

        return response;
    }

    @GetMapping("/{email}")
    public Map<String, Object> getAssessment(@PathVariable String email) {

        Map<String, Object> response = new HashMap<>();

        Assessment assessment =
                assessmentRepository.findByEmail(email).orElse(null);

        if (assessment == null) {
            response.put("status", "error");
            response.put("score", 0);
            response.put("message", "Assessment not found.");
            return response;
        }

        response.put("status", "success");
        response.put("score", assessment.getScore());

        return response;
    }
}