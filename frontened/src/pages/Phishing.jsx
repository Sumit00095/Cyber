import { useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "./Phishing.css";

function Phishing() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeInput = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      setError("Enter a URL or suspicious message.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await axios.post(
        "http://localhost:5000/api/phishing/analyze",
        { input }
      );

      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to analyze. Check whether the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const riskClass = result?.riskLevel
    ? String(result.riskLevel).toLowerCase().replace(/\s+/g, "-")
    : "";

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <Topbar />

        <div className="phishing-content">
          {/* Page Header */}
          <div className="phishing-header">
            <div className="phishing-heading-icon">🛡️</div>

            <div>
              <h1>AI Phishing Detection</h1>
              <p>
                Analyze suspicious URLs and messages for potential
                phishing indicators.
              </p>
            </div>
          </div>

          {/* Input Card */}
          <div className="phishing-card">
            <div className="phishing-card-heading">
              <h2>Analyze Suspicious Content</h2>
              <span className="analysis-tag">Security Analysis</span>
            </div>

            <p className="phishing-description">
              Enter a suspicious URL, email, or message below to
              check for possible phishing activity.
            </p>

            <form onSubmit={analyzeInput}>
              <label htmlFor="phishing-input">
                URL or Message
              </label>

              <textarea
                id="phishing-input"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError("");
                }}
                placeholder="Paste a suspicious URL or message here..."
                rows={6}
              />

              <div className="phishing-input-footer">
                <span>
                  {input.length} characters
                </span>

                <button
                  type="button"
                  className="clear-btn"
                  onClick={() => {
                    setInput("");
                    setResult(null);
                    setError("");
                  }}
                >
                  Clear
                </button>
              </div>

              <button
                type="submit"
                className="analyze-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <span>🔍</span>
                    Analyze for Phishing
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="phishing-error">
                <span>⚠️</span>
                {error}
              </div>
            )}
          </div>

          {/* Analysis Results */}
          {result && (
            <div className="phishing-result-card">
              <div className="result-header">
                <div>
                  <h2>Analysis Results</h2>
                  <p>Security assessment completed</p>
                </div>

                <span className={`risk-badge ${riskClass}`}>
                  {result.riskLevel}
                </span>
              </div>

              <div className="result-stats">
                <div className="result-stat">
                  <span className="stat-label">
                    Detection Method
                  </span>
                  <h3>{result.analysisType || "N/A"}</h3>
                </div>

                <div className="result-stat">
                  <span className="stat-label">
                    Risk Score
                  </span>
                  <h3>{result.riskScore}/100</h3>
                </div>

                <div className="result-stat">
                  <span className="stat-label">
                    Risk Level
                  </span>
                  <h3>{result.riskLevel}</h3>
                </div>
              </div>

              {/* Risk Score Progress */}
              <div className="risk-progress-section">
                <div className="risk-progress-label">
                  <span>Risk Score</span>
                  <span>{result.riskScore}%</span>
                </div>

                <div className="risk-progress-track">
                  <div
                    className={`risk-progress-fill ${riskClass}`}
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, Number(result.riskScore) || 0)
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Indicators */}
              <div className="result-section">
                <h3>🔎 Indicators</h3>

                {result.indicators?.length ? (
                  <ul className="indicator-list">
                    {result.indicators.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-indicators">
                    No suspicious indicators were detected.
                  </p>
                )}
              </div>

              {/* Recommendation */}
              <div className="recommendation-section">
                <h3>💡 Recommendation</h3>
                <p>{result.recommendation}</p>
              </div>

              <div className="result-disclaimer">
                <span>ℹ️</span>
                This is an initial rule-based assessment, not a
                guarantee that a URL or message is safe.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Phishing;