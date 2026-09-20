package PlaceMateBackend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String full_name;
    private String email;
    private String password;
    private String branch;
    private String graduation_year;

    private String technical_skills;
    private String projects;
    private String target_job_role;

    public Student() {
    }

    public Student(
            String full_name,
            String email,
            String password,
            String branch,
            String graduation_year,
            String technical_skills,
            String projects,
            String target_job_role) {

        this.full_name = full_name;
        this.email = email;
        this.password = password;
        this.branch = branch;
        this.graduation_year = graduation_year;
        this.technical_skills = technical_skills;
        this.projects = projects;
        this.target_job_role = target_job_role;
    }

    public Long getId() {
        return id;
    }

    public String getFull_name() {
        return full_name;
    }

    public void setFull_name(String full_name) {
        this.full_name = full_name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public String getGraduation_year() {
        return graduation_year;
    }

    public void setGraduation_year(String graduation_year) {
        this.graduation_year = graduation_year;
    }

    public String getTechnical_skills() {
        return technical_skills;
    }

    public void setTechnical_skills(String technical_skills) {
        this.technical_skills = technical_skills;
    }

    public String getProjects() {
        return projects;
    }

    public void setProjects(String projects) {
        this.projects = projects;
    }

    public String getTarget_job_role() {
        return target_job_role;
    }

    public void setTarget_job_role(String target_job_role) {
        this.target_job_role = target_job_role;
    }
}