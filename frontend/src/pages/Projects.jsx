import { useEffect, useState } from "react";
import "../App.css";

function Projects() {
  const [projects, setProjects] = useState([]);

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    technologies: "",
    projectLink: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  const getUserEmail = () => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    try {
      const user = JSON.parse(savedUser);
      return user.email || null;
    } catch (error) {
      console.error("Invalid user data:", error);
      return null;
    }
  };

  // ==========================================
  // LOAD PROJECTS
  // ==========================================

  const loadProjects = async () => {
    const email = getUserEmail();

    if (!email) {
      setMessage("Please login first.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/projects/${encodeURIComponent(
          email
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to load projects");
      }

      const data = await response.json();

      console.log("Projects:", data);

      setProjects(data);
    } catch (error) {
      console.error("Load projects error:", error);

      setMessage(
        "Unable to load projects. Please make sure the backend is running."
      );
    }
  };

  // ==========================================
  // LOAD PROJECTS WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    loadProjects();
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ==========================================
  // ADD / UPDATE PROJECT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = getUserEmail();

    if (!email) {
      setMessage("Please login first.");
      return;
    }

    if (!formData.projectName.trim()) {
      setMessage("Please enter a project name.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      let response;

      // ========================================
      // UPDATE
      // ========================================

      if (editingId) {
        response = await fetch(
          `http://localhost:8080/api/projects/${editingId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              projectName: formData.projectName,
              description: formData.description,
              technologies: formData.technologies,
              projectLink: formData.projectLink,
            }),
          }
        );
      }

      // ========================================
      // ADD
      // ========================================

      else {
        response = await fetch(
          "http://localhost:8080/api/projects",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              email: email,
              projectName: formData.projectName,
              description: formData.description,
              technologies: formData.technologies,
              projectLink: formData.projectLink,
            }),
          }
        );
      }

      if (!response.ok) {
        throw new Error(
          "Failed to save project"
        );
      }

      const data = await response.json();

      console.log("Saved project:", data);

      if (editingId) {
        setMessage(
          "Project updated successfully! 🎉"
        );
      } else {
        setMessage(
          "Project added successfully! 🎉"
        );
      }

      // Clear form
      setFormData({
        projectName: "",
        description: "",
        technologies: "",
        projectLink: "",
      });

      setEditingId(null);

      // Reload projects
      loadProjects();
    } catch (error) {
      console.error(
        "Save project error:",
        error
      );

      setMessage(
        "Unable to save project. Please check the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // EDIT PROJECT
  // ==========================================

  const handleEdit = (project) => {
    setEditingId(project.id);

    setFormData({
      projectName:
        project.projectName || "",

      description:
        project.description || "",

      technologies:
        project.technologies || "",

      projectLink:
        project.projectLink || "",
    });

    setMessage("");

    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const handleCancelEdit = () => {
    setEditingId(null);

    setFormData({
      projectName: "",
      description: "",
      technologies: "",
      projectLink: "",
    });

    setMessage("");
  };

  // ==========================================
  // DELETE PROJECT
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/projects/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete project"
        );
      }

      console.log(
        "Project deleted:",
        id
      );

      setMessage(
        "Project deleted successfully! 🗑️"
      );

      loadProjects();
    } catch (error) {
      console.error(
        "Delete project error:",
        error
      );

      setMessage(
        "Unable to delete project."
      );
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="projects-page">

      <div className="projects-container">

        {/* ================================== */}
        {/* HEADER */}
        {/* ================================== */}

        <div className="projects-header">

          <h1>
            My Projects 🚀
          </h1>

          <p>
            Add your projects and showcase
            your technical experience.
          </p>

        </div>

        {/* ================================== */}
        {/* ADD / EDIT PROJECT FORM */}
        {/* ================================== */}

        <div className="project-form-card">

          <h2>
            {editingId
              ? "✏️ Edit Project"
              : "➕ Add New Project"}
          </h2>

          <form onSubmit={handleSubmit}>

            {/* PROJECT NAME */}

            <div className="form-group">

              <label>
                Project Name
              </label>

              <input
                type="text"
                name="projectName"
                placeholder="Example: PlaceMate AI"
                value={formData.projectName}
                onChange={handleChange}
                required
              />

            </div>

            {/* DESCRIPTION */}

            <div className="form-group">

              <label>
                Description
              </label>

              <textarea
                name="description"
                placeholder="Describe your project..."
                rows="4"
                value={formData.description}
                onChange={handleChange}
              />

            </div>

            {/* TECHNOLOGIES */}

            <div className="form-group">

              <label>
                Technologies Used
              </label>

              <input
                type="text"
                name="technologies"
                placeholder="Example: Java, Spring Boot, React, MySQL"
                value={formData.technologies}
                onChange={handleChange}
              />

            </div>

            {/* PROJECT LINK */}

            <div className="form-group">

              <label>
                Project Link
              </label>

              <input
                type="url"
                name="projectLink"
                placeholder="https://github.com/username/project"
                value={formData.projectLink}
                onChange={handleChange}
              />

            </div>

            {/* BUTTONS */}

            <div className="project-form-buttons">

              <button
                type="submit"
                className="project-button"
                disabled={loading}
              >

                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Project ✏️"
                  : "Add Project ➕"}

              </button>

              {editingId && (

                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>

              )}

            </div>

          </form>

        </div>

        {/* ================================== */}
        {/* MESSAGE */}
        {/* ================================== */}

        {message && (

          <div className="upload-message">
            {message}
          </div>

        )}

        {/* ================================== */}
        {/* PROJECT LIST */}
        {/* ================================== */}

        <div className="projects-list-section">

          <h2>
            📂 Your Projects
          </h2>

          {projects.length === 0 ? (

            <div className="no-projects">

              <div className="no-projects-icon">
                📁
              </div>

              <h3>
                No projects added yet
              </h3>

              <p>
                Add your first project using
                the form above.
              </p>

            </div>

          ) : (

            <div className="projects-grid">

              {projects.map(
                (project) => (

                  <div
                    className="project-card"
                    key={project.id}
                  >

                    {/* PROJECT TITLE */}

                    <h3>
                      🚀{" "}
                      {project.projectName}
                    </h3>

                    {/* DESCRIPTION */}

                    {project.description && (

                      <p className="project-description">
                        {project.description}
                      </p>

                    )}

                    {/* TECHNOLOGIES */}

                    {project.technologies && (

                      <div className="project-technologies">

                        <strong>
                          🛠️ Technologies:
                        </strong>

                        <p>
                          {project.technologies}
                        </p>

                      </div>

                    )}

                    {/* LINK */}

                    {project.projectLink && (

                      <a
                        href={
                          project.projectLink
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                      >
                        🔗 View Project
                      </a>

                    )}

                    {/* ACTIONS */}

                    <div className="project-actions">

                      <button
                        className="edit-button"
                        onClick={() =>
                          handleEdit(project)
                        }
                      >
                        ✏️ Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDelete(
                            project.id
                          )
                        }
                      >
                        🗑️ Delete
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Projects;