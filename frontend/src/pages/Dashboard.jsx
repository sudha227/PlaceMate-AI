
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const API = "http://localhost:8080/api";

function safeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number)
    ? Math.min(100, Math.max(0, number))
    : 0;
}

function getLevel(score) {
  if (score >= 80) return "Advanced";
  if (score >= 60) return "Intermediate";
  if (score >= 40) return "Developing";
  return "Beginner";
}

function getReadinessMessage(score) {
  if (score >= 80) {
    return "Great progress! Keep practicing and polishing your skills.";
  }
  if (score >= 60) {
    return "You're making progress. Focus on the areas that need improvement.";
  }
  if (score >= 40) {
    return "Keep learning consistently. Every improvement brings you closer.";
  }
  return "Your placement journey starts here. Build your skills step by step.";
}

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState(null);
  const [resumeScore, setResumeScore] = useState(0);
  const [projects, setProjects] = useState([]);
  const [assessmentScore, setAssessmentScore] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [roadmap, setRoadmap] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    let parsedUser;

    try {
      parsedUser = JSON.parse(storedUser);
    } catch {
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }

    if (!parsedUser?.email) {
      navigate("/login");
      return;
    }

    setUser(parsedUser);
    loadDashboard(parsedUser.email);
  }, [navigate]);

  const loadDashboard = async (email) => {
    setLoading(true);
    setError("");

    const encodedEmail = encodeURIComponent(email);

    const getData = async (url) => {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      return response.json();
    };

    try {
      const results = await Promise.allSettled([
        getData(`${API}/skills/${encodedEmail}`),
        getData(`${API}/resume/readiness?email=${encodedEmail}`),
        getData(`${API}/projects/${encodedEmail}`),
        getData(`${API}/recommendations?email=${encodedEmail}`),
        getData(`${API}/roadmap?email=${encodedEmail}`),
      ]);

      // Skills
      if (results[0].status === "fulfilled") {
        const data = results[0].value;
        setSkills(data && typeof data === "object" ? data : null);
      } else {
        setSkills(null);
      }

      // Resume score
      if (results[1].status === "fulfilled") {
        const data = results[1].value;
        setResumeScore(
          safeNumber(
            data.resumeScore ??
            data.resume_score ??
            data.score ??
            0
          )
        );
      } else {
        setResumeScore(0);
      }

      // Projects
      if (results[2].status === "fulfilled") {
        const data = results[2].value;
        const projectList = Array.isArray(data)
          ? data
          : data.projects;

        setProjects(Array.isArray(projectList) ? projectList : []);
      } else {
        setProjects([]);
      }

      // Recommendations
      if (results[3].status === "fulfilled") {
        const data = results[3].value;
        setRecommendations(
          Array.isArray(data)
            ? data
            : Array.isArray(data.recommendations)
            ? data.recommendations
            : []
        );
      } else {
        setRecommendations([]);
      }

      // Roadmap
      if (results[4].status === "fulfilled") {
        const data = results[4].value;
        setRoadmap(
          Array.isArray(data)
            ? data
            : Array.isArray(data.roadmap)
            ? data.roadmap
            : []
        );
      } else {
        setRoadmap([]);
      }

      if (results.every((result) => result.status === "rejected")) {
        setError(
          "Unable to connect to the backend. Please make sure Spring Boot is running."
        );
      }
    } catch (err) {
      console.error("Dashboard loading error:", err);
      setError("Unable to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate skills average
  const skillsScore = useMemo(() => {
    if (!skills) return 0;

    const values = [
      skills.java,
      skills.python,
      skills.sqlSkill,
      skills.dsa,
      skills.htmlCss,
      skills.react,
    ].map(safeNumber);

    return Math.round(
      values.reduce((sum, value) => sum + value, 0) /
        values.length
    );
  }, [skills]);

  // Assessment score is currently stored in localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

const savedScore = user?.email
  ? localStorage.getItem(`assessmentScore_${user.email}`)
  : null;

setAssessmentScore(
  savedScore !== null ? Number(savedScore) : null
);
  }, []);

  // Project contribution to readiness
  const projectScore = useMemo(() => {
    if (projects.length >= 3) return 100;
    if (projects.length === 2) return 75;
    if (projects.length === 1) return 50;
    return 0;
  }, [projects.length]);

  // Overall readiness score
  const readinessScore = Math.round(
    skillsScore * 0.35 +
    resumeScore * 0.25 +
    assessmentScore * 0.20 +
    projectScore * 0.20
  );

  const missingSkills = useMemo(() => {
    if (!skills) return [];

    const skillList = [
      { name: "Java", score: skills.java },
      { name: "Python", score: skills.python },
      { name: "SQL", score: skills.sqlSkill },
      { name: "Data Structures", score: skills.dsa },
      { name: "HTML & CSS", score: skills.htmlCss },
      { name: "React", score: skills.react },
    ];

    return skillList.filter(
      (skill) => safeNumber(skill.score) < 70
    );
  }, [skills]);

  const firstName =
    user?.full_name?.trim()?.split(" ")[0] ||
    user?.name?.trim()?.split(" ")[0] ||
    "Student";

  const navigationCards = [
    {
      title: "Technical Skills",
      value: `${skillsScore}%`,
      description: "Track your technical skills and improve your knowledge.",
      icon: "💻",
      color: "blue",
      path: "/skills",
      progress: skillsScore,
    },
    {
      title: "Resume Strength",
      value: `${resumeScore}%`,
      description: "Analyze your resume and identify missing skills.",
      icon: "📄",
      color: "purple",
      path: "/resume",
      progress: resumeScore,
    },
    {
      title: "Projects",
      value: projects.length,
      description: "Showcase your projects and practical experience.",
      icon: "🚀",
      color: "green",
      path: "/projects",
      progress: projectScore,
    },
    {
      title: "Assessment",
      value: `${assessmentScore}%`,
      description: "Test your technical knowledge and track your score.",
      icon: "📝",
      color: "orange",
      path: "/assessment",
      progress: assessmentScore,
    },
  ];

  const handleRefresh = () => {
    if (user?.email) {
      loadDashboard(user.email);
      setAssessmentScore(
        safeNumber(localStorage.getItem("assessmentScore") ?? 0)
      );
    }
  };

  return (
    <div className="dashboard-page">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <div className="dashboard-brand-icon">🚀</div>

          <div>
            <h2>PlaceMate AI</h2>
            <span>Placement Preparation Platform</span>
          </div>
        </div>

        <div className="dashboard-header-actions">
          <div className="dashboard-user-info">
            <strong>👤 {firstName}</strong>
            <span>✉️ {user?.email || ""}</span>
            <span>
              🎓 {user?.branch || "Student"}{" "}
              {user?.graduation_year
                ? `· ${user.graduation_year}`
                : ""}
            </span>
          </div>

          <button
            type="button"
            className="dashboard-logout-button"
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-container">
        {/* Welcome */}
        <section className="dashboard-welcome">
          <span className="dashboard-eyebrow">
            YOUR PLACEMENT JOURNEY
          </span>

          <h1>Welcome, {firstName}! 👋</h1>

          <p>
            Track your preparation, identify skill gaps, and
            become placement ready.
          </p>
        </section>

        {error && (
          <div className="dashboard-error" role="alert">
            ⚠️ {error}
            <button type="button" onClick={handleRefresh}>
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="dashboard-loading">
            <div className="dashboard-spinner" />
            <p>Loading your placement dashboard...</p>
          </div>
        ) : (
          <>
            {/* Main readiness card */}
            <section className="dashboard-readiness-card">
              <div className="dashboard-readiness-icon">🎯</div>

              <div className="dashboard-readiness-content">
                <span className="dashboard-card-eyebrow">
                  OVERALL PLACEMENT READINESS
                </span>

                <h2>{readinessScore}%</h2>

                <p>{getReadinessMessage(readinessScore)}</p>

                <div className="dashboard-readiness-progress">
                  <div
                    style={{ width: `${readinessScore}%` }}
                  />
                </div>
              </div>

              <div
                className="dashboard-readiness-ring"
                style={{
                  "--readiness-value": `${readinessScore}%`,
                }}
              >
                <div>
                  <strong>{readinessScore}%</strong>
                  <span>Readiness</span>
                </div>
              </div>
            </section>

            {/* Stats */}
            <section className="dashboard-stats-grid">
              {navigationCards.map((card) => (
                <button
                  type="button"
                  className={`dashboard-stat-card dashboard-${card.color}`}
                  key={card.title}
                  onClick={() => navigate(card.path)}
                >
                  <div className="dashboard-stat-top">
                    <div className="dashboard-stat-icon">
                      {card.icon}
                    </div>
                    <span className="dashboard-stat-arrow">→</span>
                  </div>

                  <h3>{card.title}</h3>

                  <strong className="dashboard-stat-value">
                    {card.value}
                  </strong>

                  {card.title !== "Projects" && (
                    <div className="dashboard-stat-progress">
                      <div
                        style={{ width: `${card.progress}%` }}
                      />
                    </div>
                  )}

                  {card.title === "Projects" && (
                    <span className="dashboard-project-label">
                      {projects.length === 0
                        ? "Add your first project"
                        : projects.length === 1
                        ? "Good start!"
                        : `${projects.length} projects added`}
                    </span>
                  )}

                  <p>{card.description}</p>
                </button>
              ))}
            </section>

            {/* Two-column content */}
            <section className="dashboard-content-grid">
              {/* Missing skills */}
              <div className="dashboard-panel">
                <div className="dashboard-panel-heading">
                  <div>
                    <span className="dashboard-panel-icon">🧩</span>
                    <h2>Skills to Improve</h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("/skills")}
                  >
                    Update skills →
                  </button>
                </div>

                {missingSkills.length === 0 ? (
                  <div className="dashboard-empty">
                    <span>🎉</span>
                    <p>
                      {skills
                        ? "All listed skills are at 70% or above!"
                        : "Add your skill scores to see your skill gaps."}
                    </p>
                  </div>
                ) : (
                  <div className="dashboard-missing-list">
                    {missingSkills.map((skill) => (
                      <div
                        className="dashboard-missing-item"
                        key={skill.name}
                      >
                        <div>
                          <strong>{skill.name}</strong>
                          <span>
                            {safeNumber(skill.score)}% proficiency
                          </span>
                        </div>

                        <div className="dashboard-mini-progress">
                          <div
                            style={{
                              width: `${safeNumber(skill.score)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recommendations */}
              <div className="dashboard-panel">
                <div className="dashboard-panel-heading">
                  <div>
                    <span className="dashboard-panel-icon">💡</span>
                    <h2>AI Recommendations</h2>
                  </div>
                </div>

                {recommendations.length === 0 ? (
                  <div className="dashboard-empty">
                    <span>✨</span>
                    <p>
                      No recommendations available yet. Update
                      your skills to get personalized practice tips.
                    </p>
                  </div>
                ) : (
                  <div className="dashboard-recommendations-list">
                    {recommendations.slice(0, 4).map((item, index) => (
                      <div
                        className="dashboard-recommendation-item"
                        key={`${item.skill || "skill"}-${index}`}
                      >
                        <span className="dashboard-recommendation-dot">
                          {index + 1}
                        </span>

                        <div>
                          <strong>
                            {item.skill || "Practice suggestion"}
                          </strong>
                          <p>
                            {item.recommendation ||
                              item.message ||
                              "Keep practicing this skill."}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Roadmap */}
            <section className="dashboard-panel dashboard-roadmap-panel">
              <div className="dashboard-panel-heading">
                <div>
                  <span className="dashboard-panel-icon">🗺️</span>
                  <h2>Your Personalized Roadmap</h2>
                </div>
              </div>

              {roadmap.length === 0 ? (
                <div className="dashboard-empty">
                  <span>📌</span>
                  <p>
                    Your roadmap will appear here when skill gaps
                    are available.
                  </p>
                </div>
              ) : (
                <div className="dashboard-roadmap-list">
                  {roadmap.slice(0, 6).map((item, index) => (
                    <div
                      className="dashboard-roadmap-item"
                      key={`${item.skill || "step"}-${index}`}
                    >
                      <div className="dashboard-roadmap-number">
                        {index + 1}
                      </div>

                      <div className="dashboard-roadmap-body">
                        <div className="dashboard-roadmap-top">
                          <h3>{item.skill || `Step ${index + 1}`}</h3>
                          <span>
                            ⏱ {item.duration || "Practice regularly"}
                          </span>
                        </div>

                        <p>
                          {item.task ||
                            item.recommendation ||
                            "Practice this skill and track your progress."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Quick actions */}
            <section className="dashboard-quick-actions">
              <div>
                <span className="dashboard-eyebrow">
                  KEEP MOVING FORWARD
                </span>
                <h2>Ready for your next step?</h2>
                <p>
                  Keep your profile updated and continue practicing.
                </p>
              </div>

              <div className="dashboard-quick-buttons">
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                >
                  👤 My Profile
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/assessment")}
                >
                  📝 Take Assessment
                </button>

                <button
                  type="button"
                  onClick={handleRefresh}
                >
                  ↻ Refresh Dashboard
                </button>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="dashboard-footer">
        <p>© {new Date().getFullYear()} PlaceMate AI · Keep learning, keep growing 🚀</p>
      </footer>
    </div>
  );
}

export default Dashboard;