
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Assessment() {
  const navigate = useNavigate();

  const questions = [
    {
      question: "Which keyword is used to create a class in Java?",
      options: ["function", "class", "struct", "object"],
      answer: "class",
    },
    {
      question: "Which data structure follows LIFO?",
      options: ["Queue", "Array", "Stack", "Linked List"],
      answer: "Stack",
    },
    {
      question: "Which SQL command is used to retrieve data?",
      options: ["INSERT", "UPDATE", "SELECT", "DELETE"],
      answer: "SELECT",
    },
    {
      question: "Which HTML tag is used to create a hyperlink?",
      options: ["<link>", "<a>", "<href>", "<url>"],
      answer: "<a>",
    },
    {
      question: "Which React hook is used to manage state?",
      options: ["useEffect", "useState", "useContext", "useRef"],
      answer: "useState",
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [completed, setCompleted] = useState(false);

  // Select an answer
  const handleAnswer = (option) => {
    setSelectedAnswer(option);
    setMessage("");
  };

  // Move to next question or finish assessment
  const handleNext = async () => {
    if (!selectedAnswer) {
      setMessage("Please select an answer before continuing.");
      return;
    }

    const current = questions[currentQuestion];

    const newScore =
      (score || 0) +
      (selectedAnswer === current.answer ? 20 : 0);

    // Move to the next question
    if (currentQuestion < questions.length - 1) {
      setScore(newScore);
      setSelectedAnswer("");
      setCurrentQuestion((previous) => previous + 1);
      setMessage("");
      return;
    }

    // Finish assessment
    setScore(newScore);
    setLoading(true);
    setMessage("");

    try {
      const savedUser = localStorage.getItem("user");

      if (!savedUser) {
        navigate("/login");
        return;
      }

      const user = JSON.parse(savedUser);

      if (!user?.email) {
        setMessage("User email not found. Please log in again.");
        return;
      }

      const response = await fetch(
        "http://localhost:8080/api/assessment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            score: newScore,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save assessment score.");
      }

      const data = await response.json();

      if (data.status === "success") {
        // Save the latest score for this logged-in user
        localStorage.setItem(
          `assessmentScore_${user.email}`,
          newScore.toString()
        );

        // Keep old key temporarily for compatibility
        localStorage.setItem(
          "assessmentScore",
          newScore.toString()
        );

        setCompleted(true);
        setMessage("Assessment completed successfully! 🎉");
      } else {
        setMessage("Failed to save assessment score. Please try again.");
      }
    } catch (error) {
      console.error("Assessment save error:", error);

      setMessage(
        "Unable to save your assessment. Please check your backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assessment-page">
      <div className="assessment-card">
        <h1>Placement Assessment</h1>

        {!completed ? (
          <>
            {/* Progress */}
            <p className="assessment-progress">
              Question {currentQuestion + 1} of {questions.length}
            </p>

            {/* Question */}
            <h2>{questions[currentQuestion].question}</h2>

            {/* Options */}
            <div className="assessment-options">
              {questions[currentQuestion].options.map(
                (option, index) => (
                  <button
                    key={index}
                    type="button"
                    className={
                      selectedAnswer === option
                        ? "selected-option"
                        : ""
                    }
                    onClick={() => handleAnswer(option)}
                    disabled={loading}
                  >
                    {option}
                  </button>
                )
              )}
            </div>

            {/* Next / Finish Button */}
            <button
              className="assessment-next-btn"
              onClick={handleNext}
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : currentQuestion === questions.length - 1
                ? "Finish Assessment"
                : "Next"}
            </button>

            {/* Validation / Error Message */}
            {message && (
              <div
                className="assessment-feedback"
                role="status"
              >
                {message}
              </div>
            )}
          </>
        ) : (
          /* Assessment Result */
          <div className="assessment-result">
            <div className="assessment-success-icon">
              🎉
            </div>

            <h2>Assessment Completed!</h2>

            <div className="assessment-score">
              {score}%
            </div>

            <div className="assessment-success-message">
              <span>✓</span>
              {message}
            </div>

            <p>
              Your assessment score has been saved successfully.
            </p>

            <button
              className="assessment-next-btn"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Assessment;