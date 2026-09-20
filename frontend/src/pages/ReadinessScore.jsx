import { useEffect, useState } from "react";
import "../App.css";

function ReadinessScore() {
  const [skills, setSkills] = useState({
    java: 0,
    python: 0,
    sql: 0,
    dsa: 0,
    htmlCss: 0,
    react: 0,
  });

  const [projectsCount, setProjectsCount] = useState(0);

  useEffect(() => {
    const savedSkills = localStorage.getItem("studentSkills");

    if (savedSkills) {
      setSkills(JSON.parse(savedSkills));
    }

    const savedProjects = localStorage.getItem("studentProjects");

    if (savedProjects) {
      const projects = JSON.parse(savedProjects);
      setProjectsCount(projects.length);
    }
  }, []);

  const skillsScore = Math.round(
    (
      skills.java +
      skills.python +
      skills.sql +
      skills.dsa +
      skills.htmlCss +
      skills.react
    ) / 6
  );

  // Maximum 100 points for projects
  // 1 project = 50%
  // 2 or more projects = 100%
  const projectsScore = Math.min(projectsCount * 50, 100);

  // For now, skills and projects contribute equally
  const readinessScore = Math.round(
    (skillsScore + projectsScore) / 2
  );

  return (
    <div className="readiness-card">

      <h2>Placement Readiness 🎯</h2>

      <div className="score-circle">
        <span>{readinessScore}%</span>
      </div>

      <p className="score-message">
        Your score is based on your skills and projects.
      </p>

      <div className="score-details">

        <div>
          <span>Technical Skills</span>
          <strong>{skillsScore}%</strong>
        </div>

        <div>
          <span>Projects</span>
          <strong>{projectsScore}%</strong>
        </div>

        <div>
          <span>Projects Completed</span>
          <strong>{projectsCount}</strong>
        </div>

      </div>

      <div className="improvement-box">

        <h3>🎯 Areas to Improve</h3>

        <ul>
          {skillsScore < 70 && <li>Improve your technical skills</li>}

          {projectsCount === 0 && (
            <li>Add at least one project</li>
          )}

          {projectsCount === 1 && (
            <li>Try building another project</li>
          )}

          {skills.dsa < 60 && (
            <li>Practice more DSA problems</li>
          )}

          {skills.sql < 60 && (
            <li>Improve your SQL skills</li>
          )}
        </ul>

      </div>

    </div>
  );
}

export default ReadinessScore;