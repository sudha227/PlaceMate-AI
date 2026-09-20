package PlaceMateBackend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "assessment")
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private int score;

    public Assessment() {
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public int getScore() {
        return score;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setScore(int score) {
        this.score = score;
    }
}