package PlaceMateBackend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class StudentSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private int java;

    private int python;

    private int sqlSkill;

    private int dsa;

    private int htmlCss;

    private int react;

    public StudentSkill() {
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getJava() {
        return java;
    }

    public void setJava(int java) {
        this.java = java;
    }

    public int getPython() {
        return python;
    }

    public void setPython(int python) {
        this.python = python;
    }

    public int getSqlSkill() {
        return sqlSkill;
    }

    public void setSqlSkill(int sqlSkill) {
        this.sqlSkill = sqlSkill;
    }

    public int getDsa() {
        return dsa;
    }

    public void setDsa(int dsa) {
        this.dsa = dsa;
    }

    public int getHtmlCss() {
        return htmlCss;
    }

    public void setHtmlCss(int htmlCss) {
        this.htmlCss = htmlCss;
    }

    public int getReact() {
        return react;
    }

    public void setReact(int react) {
        this.react = react;
    }
}