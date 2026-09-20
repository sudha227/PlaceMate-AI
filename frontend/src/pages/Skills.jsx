
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

// Initial skill values
const INITIAL_SKILLS = {
  java: "0",
  python: "0",
  sqlSkill: "0",
  dsa: "0",
  htmlCss: "0",
  react: "0",
};

// Skill details
const SKILL_DETAILS = [
  { key: "java", name: "Java", icon: "☕" },
  { key: "python", name: "Python", icon: "🐍" },
  { key: "sqlSkill", name: "SQL", icon: "🗄️" },
  { key: "dsa", name: "Data Structures", icon: "🧩" },
  { key: "htmlCss", name: "HTML & CSS", icon: "🌐" },
  { key: "react", name: "React", icon: "⚛️" },
];

// Convert value to a valid score
const normalizeScore = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) return 0;

  return Math.min(100, Math.max(0, Math.floor(number)));
};

// Calculate overall score
const calculateOverallScore = (skills) => {
  const values = Object.values(skills).map(normalizeScore);

  const total = values.reduce((sum, value) => sum + value, 0);

  return Math.round(total / values.length);
};

// Get skill level
const getSkillLevel = (score) => {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Average";
  return "Beginner";
};

// Get progress bar class
const getSkillClass = (score) => {
  if (score >= 80) return "skill-excellent";
  if (score >= 60) return "skill-good";
  if (score >= 40) return "skill-average";
  return "skill-beginner";
};

function Skills() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState(INITIAL_SKILLS);
  const [overallScore, setOverallScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Load logged-in user and skills from backend
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      navigate("/login");
      return;
    }

    let loggedInUser;

    try {
      loggedInUser = JSON.parse(savedUser);
    } catch {
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }

    if (!loggedInUser?.email) {
      navigate("/login");
      return;
    }

    setUser(loggedInUser);

    fetch(
      `http://localhost:8080/api/skills/${encodeURIComponent(
        loggedInUser.email
      )}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch skills");
        }

        return response.json();
      })
      .then((data) => {
        const loadedSkills = {
          java: String(normalizeScore(data?.java)),
          python: String(normalizeScore(data?.python)),
          sqlSkill: String(normalizeScore(data?.sqlSkill)),
          dsa: String(normalizeScore(data?.dsa)),
          htmlCss: String(normalizeScore(data?.htmlCss)),
          react: String(normalizeScore(data?.react)),
        };

        setSkills(loadedSkills);
        setOverallScore(calculateOverallScore(loadedSkills));
      })
      .catch((error) => {
        console.error("Failed to load skills:", error);
        setMessage("Unable to load your skills.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  // Handle score input
  const handleSkillChange = (key, value) => {
    // Allow the input to be cleared temporarily
    if (value === "") {
      const updatedSkills = {
        ...skills,
        [key]: "",
      };

      setSkills(updatedSkills);
      setOverallScore(calculateOverallScore(updatedSkills));
      setMessage("");
      return;
    }

    // Allow only whole numbers
    if (!/^\d+$/.test(value)) {
      return;
    }

    // Remove leading zeros: 050 becomes 50
    const cleanValue = value.replace(/^0+(?=\d)/, "");

    const numberValue = Number(cleanValue);

    // Do not allow scores above 100
    if (numberValue > 100) {
      return;
    }

    const updatedSkills = {
      ...skills,
      [key]: cleanValue,
    };

    setSkills(updatedSkills);
    setOverallScore(calculateOverallScore(updatedSkills));
    setMessage("");
  };

  // Save scores to Spring Boot
  const handleSaveSkills = async () => {
    if (!user) return;

    setSaving(true);
    setMessage("");

    const payload = {
      email: user.email,
      java: normalizeScore(skills.java),
      python: normalizeScore(skills.python),
      sqlSkill: normalizeScore(skills.sqlSkill),
      dsa: normalizeScore(skills.dsa),
      htmlCss: normalizeScore(skills.htmlCss),
      react: normalizeScore(skills.react),
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/skills",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save skills");
      }

      const data = await response.json();

      const savedSkills = {
        java: String(normalizeScore(data.java)),
        python: String(normalizeScore(data.python)),
        sqlSkill: String(normalizeScore(data.sqlSkill)),
        dsa: String(normalizeScore(data.dsa)),
        htmlCss: String(normalizeScore(data.htmlCss)),
        react: String(normalizeScore(data.react)),
      };

      setSkills(savedSkills);
      setOverallScore(calculateOverallScore(savedSkills));

      setMessage("Skills updated successfully! 🎉");
    } catch (error) {
      console.error("Failed to save skills:", error);

      setMessage(
        "Unable to save skills. Please make sure Spring Boot is running."
      );
    } finally {
      setSaving(false);
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="skills-page">
        <div className="loading-card">
          <div className="loading-spinner">⏳</div>
          <h2>Loading your skills...</h2>
          <p>Please wait while we fetch your skill data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="skills-page">
      {/* Header */}
      <div className="skills-header">
        <button
          className="skills-back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <h1>💻 My Skills</h1>

        <p>
          Track and update your technical skills for better
          placement preparation.
        </p>
      </div>

      {/* Overall Score */}
      <div className="skills-overall-card">
        <div className="overall-icon">🎯</div>

        <div className="overall-content">
          <h2>Overall Skills Score</h2>

          <div className="overall-score">
            {overallScore}%
          </div>

          <p>{getSkillLevel(overallScore)}</p>
        </div>
      </div>

      {/* Skill Cards */}
      <div className="skills-grid">
        {SKILL_DETAILS.map((skill) => {
          const score = normalizeScore(skills[skill.key]);

          return (
            <div className="skill-card" key={skill.key}>
              {/* Skill Name and Score */}
              <div className="skill-card-header">
                <div className="skill-name">
                  <span className="skill-icon">
                    {skill.icon}
                  </span>

                  <h3>{skill.name}</h3>
                </div>

                <div className="skill-score">
                  {score}%
                </div>
              </div>

              {/* Progress Bar */}
              <div className="skill-progress-container">
                <div
                  className={`skill-progress ${getSkillClass(
                    score
                  )}`}
                  style={{
                    width: `${score}%`,
                  }}
                />
              </div>

              {/* Skill Level */}
              <div className="skill-card-footer">
                <span>{getSkillLevel(score)}</span>
                <span>0 - 100</span>
              </div>

              {/* Score Input */}
              <div className="skill-input-group">
                <label htmlFor={`skill-${skill.key}`}>
                  Update Score
                </label>

                <input
                  id={`skill-${skill.key}`}
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={skills[skill.key]}
                  onChange={(event) =>
                    handleSkillChange(
                      skill.key,
                      event.target.value
                    )
                  }
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <button
        className="skills-dashboard-button"
        onClick={handleSaveSkills}
        disabled={saving}
      >
        {saving ? "Saving..." : "💾 Save Skills"}
      </button>

      {/* Success or Error Message */}
      {message && (
        <div className="skills-message" role="status">
          {message}
        </div>
      )}
    </div>
  );
}

export default Skills;