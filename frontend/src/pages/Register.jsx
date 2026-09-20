
import { useState } from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    branch: "",
    graduation_year: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;

    setPassword(value);

    setFormData({
      ...formData,
      password: value
    });

    if (value.length === 0) {
      setPasswordError("");
      return;
    }

    if (value.length < 8) {
      setPasswordError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (!/[A-Z]/.test(value)) {
      setPasswordError(
        "Password must contain at least one uppercase letter."
      );
      return;
    }

    if (!/[0-9]/.test(value)) {
      setPasswordError(
        "Password must contain at least one number."
      );
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      setPasswordError(
        "Password must contain at least one special character."
      );
      return;
    }

    setPasswordError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");

    if (passwordError || password.length === 0) {
      setMessage("Please enter a valid password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/students",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );
const data = await response.text();

if (response.ok) {

  setMessage("Account created successfully! 🎉");

  setTimeout(() => {
    navigate("/login");
  }, 1000);

} else {

  setMessage(
    data || "Registration failed."
  );

}

    } catch (error) {

      console.error("Registration error:", error);

      setMessage(
       "Unable to connect to the backend. Please make sure Spring Boot is running."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>Create Account 🎓</h1>

        <p className="auth-subtitle">
          Start your placement preparation journey
        </p>

        <form onSubmit={handleRegister}>

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
              required
            />
          </div>


          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={password}
              onChange={handlePasswordChange}
              required
            />

            {passwordError && (
              <p className="password-error">
                ⚠️ {passwordError}
              </p>
            )}

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


          <button
            className="auth-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

          {message && (
            <p className="upload-message">
              {message}
            </p>
          )}

        </form>


        <p className="auth-footer">
          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;

