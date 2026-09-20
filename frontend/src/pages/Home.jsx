
import { Link } from "react-router-dom";
import "../App.css";

function Home() {
  return (
    <div>

      {/* Navigation */}
      <nav>
        <h2>🚀 PlaceMate AI</h2>

        <div>
          <Link to="/login">
            <button>Login</button>
          </Link>

          <Link to="/register">
            <button>Sign Up</button>
          </Link>
        </div>
      </nav>


      <main>

        {/* Hero Section */}
        <section className="hero">

          <p className="hero-label">
            AI-POWERED PLACEMENT PLATFORM
          </p>

          <h1>
            Prepare Smarter.
            <br />
            <span>Get Placed. 🎯</span>
          </h1>

          <p className="hero-description">
            Analyze your skills, identify your weaknesses,
            and get a personalized roadmap to become
            placement ready.
          </p>

          <Link to="/register">
            <button>
              Get Started 🚀
            </button>
          </Link>

        </section>


        {/* Features */}
        <section className="features">

          <p className="hero-label">
            EVERYTHING YOU NEED
          </p>

          <h2>
            Why PlaceMate AI?
          </h2>

          <div className="feature-grid">

            <div className="feature-card">
              <h3>🎯 Readiness Score</h3>
              <p>
                Know exactly how prepared you are
                for your placement journey.
              </p>
            </div>


            <div className="feature-card">
              <h3>📄 Resume Analysis</h3>
              <p>
                Analyze your resume and discover
                its strengths and weaknesses.
              </p>
            </div>


            <div className="feature-card">
              <h3>🤖 AI Recommendations</h3>
              <p>
                Get personalized recommendations
                based on your missing skills.
              </p>
            </div>


            <div className="feature-card">
              <h3>📚 Personalized Roadmap</h3>
              <p>
                Follow a structured preparation plan
                designed around your skill gaps.
              </p>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Home;

