import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Profile() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    branch: "",
    graduation_year: "",
    technical_skills: "",
    projects: "",
    target_job_role: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Load logged-in student
  useEffect(() => {

    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(savedUser);

    setFormData({
      full_name: user.full_name || "",
      email: user.email || "",
      branch: user.branch || "",
      graduation_year: user.graduation_year || "",
      technical_skills: user.technical_skills || "",
      projects: user.projects || "",
      target_job_role: user.target_job_role || ""
    });

  }, [navigate]);


  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {

      const response = await fetch(
        `http://localhost:8080/api/students/profile/${encodeURIComponent(formData.email)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (data.status === "success") {

        // Update localStorage
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setMessage("Profile saved successfully! 🎉");

      } else {

        setMessage(
          data.message || "Failed to save profile."
        );

      }

    } catch (error) {

      console.error("Profile error:", error);

      setMessage(
        "Unable to connect to the backend."
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="profile-page">

      <div className="profile-card">

        <h1>My Profile 👤</h1>

        <p className="profile-subtitle">
          Tell us about yourself to personalize your placement journey.
        </p>


        <form onSubmit={handleSubmit}>


          <div className="form-group">

            <label>Full Name</label>

            <input
              type="text"
              name="full_name"
              placeholder="Enter your full name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />

          </div>


          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              disabled
            />

          </div>


          <div className="form-group">

            <label>Branch</label>

            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
            >

              <option value="">
                Select your branch
              </option>

              <option value="cse">
                Computer Science Engineering
              </option>

              <option value="it">
                Information Technology
              </option>

              <option value="ece">
                Electronics & Communication
              </option>

              <option value="eee">
                Electrical & Electronics
              </option>

              <option value="mech">
                Mechanical Engineering
              </option>

              <option value="civil">
                Civil Engineering
              </option>

            </select>

          </div>


          <div className="form-group">

            <label>Graduation Year</label>

            <select
              name="graduation_year"
              value={formData.graduation_year}
              onChange={handleChange}
              required
            >

              <option value="">
                Select graduation year
              </option>

              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
              <option value="2029">2029</option>

            </select>

          </div>


          <div className="form-group">

            <label>Technical Skills</label>

            <textarea
              name="technical_skills"
              placeholder="Example: Java, Python, SQL, HTML, CSS, React"
              rows="4"
              value={formData.technical_skills}
              onChange={handleChange}
            ></textarea>

          </div>


          <div className="form-group">

            <label>Projects</label>

            <textarea
              name="projects"
              placeholder="Tell us about your projects"
              rows="4"
              value={formData.projects}
              onChange={handleChange}
            ></textarea>

          </div>


          <div className="form-group">

            <label>Target Job Role</label>

            <select
              name="target_job_role"
              value={formData.target_job_role}
              onChange={handleChange}
            >

              <option value="">
                Select your target role
              </option>

              <option value="software-developer">
                Software Developer
              </option>

              <option value="frontend-developer">
                Frontend Developer
              </option>

              <option value="backend-developer">
                Backend Developer
              </option>

              <option value="fullstack-developer">
                Full Stack Developer
              </option>

              <option value="data-analyst">
                Data Analyst
              </option>

              <option value="ai-ml">
                AI / ML Engineer
              </option>

            </select>

          </div>


          <button
            className="profile-button"
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Saving..."
              : "Save Profile 💾"}

          </button>


          {message && (

            <p className="upload-message">
              {message}
            </p>

          )}

        </form>

      </div>

    </div>

  );

}

export default Profile;