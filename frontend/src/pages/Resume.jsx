import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Resume() {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    setMessage("");
    setResult(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.type !== "application/pdf") {
      setSelectedFile(null);
      setMessage("Please select a PDF file only.");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please choose your resume first.");
      return;
    }

    if (!user || !user.email) {
      setMessage("Please login again.");
      navigate("/login");
      return;
    }

    setLoading(true);
    setMessage("");
    setResult(null);

    const formData = new FormData();

    formData.append("file", selectedFile);
    formData.append("email", user.email);

    try {
      const response = await fetch(
        "http://localhost:8080/api/resume/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Resume upload failed."
        );
      }

      setResult(data);

      setMessage(
        data.message ||
          "Resume analyzed successfully!"
      );

    } catch (error) {
      console.error("Resume upload error:", error);

      setMessage(
        error.message ||
          "Unable to analyze resume."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChooseResume = () => {
    document.getElementById("resumeInput").click();
  };

  return (
    <div className="resume-page">

      {/* HEADER */}

      <header className="resume-header">

        <div className="resume-brand">

          <div className="resume-brand-icon">
            🚀
          </div>

          <div>
            <h2>PlaceMate AI</h2>
            <span>Placement Preparation Platform</span>
          </div>

        </div>

        <button
          className="resume-back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>

      </header>

      {/* MAIN */}

      <main className="resume-container">

        {/* TITLE */}

        <section className="resume-title-section">

          <span className="resume-eyebrow">
            AI POWERED RESUME ANALYSIS
          </span>

          <h1>
            Resume Analyzer 📄
          </h1>

          <p>
            Upload your resume and let PlaceMate AI
            analyze your skills for placement preparation.
          </p>

        </section>

        {/* UPLOAD CARD */}

        <section className="resume-upload-card">

          <div className="resume-upload-icon">
            📄
          </div>

          <h2>
            Upload Your Resume
          </h2>

          <p>
            Upload your latest resume in PDF format
            to analyze your skills and identify gaps.
          </p>

          {/* FILE AREA */}

          <div
            className="resume-drop-area"
            onClick={handleChooseResume}
          >

            <div className="upload-cloud">
              ☁️
            </div>

            <h3>
              {selectedFile
                ? selectedFile.name
                : "Choose your resume"}
            </h3>

            <span>
              {selectedFile
                ? `${(
                    selectedFile.size / 1024
                  ).toFixed(1)} KB`
                : "PDF files only"}
            </span>

            <input
              id="resumeInput"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              hidden
            />

            <button
              type="button"
              className="choose-file-button"
              onClick={(event) => {
                event.stopPropagation();
                handleChooseResume();
              }}
            >
              Choose PDF
            </button>

          </div>

          {/* MESSAGE */}

          {message && (
            <div
              className={`resume-message ${
                result
                  ? "resume-success"
                  : "resume-error"
              }`}
            >
              {result ? "✅" : "⚠️"} {message}
            </div>
          )}

          {/* ANALYZE BUTTON */}

          <button
            className="analyze-resume-button"
            onClick={handleUpload}
            disabled={!selectedFile || loading}
          >
            {loading
              ? "Analyzing Resume..."
              : "🚀 Upload & Analyze Resume"}
          </button>

        </section>

        {/* RESULT */}

        {result && (
          <section className="resume-result-card">

            <div className="resume-result-header">

              <div>
                <span className="resume-eyebrow">
                  ANALYSIS COMPLETE
                </span>

                <h2>
                  Resume Analysis Result
                </h2>
              </div>

              <div className="resume-score-circle">
                <span>
                  {result.resume_score ?? 0}%
                </span>
              </div>

            </div>

            {/* SCORE */}

            <div className="resume-score-section">

              <div className="resume-score-title">
                <span>
                  Resume Score
                </span>

                <strong>
                  {result.resume_score ?? 0}%
                </strong>
              </div>

              <div className="resume-progress">
                <div
                  style={{
                    width: `${result.resume_score ?? 0}%`,
                  }}
                />
              </div>

            </div>

            {/* DETECTED SKILLS */}

            {result.detected_skills &&
              result.detected_skills.length > 0 && (

                <div className="resume-result-section">

                  <h3>
                    ✅ Detected Skills
                  </h3>

                  <div className="resume-skills-list">

                    {result.detected_skills.map(
                      (skill, index) => (
                        <span
                          className="resume-skill-tag"
                          key={index}
                        >
                          {skill}
                        </span>
                      )
                    )}

                  </div>

                </div>
              )}

            {/* MISSING SKILLS */}

            <div className="resume-result-section">

              <h3>
                ⚠️ Skills to Improve
              </h3>

              {result.missing_skills &&
              result.missing_skills.length > 0 ? (

                <div className="resume-missing-list">

                  {result.missing_skills.map(
                    (skill, index) => (
                      <span
                        className="resume-missing-tag"
                        key={index}
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>

              ) : (

                <div className="resume-no-gaps">
                  🎉 No major skill gaps detected!
                </div>

              )}

            </div>

            {/* DASHBOARD BUTTON */}

            <button
              className="resume-dashboard-button"
              onClick={() => navigate("/dashboard")}
            >
              View Updated Dashboard →
            </button>

          </section>
        )}

        {/* INFO CARDS */}

        <section className="resume-info-grid">

          <div className="resume-info-card">

            <div className="resume-info-icon">
              🔍
            </div>

            <h3>
              Skill Detection
            </h3>

            <p>
              PlaceMate AI scans your resume and
              identifies technical skills mentioned
              in your document.
            </p>

          </div>

          <div className="resume-info-card">

            <div className="resume-info-icon">
              📊
            </div>

            <h3>
              Resume Score
            </h3>

            <p>
              Get a score based on the important
              placement-related skills detected
              in your resume.
            </p>

          </div>

          <div className="resume-info-card">

            <div className="resume-info-icon">
              🎯
            </div>

            <h3>
              Skill Gaps
            </h3>

            <p>
              Identify skills that you can improve
              to strengthen your placement preparation.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Resume;