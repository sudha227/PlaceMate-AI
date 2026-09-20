package PlaceMateBackend.service;

import PlaceMateBackend.model.Resume;
import PlaceMateBackend.repository.ResumeRepository;

import org.springframework.stereotype.Service;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;

    public ResumeService(ResumeRepository resumeRepository) {
        this.resumeRepository = resumeRepository;
    }

    public Resume saveResume(Resume resume) {

        return resumeRepository.save(resume);

    }

    public Resume getResumeByEmail(String email) {

        return resumeRepository
                .findByEmail(email)
                .orElse(null);

    }

}