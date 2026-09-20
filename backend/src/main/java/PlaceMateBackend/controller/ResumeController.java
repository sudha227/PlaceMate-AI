package PlaceMateBackend.controller;

import PlaceMateBackend.model.Resume;
import PlaceMateBackend.service.ResumeService;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = "http://localhost:5173")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    // ==========================================
    // UPLOAD + ANALYZE RESUME
    // ==========================================

    @PostMapping("/upload")
    public Map<String, Object> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "email", required = false)
            String email) {

        Map<String, Object> response = new HashMap<>();

        try {

            // ------------------------------------------
            // CHECK FILE
            // ------------------------------------------

            if (file == null || file.isEmpty()) {

                response.put("status", "error");
                response.put(
                        "message",
                        "Please select a resume."
                );

                return response;
            }

            // ------------------------------------------
            // CHECK PDF
            // ------------------------------------------

            String fileName = file.getOriginalFilename();

            if (fileName == null ||
                    !fileName.toLowerCase().endsWith(".pdf")) {

                response.put("status", "error");
                response.put(
                        "message",
                        "Only PDF resumes are supported."
                );

                return response;
            }

            // ------------------------------------------
            // CHECK EMAIL
            // ------------------------------------------

            if (email == null || email.trim().isEmpty()) {

                response.put("status", "error");
                response.put(
                        "message",
                        "User email is required."
                );

                return response;
            }

            email = email.trim();

            // ------------------------------------------
            // EXTRACT PDF TEXT
            // ------------------------------------------

            byte[] pdfBytes = file.getBytes();

            String extractedText;

            try (
                    var document =
                            Loader.loadPDF(pdfBytes)
            ) {

                PDFTextStripper stripper =
                        new PDFTextStripper();

                extractedText =
                        stripper.getText(document);
            }

            // ------------------------------------------
            // CHECK PDF CONTENT
            // ------------------------------------------

            if (extractedText == null ||
                    extractedText.trim().isEmpty()) {

                response.put("status", "error");
                response.put(
                        "message",
                        "Unable to read text from this PDF. Please upload a text-based resume."
                );

                return response;
            }

            String text =
                    extractedText.toLowerCase();

            // ------------------------------------------
            // DETECT RESUME-RELATED CONTENT
            // ------------------------------------------

            boolean looksLikeResume =
                    text.contains("education") ||
                    text.contains("experience") ||
                    text.contains("skills") ||
                    text.contains("projects") ||
                    text.contains("resume") ||
                    text.contains("objective") ||
                    text.contains("certifications");

            if (!looksLikeResume) {

                response.put("status", "error");
                response.put(
                        "message",
                        "This does not appear to be a resume. Please upload your resume PDF."
                );

                return response;
            }

            // ------------------------------------------
            // SKILL DETECTION
            // ------------------------------------------

            List<String> detectedSkills =
                    new ArrayList<>();

            if (containsSkill(text, "java")) {
                detectedSkills.add("Java");
            }

            if (containsSkill(text, "python")) {
                detectedSkills.add("Python");
            }

            if (containsSkill(text, "sql")) {
                detectedSkills.add("SQL");
            }

            if (containsSkill(text, "html")) {
                detectedSkills.add("HTML");
            }

            if (containsSkill(text, "css")) {
                detectedSkills.add("CSS");
            }

            if (containsSkill(text, "react")) {
                detectedSkills.add("React");
            }

            if (containsSkill(text, "javascript") ||
                    containsSkill(text, "java script")) {

                detectedSkills.add("JavaScript");
            }

            if (containsSkill(text, "git") ||
                    containsSkill(text, "github")) {

                detectedSkills.add("Git");
            }

            if (containsSkill(text, "spring boot") ||
                    containsSkill(text, "springboot")) {

                detectedSkills.add("Spring Boot");
            }

            if (containsSkill(text, "c++")) {
                detectedSkills.add("C++");
            }

            if (containsSkill(text, "c#") ||
                    containsSkill(text, "c sharp")) {

                detectedSkills.add("C#");
            }

            if (containsSkill(text, "mongodb") ||
                    containsSkill(text, "mongo db")) {

                detectedSkills.add("MongoDB");
            }

            if (containsSkill(text, "mysql")) {
                detectedSkills.add("MySQL");
            }

            if (containsSkill(text, "node.js") ||
                    containsSkill(text, "nodejs")) {

                detectedSkills.add("Node.js");
            }

            // ------------------------------------------
            // IMPORTANT SKILLS FOR PLACEMENT
            // ------------------------------------------

            List<String> importantSkills =
                    Arrays.asList(
                            "Java",
                            "Python",
                            "SQL",
                            "HTML",
                            "CSS",
                            "React",
                            "JavaScript",
                            "Git",
                            "Data Structures",
                            "Spring Boot"
                    );

            // ------------------------------------------
            // MISSING SKILLS
            // ------------------------------------------

            List<String> missingSkills =
                    new ArrayList<>();

            for (String skill : importantSkills) {

                boolean found = false;

                for (String detected : detectedSkills) {

                    if (detected.equalsIgnoreCase(skill)) {
                        found = true;
                        break;
                    }
                }

                // Data Structures needs special check
                if (skill.equals("Data Structures")) {

                    if (text.contains("data structures") ||
                            text.contains("dsa") ||
                            text.contains("algorithms")) {

                        found = true;
                    }
                }

                if (!found) {
                    missingSkills.add(skill);
                }
            }

            // ------------------------------------------
            // CALCULATE SCORE
            // ------------------------------------------

            int totalSkills =
                    importantSkills.size();

            int detectedImportantSkills = 0;

            for (String skill : importantSkills) {

                boolean found = false;

                for (String detected : detectedSkills) {

                    if (detected.equalsIgnoreCase(skill)) {
                        found = true;
                        break;
                    }
                }

                if (skill.equals("Data Structures")) {

                    if (text.contains("data structures") ||
                            text.contains("dsa") ||
                            text.contains("algorithms")) {

                        found = true;
                    }
                }

                if (found) {
                    detectedImportantSkills++;
                }
            }

            int resumeScore =
                    Math.round(
                            ((float) detectedImportantSkills
                                    / totalSkills) * 100
                    );

            // ------------------------------------------
            // SAVE TO MYSQL
            // ------------------------------------------

            Resume resume =
                    resumeService
                            .getResumeByEmail(email);

            if (resume == null) {

                resume = new Resume();

                resume.setEmail(email);
            }

            resume.setResumeScore(
                    resumeScore
            );

            resume.setMissingSkills(
                    String.join(
                            ",",
                            missingSkills
                    )
            );

            resumeService.saveResume(resume);

            // ------------------------------------------
            // RESPONSE
            // ------------------------------------------

            response.put(
                    "status",
                    "success"
            );

            response.put(
                    "message",
                    "Resume analyzed successfully!"
            );

            response.put(
                    "resume_score",
                    resumeScore
            );

            response.put(
                    "detected_skills",
                    detectedSkills
            );

            response.put(
                    "missing_skills",
                    missingSkills
            );

            return response;

        } catch (Exception e) {

            e.printStackTrace();

            response.put(
                    "status",
                    "error"
            );

            response.put(
                    "message",
                    "Resume analysis failed: "
                            + e.getMessage()
            );

            return response;
        }
    }

    // ==========================================
    // GET RESUME READINESS
    // ==========================================

    @GetMapping("/readiness")
    public Map<String, Object> getResumeReadiness(
            @RequestParam String email) {

        Map<String, Object> response =
                new HashMap<>();

        Resume resume =
                resumeService
                        .getResumeByEmail(email);

        if (resume != null) {

            response.put(
                    "status",
                    "success"
            );

            response.put(
                    "resume_score",
                    resume.getResumeScore()
            );

            String missingSkills =
                    resume.getMissingSkills();

            if (missingSkills == null ||
                    missingSkills.trim().isEmpty()) {

                response.put(
                        "missing_skills",
                        new String[]{}
                );

            } else {

                response.put(
                        "missing_skills",
                        missingSkills.split(",")
                );
            }

        } else {

            response.put(
                    "status",
                    "error"
            );

            response.put(
                    "message",
                    "Resume not found."
            );

            response.put(
                    "resume_score",
                    0
            );

            response.put(
                    "missing_skills",
                    new String[]{}
            );
        }

        return response;
    }

    // ==========================================
    // SKILL SEARCH HELPER
    // ==========================================

    private boolean containsSkill(
            String text,
            String skill) {

        return text.contains(skill.toLowerCase());
    }
}