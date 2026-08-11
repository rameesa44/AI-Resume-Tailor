import { useState } from "react";

const API_URL = "http://127.0.0.1:8000/api";

export default function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [analysis, setAnalysis] = useState(null);
  const [rewrittenBullets, setRewrittenBullets] = useState([]);
  const [coverLetter, setCoverLetter] = useState("");

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("analysis");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF resume.");
      return;
    }

    setResumeFile(file);
    setError("");
    setAnalysis(null);
    setRewrittenBullets([]);
    setCoverLetter("");
  };

  const uploadResume = async () => {
    if (!resumeFile) {
      throw new Error("Please upload your resume first.");
    }

    const formData = new FormData();
    formData.append("file", resumeFile);

    const response = await fetch(`${API_URL}/resume/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload resume.");
    }

    const data = await response.json();

    return data.text;
  };

  const analyzeResume = async () => {
    setError("");

    if (!resumeFile) {
      setError("Please upload your resume.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please enter the job description.");
      return;
    }

    try {
      setLoading(true);

      let extractedResume = resumeText;

      if (!extractedResume) {
        extractedResume = await uploadResume();
        setResumeText(extractedResume);
      }

      const response = await fetch(`${API_URL}/resume/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume_text: extractedResume,
          job_description: jobDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Resume analysis failed.");
      }

      const data = await response.json();

      setAnalysis(data);
      setActiveTab("analysis");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const rewriteBullets = async () => {
    setError("");

    if (!resumeText || !jobDescription) {
      setError("Analyze your resume first.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/resume/rewrite-bullets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume_text: resumeText,
          job_description: jobDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Bullet rewriting failed.");
      }

      const data = await response.json();

      setRewrittenBullets(data.rewritten_bullets || []);
      setActiveTab("rewrite");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const generateCoverLetter = async () => {
    setError("");

    if (!resumeText || !jobDescription) {
      setError("Analyze your resume first.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/cover-letter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume_text: resumeText,
          job_description: jobDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Cover letter generation failed.");
      }

      const data = await response.json();

      setCoverLetter(data.cover_letter || "");
      setActiveTab("cover");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const score = analysis?.ats_score || 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'DM Sans', sans-serif;
          background:
            radial-gradient(circle at 10% 10%, rgba(139, 92, 246, 0.18), transparent 30%),
            radial-gradient(circle at 90% 20%, rgba(236, 72, 153, 0.14), transparent 28%),
            #080812;
          color: #f8f7ff;
          min-height: 100vh;
        }

        button,
        input,
        textarea {
          font-family: inherit;
        }

        .app {
          min-height: 100vh;
          padding: 28px;
        }

        .shell {
          max-width: 1380px;
          margin: auto;
        }

       .navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: -36px;
}

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-icon {
          width: 42px;
          height: 42px;
          border-radius: 13px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          box-shadow: 0 10px 35px rgba(139, 92, 246, 0.35);
          font-size: 20px;
        }

        .brand-name {
          font-family: 'Manrope', sans-serif;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -0.4px;
        }

        .brand-name span {
          color: #b79aff;
        }

        .status {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #aaa8bd;
          font-size: 13px;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #55e6a5;
          box-shadow: 0 0 12px rgba(85, 230, 165, 0.8);
        }

        .hero {
          text-align: center;
          max-width: 820px;
          margin: 0 auto 45px;
        }

        .eyebrow {
          display: inline-flex;
          padding: 8px 14px;
          border: 1px solid rgba(167, 139, 250, 0.25);
          background: rgba(139, 92, 246, 0.08);
          color: #c8b7ff;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 18px;
          letter-spacing: 0.3px;
        }

        .hero h1 {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(38px, 5vw, 66px);
          line-height: 1.03;
          letter-spacing: -3px;
          margin-bottom: 18px;
        }

        .gradient-text {
          background: linear-gradient(100deg, #c4b5fd, #f0abfc, #f9a8d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero p {
          color: #aaa8bd;
          font-size: 16px;
          line-height: 1.7;
          max-width: 650px;
          margin: auto;
        }

        .workspace {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 20px;
          align-items: start;
        }

        .card {
          background: rgba(18, 17, 31, 0.78);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 24px;
          box-shadow:
            0 25px 80px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(20px);
        }

        .card-title {
          font-family: 'Manrope', sans-serif;
          font-size: 17px;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .card-subtitle {
          color: #8f8da1;
          font-size: 13px;
          margin-bottom: 20px;
        }

       .upload-box {
  width: 100%;
  min-height: 190px;
  border: 1px dashed rgba(196, 181, 253, 0.32);
  border-radius: 18px;
  padding: 28px 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: rgba(139, 92, 246, 0.045);
  cursor: pointer;
  transition: all 0.25s ease;
  overflow: hidden;
}

        .upload-box:hover {
          border-color: rgba(236, 72, 153, 0.65);
          background: rgba(236, 72, 153, 0.06);
          transform: translateY(-2px);
        }

        .upload-icon {
          width: 52px;
          height: 52px;
          margin: 0 auto 14px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          background: linear-gradient(
            135deg,
            rgba(139, 92, 246, 0.18),
            rgba(236, 72, 153, 0.16)
          );
          font-size: 23px;
        }

        .upload-box strong {
          display: block;
          margin-bottom: 6px;
          font-size: 14px;
        }

        .upload-box span {
          color: #777589;
          font-size: 12px;
        }

        .file-name {
          margin-top: 14px;
          padding: 10px 12px;
          border-radius: 10px;
          background: rgba(255,255,255,0.045);
          color: #cfc9df;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .textarea-wrap {
          margin-top: 20px;
        }

        .label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #cbc7d7;
          margin-bottom: 9px;
        }

        textarea {
          width: 100%;
          min-height: 210px;
          resize: vertical;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 15px;
          background: rgba(0,0,0,0.2);
          color: #eeeaf7;
          outline: none;
          padding: 15px;
          font-size: 13px;
          line-height: 1.65;
          transition: 0.2s;
        }

        textarea:focus {
          border-color: rgba(167, 139, 250, 0.55);
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.08);
        }

        .primary-btn {
          width: 100%;
          margin-top: 18px;
          border: 0;
          border-radius: 14px;
          padding: 14px 18px;
          background: linear-gradient(100deg, #7c3aed, #db2777);
          color: white;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 12px 30px rgba(124, 58, 237, 0.24);
          transition: 0.25s;
        }

        .primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 36px rgba(219, 39, 119, 0.25);
        }

        .primary-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          transform: none;
        }

        .error {
          margin-top: 14px;
          padding: 11px 13px;
          border-radius: 12px;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.18);
          color: #fca5a5;
          font-size: 12px;
        }

        .result-card {
          min-height: 100%;
        }

        .score-section {
          display: flex;
          align-items: center;
          gap: 22px;
          padding: 20px;
          border-radius: 19px;
          background:
            linear-gradient(
              135deg,
              rgba(124, 58, 237, 0.12),
              rgba(219, 39, 119, 0.07)
            );
          border: 1px solid rgba(167, 139, 250, 0.1);
          margin-bottom: 22px;
        }

        .score {
          width: 104px;
          height: 104px;
          flex: 0 0 104px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background:
            radial-gradient(circle at center, #12111f 57%, transparent 58%),
            conic-gradient(#a78bfa ${score}%, rgba(255,255,255,0.06) 0);
        }

        .score-inner {
          text-align: center;
        }

        .score-number {
          font-family: 'Manrope', sans-serif;
          font-size: 27px;
          font-weight: 800;
        }

        .score-label {
          color: #8e8a9e;
          font-size: 10px;
        }

        .score-info h3 {
          font-family: 'Manrope', sans-serif;
          margin-bottom: 6px;
        }

        .score-info p {
          color: #9290a1;
          font-size: 12px;
          line-height: 1.6;
        }

        .tabs {
          display: flex;
          gap: 7px;
          padding: 5px;
          border-radius: 14px;
          background: rgba(0,0,0,0.18);
          margin-bottom: 20px;
        }

        .tab {
          flex: 1;
          border: 0;
          background: transparent;
          color: #858293;
          border-radius: 10px;
          padding: 10px 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .tab.active {
          background: rgba(167, 139, 250, 0.13);
          color: #ddd6fe;
        }

        .section-heading {
          font-family: 'Manrope', sans-serif;
          font-size: 14px;
          margin-bottom: 12px;
        }

        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 22px;
        }

        .chip {
          padding: 7px 10px;
          border-radius: 999px;
          background: rgba(167, 139, 250, 0.1);
          color: #c9bdf8;
          border: 1px solid rgba(167, 139, 250, 0.13);
          font-size: 11px;
        }

        .chip.missing {
          background: rgba(244, 114, 182, 0.08);
          color: #f9a8d4;
          border-color: rgba(244, 114, 182, 0.14);
        }

        .suggestion {
          padding: 13px 14px;
          border-radius: 13px;
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.055);
          color: #b7b3c3;
          font-size: 12px;
          line-height: 1.55;
          margin-bottom: 9px;
        }

        .explanation {
          padding: 15px;
          border-radius: 14px;
          background: rgba(139, 92, 246, 0.06);
          color: #aaa6b7;
          font-size: 12px;
          line-height: 1.7;
        }

        .action-row {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .secondary-btn {
          flex: 1;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.035);
          color: #d8d3e2;
          border-radius: 12px;
          padding: 11px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }

        .secondary-btn:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(167,139,250,0.25);
        }

        .bullet {
          padding: 15px;
          border-radius: 14px;
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.06);
          color: #c5c0cf;
          font-size: 13px;
          line-height: 1.65;
          margin-bottom: 10px;
        }

        .cover-letter {
          white-space: pre-wrap;
          padding: 20px;
          border-radius: 15px;
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.06);
          color: #c5c0cf;
          font-size: 13px;
          line-height: 1.8;
          max-height: 550px;
          overflow-y: auto;
        }

        .empty-state {
          min-height: 450px;
          display: grid;
          place-items: center;
          text-align: center;
          color: #777486;
        }

        .empty-icon {
          font-size: 40px;
          margin-bottom: 14px;
        }

        .empty-state h3 {
          color: #d2cedd;
          font-family: 'Manrope', sans-serif;
          margin-bottom: 8px;
        }

        .empty-state p {
          font-size: 12px;
          line-height: 1.6;
          max-width: 330px;
        }

        .footer {
          text-align: center;
          color: #666376;
          font-size: 11px;
          margin-top: 35px;
          padding-bottom: 15px;
        }

        @media (max-width: 900px) {
          .workspace {
            grid-template-columns: 1fr;
          }

          .hero h1 {
            letter-spacing: -2px;
          }
        }

        @media (max-width: 600px) {
          .app {
            padding: 18px;
          }

          .navbar {
            margin-bottom: 35px;
          }

          .status {
            display: none;
          }

          .card {
            padding: 18px;
            border-radius: 19px;
          }

          .score-section {
            flex-direction: column;
            text-align: center;
          }

          .tabs {
            overflow-x: auto;
          }

          .tab {
            min-width: 100px;
          }
        }
      `}</style>

      <div className="app">
        <div className="shell">

          <nav className="navbar">
            <div className="brand">
              <div className="brand-icon">✦</div>

              <div className="brand-name">
                Resume<span>AI</span>
              </div>
            </div>

            <div className="status">
              <span className="status-dot"></span>
              AI engine online
            </div>
          </nav>

          <section className="hero">
            <div className="eyebrow">
              ✦ AI-POWERED CAREER TOOL
            </div>

            <h1>
              Make your resume
              <br />
              <span className="gradient-text">
                impossible to overlook.
              </span>
            </h1>

            <p>
              Analyze your resume against any job description, discover
              missing keywords, rewrite your experience and generate a
              personalized cover letter.
            </p>
          </section>

          <div className="workspace">

            {/* LEFT SIDE */}

            <div className="card">
              <div className="card-title">
                Your application
              </div>

              <div className="card-subtitle">
                Upload your resume and paste the target job description.
              </div>

              <label className="upload-box">
                <input
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={handleFileChange}
                />

                <div className="upload-icon">
                  ↑
                </div>

                <strong>
                  Drop your resume here
                </strong>

                <span>
                  PDF files only · 5–10 MB recommended
                </span>

                {resumeFile && (
                  <div className="file-name">
                    ✓ {resumeFile.name}
                  </div>
                )}
              </label>

              <div className="textarea-wrap">
                <label className="label">
                  TARGET JOB DESCRIPTION
                </label>

                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                />
              </div>

              {error && (
                <div className="error">
                  {error}
                </div>
              )}

              <button
                className="primary-btn"
                onClick={analyzeResume}
                disabled={loading}
              >
                {loading ? "Analyzing..." : "✦ Analyze My Resume"}
              </button>
            </div>

            {/* RIGHT SIDE */}

            <div className="card result-card">

              {!analysis ? (
                <div className="empty-state">
                  <div>
                    <div className="empty-icon">
                      ✧
                    </div>

                    <h3>
                      Your AI analysis awaits
                    </h3>

                    <p>
                      Upload your resume and add a job description.
                      Your ATS compatibility report will appear here.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="score-section">

                    <div
                      className="score"
                      style={{
                        background: `
                          radial-gradient(
                            circle at center,
                            #12111f 57%,
                            transparent 58%
                          ),
                          conic-gradient(
                            #a78bfa ${score}%,
                            rgba(255,255,255,0.06) 0
                          )
                        `,
                      }}
                    >
                      <div className="score-inner">
                        <div className="score-number">
                          {score}%
                        </div>

                        <div className="score-label">
                          ATS MATCH
                        </div>
                      </div>
                    </div>

                    <div className="score-info">
                      <h3>
                        Resume compatibility
                      </h3>

                      <p>
                        Your resume was compared with the target
                        job requirements and keywords.
                      </p>
                    </div>

                  </div>

                  <div className="tabs">

                    <button
                      className={`tab ${
                        activeTab === "analysis" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("analysis")}
                    >
                      Analysis
                    </button>

                    <button
                      className={`tab ${
                        activeTab === "rewrite" ? "active" : ""
                      }`}
                      onClick={rewriteBullets}
                    >
                      Rewrite
                    </button>

                    <button
                      className={`tab ${
                        activeTab === "cover" ? "active" : ""
                      }`}
                      onClick={generateCoverLetter}
                    >
                      Cover Letter
                    </button>

                  </div>

                  {activeTab === "analysis" && (
                    <>
                      <div className="section-heading">
                        Required skills
                      </div>

                      <div className="chips">
                        {analysis.required_skills?.map(
                          (skill, index) => (
                            <span
                              className="chip"
                              key={index}
                            >
                              {skill}
                            </span>
                          )
                        )}
                      </div>

                      <div className="section-heading">
                        Missing keywords
                      </div>

                      <div className="chips">
                        {analysis.missing_keywords?.length ? (
                          analysis.missing_keywords.map(
                            (keyword, index) => (
                              <span
                                className="chip missing"
                                key={index}
                              >
                                {keyword}
                              </span>
                            )
                          )
                        ) : (
                          <span className="chip">
                            No major missing keywords
                          </span>
                        )}
                      </div>

                      <div className="section-heading">
                        Your strengths
                      </div>

                      <div className="chips">
                        {analysis.strengths?.map(
                          (skill, index) => (
                            <span
                              className="chip"
                              key={index}
                            >
                              ✓ {skill}
                            </span>
                          )
                        )}
                      </div>

                      <div className="section-heading">
                        Improvement suggestions
                      </div>

                      {analysis.improvement_suggestions?.map(
                        (suggestion, index) => (
                          <div
                            className="suggestion"
                            key={index}
                          >
                            {suggestion}
                          </div>
                        )
                      )}

                      <div className="section-heading">
                        AI explanation
                      </div>

                      <div className="explanation">
                        {analysis.explanation}
                      </div>
                    </>
                  )}

                 {activeTab === "rewrite" && (
  <>
    <div className="section-heading">
      AI-rewritten experience bullets
    </div>

    {rewrittenBullets.length === 0 ? (
      <div className="empty-state">
        <div>
          <p>
            Click Rewrite to generate optimized
            resume bullets.
          </p>
        </div>
      </div>
    ) : (
      rewrittenBullets.map((bullet, index) => (
        <div className="bullet" key={index}>

          <div style={{ marginBottom: "10px" }}>
            <strong style={{ color: "#8f8da1", fontSize: "11px" }}>
              ORIGINAL
            </strong>

            <div style={{ marginTop: "5px" }}>
              {bullet.original}
            </div>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <strong style={{ color: "#c4b5fd", fontSize: "11px" }}>
              AI REWRITTEN
            </strong>

            <div style={{ marginTop: "5px" }}>
              • {bullet.rewritten}
            </div>
          </div>

          <div>
            <strong style={{ color: "#f9a8d4", fontSize: "11px" }}>
              WHY IT'S BETTER
            </strong>

            <div
              style={{
                marginTop: "5px",
                color: "#aaa6b7",
                fontSize: "12px",
              }}
            >
              {bullet.reason}
            </div>
          </div>

        </div>
      ))
    )}
  </>
)}

                  {activeTab === "cover" && (
                    <>
                      <div className="section-heading">
                        Personalized cover letter
                      </div>

                      {coverLetter ? (
                        <div className="cover-letter">
                          {coverLetter}
                        </div>
                      ) : (
                        <div className="empty-state">
                          <div>
                            <p>
                              Click Cover Letter to generate a
                              tailored application letter.
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                </>
              )}

            </div>

          </div>

          <div className="footer">
            Built with React · FastAPI · LangChain · RAG · AI
          </div>

        </div>
      </div>
    </>
  );
}