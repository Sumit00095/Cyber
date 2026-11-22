
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import AIAlertAnalyzer from "../components/AIAlertAnalyzer";
import StatCard from "../components/StatCard";

import {
  ShieldAlert,
  AlertTriangle,
  Activity,
  CheckCircle,
  ShieldCheck,
  RefreshCw,
  TrendingUp,
  Zap,
  Clock,
  Lock,
  ArrowUpRight,
  BrainCircuit
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

function Dashboard() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThreats();
  }, []);

  const fetchThreats = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:5000/api/threats"
      );

      setThreats(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error("Error fetching threats:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalThreats = threats.length;

  const criticalThreats = threats.filter(
    (threat) => threat.severity === "Critical"
  ).length;

  const activeThreats = threats.filter(
    (threat) => threat.status !== "Resolved"
  ).length;

  const resolvedThreats = threats.filter(
    (threat) => threat.status === "Resolved"
  ).length;

  const systemSecure = criticalThreats === 0;

  // Demo activity data - replace with real daily API data later
  const chartData = [
    { day: "Mon", threats: 3 },
    { day: "Tue", threats: 5 },
    { day: "Wed", threats: 2 },
    { day: "Thu", threats: 7 },
    { day: "Fri", threats: 4 },
    { day: "Sat", threats: 6 },
    { day: "Sun", threats: totalThreats }
  ];

  return (
    <div className="app cyber-dashboard">

      <Sidebar />

      <main className="main cyber-main">

        <Topbar />

        <div className="cyber-content">

          {/* Welcome Section */}

          <section className="cyber-welcome">

            <div className="welcome-text">
              <div className="welcome-label">
                <span className="live-dot"></span>
                SECURITY OVERVIEW
              </div>

              <h1>
                Welcome to <span>CyberShield</span>
              </h1>

              <p>
                Monitor your security environment, detect threats,
                and protect your digital infrastructure.
              </p>

              <div className="welcome-buttons">
                <button
                  className="cyber-refresh"
                  onClick={fetchThreats}
                  disabled={loading}
                >
                  <RefreshCw size={16} />
                  {loading ? "Refreshing..." : "Refresh Data"}
                </button>

                <div className="protection-status">
                  <ShieldCheck size={18} />
                  <span>
                    {systemSecure
                      ? "Protection Active"
                      : "Attention Required"}
                  </span>
                </div>
              </div>
            </div>

            <div className="welcome-shield">
              <div className="shield-glow"></div>
              <ShieldCheck size={105} strokeWidth={1.2} />
              <div className="shield-orbit orbit-one"></div>
              <div className="shield-orbit orbit-two"></div>
            </div>

          </section>

          {/* Statistics */}

          <section className="cyber-stats">

            <StatCard
              title="Threats Detected"
              value={loading ? "..." : totalThreats}
              description="Total security incidents"
              icon={<ShieldAlert />}
            />

            <StatCard
              title="Critical Alerts"
              value={loading ? "..." : criticalThreats}
              description="Needs immediate attention"
              icon={<AlertTriangle />}
            />

            <StatCard
              title="Active Threats"
              value={loading ? "..." : activeThreats}
              description="Currently unresolved"
              icon={<Activity />}
            />

            <StatCard
              title="System Status"
              value={loading ? "..." : systemSecure ? "Secure" : "Alert"}
              description={
                loading
                  ? "Checking system"
                  : systemSecure
                  ? "No critical threats"
                  : "Critical threats detected"
              }
              icon={<CheckCircle />}
            />

          </section>

          {/* Chart and Recent Threats */}

          <section className="cyber-grid">

            {/* Threat Chart */}

            <div className="cyber-panel chart-panel">

              <div className="panel-header">

                <div>
                  <div className="panel-title">
                    <Activity size={19} />
                    <h3>Threat Activity</h3>
                  </div>

                  <p>Weekly threat monitoring overview</p>
                </div>

                <div className="chart-tag">
                  <span className="live-dot"></span>
                  Live Monitor
                </div>

              </div>

              <div className="chart-summary">
                <div>
                  <h2>{totalThreats}</h2>
                  <span>Total Threats</span>
                </div>

                <div className="chart-summary-icon">
                  <TrendingUp size={20} />
                </div>
              </div>

              <div className="chart-container">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 15,
                      right: 15,
                      left: -20,
                      bottom: 5
                    }}
                  >

                    <CartesianGrid
                      stroke="#24344d"
                      strokeDasharray="4 4"
                    />

                    <XAxis
                      dataKey="day"
                      stroke="#8090a8"
                      tick={{ fill: "#8090a8", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      allowDecimals={false}
                      stroke="#8090a8"
                      tick={{ fill: "#8090a8", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      contentStyle={{
                        background: "#111d31",
                        border: "1px solid #263750",
                        borderRadius: "10px",
                        color: "#ffffff"
                      }}
                      labelStyle={{ color: "#ffffff" }}
                    />

                    <Line
                      type="monotone"
                      dataKey="threats"
                      stroke="#38bdf8"
                      strokeWidth={3}
                      dot={{
                        fill: "#38bdf8",
                        stroke: "#0f1b2e",
                        strokeWidth: 3,
                        r: 5
                      }}
                      activeDot={{
                        r: 7,
                        fill: "#ffffff",
                        stroke: "#38bdf8",
                        strokeWidth: 3
                      }}
                    />

                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-footer">
                <span>
                  <span className="legend-dot"></span>
                  Threat events
                </span>

                <span>Weekly overview</span>
              </div>

            </div>

            {/* Recent Threats */}

            <div className="cyber-panel recent-panel">

              <div className="panel-header">

                <div>
                  <div className="panel-title">
                    <AlertTriangle size={19} />
                    <h3>Recent Threats</h3>
                  </div>

                  <p>Latest detected security incidents</p>
                </div>

                <div className="recent-count">
                  {threats.length}
                </div>

              </div>

              <div className="threat-list">

                {loading ? (
                  <div className="cyber-empty">
                    <RefreshCw size={24} />
                    <p>Loading security events...</p>
                  </div>
                ) : threats.length === 0 ? (
                  <div className="cyber-empty">
                    <ShieldCheck size={35} />
                    <h4>No threats detected</h4>
                    <p>Your environment looks clean.</p>
                  </div>
                ) : (
                  threats.slice(0, 5).map((threat) => {

                    const severity =
                      threat.severity || "Unknown";

                    const severityClass =
                      severity.toLowerCase();

                    return (
                      <div
                        className="cyber-threat-item"
                        key={threat._id}
                      >

                        <div
                          className={`threat-severity-icon ${severityClass}`}
                        >
                          {severity === "Critical" ? (
                            <ShieldAlert size={18} />
                          ) : severity === "High" ? (
                            <AlertTriangle size={18} />
                          ) : (
                            <Activity size={18} />
                          )}
                        </div>

                        <div className="threat-details">
                          <strong>
                            {threat.type || "Security Threat"}
                          </strong>

                          <span>
                            {threat.source || "Unknown Source"}
                          </span>

                          <div className="threat-meta">
                            <span
                              className={`severity-badge ${severityClass}`}
                            >
                              {severity}
                            </span>

                            <span className="threat-status">
                              {threat.status || "Active"}
                            </span>
                          </div>
                        </div>

                        <ArrowUpRight
                          className="threat-arrow"
                          size={16}
                        />

                      </div>
                    );
                  })
                )}

              </div>

              <div className="recent-footer">
                <span>
                  <Clock size={14} />
                  Latest security events
                </span>
              </div>

            </div>

          </section>

          {/* Security Overview */}

          <section className="security-overview">

            <div className="overview-card">
              <div className="overview-icon blue">
                <Lock size={21} />
              </div>

              <div>
                <h4>Security Monitoring</h4>
                <p>Threat monitoring is enabled</p>
              </div>

              <span className="overview-active">
                Active
              </span>
            </div>

            <div className="overview-card">
              <div className="overview-icon green">
                <CheckCircle size={21} />
              </div>

              <div>
                <h4>Resolved Incidents</h4>
                <p>Threats successfully resolved</p>
              </div>

              <strong className="overview-number">
                {resolvedThreats}
              </strong>
            </div>

            <div className="overview-card">
              <div className="overview-icon purple">
                <BrainCircuit size={21} />
              </div>

              <div>
                <h4>AI Threat Analysis</h4>
                <p>AI-assisted security detection</p>
              </div>

              <span className="overview-active">
                Ready
              </span>
            </div>

          </section>

          {/* AI Alert Analyzer */}

          <section className="cyber-ai-section">

            <div className="ai-heading">
              <div className="ai-heading-icon">
                <Zap size={20} />
              </div>

              <div>
                <h2>AI Security Assistant</h2>
                <p>
                  Analyze suspicious activity with AI-powered
                  security intelligence.
                </p>
              </div>
            </div>

            <AIAlertAnalyzer />

          </section>

          {/* Footer */}

          <footer className="cyber-footer">
            <ShieldCheck size={16} />
            <span>CyberShield Security Management System</span>
            <span>•</span>
            <span>Dashboard</span>
          </footer>

        </div>

      </main>

      {/* CSS in same JSX file */}

      <style>{`

        /* =====================================
           CYBERSHIELD DASHBOARD
        ===================================== */

        .cyber-dashboard {
          min-height: 100vh;
          background: #f3f6fb;
          color: #172033;
        }

        .cyber-main {
          flex: 1;
          min-width: 0;
          width: calc(100% - 240px);
        }

        .cyber-content {
          width: 100%;
          min-width: 0;
          padding: 28px;
          background: #f3f6fb;
        }

        /* =====================================
           WELCOME BANNER
        ===================================== */

        .cyber-welcome {
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 220px;
          padding: 32px 38px;
          margin-bottom: 26px;
          border-radius: 20px;
          color: white;
          background:
            radial-gradient(
              circle at 85% 50%,
              rgba(37, 99, 235, 0.35),
              transparent 35%
            ),
            linear-gradient(
              120deg,
              #101827,
              #142b4a,
              #10213a
            );
          border: 1px solid #253a59;
          box-shadow: 0 10px 35px rgba(15, 23, 42, 0.12);
        }

        .cyber-welcome::before {
          content: "";
          position: absolute;
          width: 350px;
          height: 350px;
          right: 5%;
          top: -180px;
          border-radius: 50%;
          border: 1px solid rgba(56, 189, 248, 0.12);
        }

        .cyber-welcome::after {
          content: "";
          position: absolute;
          width: 250px;
          height: 250px;
          right: 10%;
          bottom: -170px;
          border-radius: 50%;
          border: 1px solid rgba(56, 189, 248, 0.16);
        }

        .welcome-text {
          position: relative;
          z-index: 2;
          max-width: 650px;
        }

        .welcome-label {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #7dd3fc;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          margin-bottom: 18px;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          display: inline-block;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.7);
          animation: cyberPulse 1.8s infinite;
        }

        @keyframes cyberPulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.45;
          }
        }

        .welcome-text h1 {
          color: white;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 12px;
          line-height: 1.3;
        }

        .welcome-text h1 span {
          color: #38bdf8;
        }

        .welcome-text > p {
          color: #a9bdd6;
          font-size: 14px;
          line-height: 1.8;
          max-width: 550px;
        }

        .welcome-buttons {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
          margin-top: 25px;
        }

        .cyber-refresh {
          display: flex;
          align-items: center;
          gap: 9px;
          background: #2563eb;
          color: white;
          padding: 12px 18px;
          border: none;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.25s;
        }

        .cyber-refresh:hover {
          background: #3b82f6;
          transform: translateY(-2px);
        }

        .cyber-refresh:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .protection-status {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #86efac;
          font-size: 13px;
        }

        /* Shield decoration */

        .welcome-shield {
          position: relative;
          z-index: 1;
          width: 190px;
          height: 190px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #38bdf8;
          margin-right: 35px;
        }

        .shield-glow {
          position: absolute;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: rgba(37, 99, 235, 0.3);
          filter: blur(35px);
        }

        .welcome-shield > svg {
          z-index: 2;
          filter: drop-shadow(0 0 15px rgba(56, 189, 248, 0.35));
        }

        .shield-orbit {
          position: absolute;
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: 50%;
        }

        .orbit-one {
          width: 160px;
          height: 160px;
        }

        .orbit-two {
          width: 190px;
          height: 190px;
          border-style: dashed;
        }

        /* =====================================
           STAT CARDS
        ===================================== */

        .cyber-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
          margin-bottom: 25px;
        }

        .cyber-stats > .card {
          position: relative;
          background: #ffffff;
          border: 1px solid #e5eaf2;
          border-radius: 15px;
          padding: 22px;
          min-width: 0;
          box-shadow: 0 4px 15px rgba(15, 23, 42, 0.035);
          transition: transform 0.25s, box-shadow 0.25s;
        }

        .cyber-stats > .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 24px rgba(37, 99, 235, 0.08);
        }

        .cyber-stats > .card h3 {
          color: #64748b;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 13px;
        }

        .cyber-stats > .card h2 {
          font-size: 27px;
          font-weight: 700;
          color: #172033;
        }

        /* =====================================
           DASHBOARD GRID
        ===================================== */

        .cyber-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.55fr) minmax(300px, 1fr);
          gap: 22px;
          margin-bottom: 25px;
        }

        .cyber-panel {
          background: #111c2e;
          border: 1px solid #1e3049;
          border-radius: 17px;
          padding: 24px;
          min-width: 0;
          color: white;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
        }

        /* Panel heading */

        .panel-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
        }

        .panel-title {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .panel-title > svg {
          color: #38bdf8;
        }

        .panel-title h3 {
          color: #f1f5f9;
          font-size: 17px;
          font-weight: 600;
        }

        .panel-header p {
          margin-top: 8px;
          color: #8495ad;
          font-size: 12px;
        }

        .chart-tag {
          display: flex;
          align-items: center;
          gap: 7px;
          background: #172c3d;
          color: #86efac;
          padding: 8px 11px;
          border: 1px solid #244456;
          border-radius: 20px;
          font-size: 11px;
          white-space: nowrap;
        }

        .chart-tag .live-dot {
          width: 6px;
          height: 6px;
        }

        /* Chart summary */

        .chart-summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 20px 0 10px;
        }

        .chart-summary h2 {
          color: #ffffff;
          font-size: 34px;
          margin-bottom: 5px;
        }

        .chart-summary span {
          color: #8495ad;
          font-size: 12px;
        }

        .chart-summary-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          color: #38bdf8;
          background: #172c45;
          border-radius: 11px;
        }

        .chart-container {
          width: 100%;
          height: 280px;
          min-width: 0;
        }

        .chart-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #8292a9;
          font-size: 11px;
          border-top: 1px solid #24344a;
          padding-top: 15px;
          margin-top: 5px;
        }

        .chart-footer > span:first-child {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #38bdf8;
        }

        /* =====================================
           RECENT THREATS PANEL
        ===================================== */

        .recent-count {
          min-width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1e3049;
          border-radius: 9px;
          color: #38bdf8;
          font-size: 13px;
          font-weight: 700;
        }

        .threat-list {
          min-height: 220px;
        }

        .cyber-threat-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 0;
          border-bottom: 1px solid #233247;
          transition: background 0.2s;
        }

        .cyber-threat-item:last-child {
          border-bottom: none;
        }

        .cyber-threat-item:hover {
          background: rgba(255, 255, 255, 0.025);
        }

        .threat-severity-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          border-radius: 11px;
        }

        .threat-severity-icon.critical {
          color: #fb7185;
          background: rgba(244, 63, 94, 0.12);
        }

        .threat-severity-icon.high {
          color: #fb923c;
          background: rgba(249, 115, 22, 0.12);
        }

        .threat-severity-icon.medium {
          color: #facc15;
          background: rgba(234, 179, 8, 0.12);
        }

        .threat-severity-icon.low {
          color: #4ade80;
          background: rgba(34, 197, 94, 0.12);
        }

        .threat-severity-icon.unknown {
          color: #94a3b8;
          background: rgba(148, 163, 184, 0.12);
        }

        .threat-details {
          flex: 1;
          min-width: 0;
        }

        .threat-details strong {
          display: block;
          color: #e2e8f0;
          font-size: 13px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .threat-details > span {
          display: block;
          color: #8495ad;
          font-size: 11px;
          margin-top: 5px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .threat-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 8px;
        }

        .severity-badge {
          padding: 4px 8px;
          border-radius: 5px;
          font-size: 10px;
          font-weight: 600;
        }

        .severity-badge.critical {
          color: #fda4af;
          background: rgba(244, 63, 94, 0.13);
        }

        .severity-badge.high {
          color: #fdba74;
          background: rgba(249, 115, 22, 0.13);
        }

        .severity-badge.medium {
          color: #fde047;
          background: rgba(234, 179, 8, 0.13);
        }

        .severity-badge.low {
          color: #86efac;
          background: rgba(34, 197, 94, 0.13);
        }

        .severity-badge.unknown {
          color: #cbd5e1;
          background: rgba(148, 163, 184, 0.13);
        }

        .threat-status {
          color: #8495ad;
          font-size: 10px;
        }

        .threat-arrow {
          color: #61738d;
          flex-shrink: 0;
        }

        .cyber-empty {
          min-height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 12px;
          color: #8495ad;
          text-align: center;
        }

        .cyber-empty svg {
          color: #38bdf8;
        }

        .cyber-empty h4 {
          color: #e2e8f0;
          font-size: 14px;
        }

        .cyber-empty p {
          color: #8495ad;
          font-size: 12px;
        }

        .recent-footer {
          display: flex;
          align-items: center;
          gap: 7px;
          border-top: 1px solid #233247;
          padding-top: 14px;
          color: #8495ad;
          font-size: 11px;
        }

        .recent-footer span {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* =====================================
           SECURITY OVERVIEW
        ===================================== */

        .security-overview {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          margin-bottom: 25px;
        }

        .overview-card {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 20px;
          background: white;
          border: 1px solid #e5eaf2;
          border-radius: 14px;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
          min-width: 0;
        }

        .overview-icon {
          width: 43px;
          height: 43px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          flex-shrink: 0;
        }

        .overview-icon.blue {
          color: #2563eb;
          background: #eff6ff;
        }

        .overview-icon.green {
          color: #16a34a;
          background: #f0fdf4;
        }

        .overview-icon.purple {
          color: #9333ea;
          background: #faf5ff;
        }

        .overview-card > div:nth-child(2) {
          flex: 1;
          min-width: 0;
        }

        .overview-card h4 {
          color: #172033;
          font-size: 13px;
          margin-bottom: 5px;
        }

        .overview-card p {
          color: #718096;
          font-size: 11px;
        }

        .overview-active {
          color: #16a34a;
          background: #f0fdf4;
          border: 1px solid #dcfce7;
          padding: 5px 9px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 600;
        }

        .overview-number {
          color: #16a34a;
          font-size: 22px;
        }

        /* =====================================
           AI SECTION
        ===================================== */

        .cyber-ai-section {
          background: white;
          padding: 25px;
          border: 1px solid #e5eaf2;
          border-radius: 17px;
          margin-bottom: 25px;
          box-shadow: 0 4px 15px rgba(15, 23, 42, 0.035);
          min-width: 0;
        }

        .ai-heading {
          display: flex;
          align-items: center;
          gap: 13px;
          margin-bottom: 22px;
        }

        .ai-heading-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eff6ff;
          color: #2563eb;
          border-radius: 12px;
          flex-shrink: 0;
        }

        .ai-heading h2 {
          color: #172033;
          font-size: 18px;
          margin-bottom: 6px;
        }

        .ai-heading p {
          color: #718096;
          font-size: 12px;
          line-height: 1.6;
        }

        /* =====================================
           FOOTER
        ===================================== */

        .cyber-footer {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          padding: 20px 10px 5px;
          color: #94a3b8;
          font-size: 11px;
        }

        .cyber-footer svg {
          color: #2563eb;
        }

        /* =====================================
           RESPONSIVE
        ===================================== */

        @media (max-width: 1250px) {
          .cyber-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .cyber-grid {
            grid-template-columns: 1fr;
          }

          .security-overview {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 900px) {
          .cyber-content {
            padding: 22px;
          }

          .welcome-shield {
            margin-right: 10px;
            transform: scale(0.85);
          }
        }

        @media (max-width: 650px) {
          .cyber-content {
            padding: 14px;
          }

          .cyber-welcome {
            padding: 25px 22px;
            min-height: 200px;
          }

          .welcome-text h1 {
            font-size: 25px;
          }

          .welcome-text > p {
            font-size: 12px;
          }

          .welcome-shield {
            display: none;
          }

          .cyber-stats {
            grid-template-columns: 1fr;
            gap: 13px;
          }

          .cyber-stats > .card {
            padding: 19px;
          }

          .cyber-panel {
            padding: 18px;
          }

          .panel-title h3 {
            font-size: 15px;
          }

          .chart-container {
            height: 240px;
          }

          .cyber-ai-section {
            padding: 18px;
          }

          .overview-card {
            padding: 16px;
          }
        }

      `}</style>

    </div>
  );
}

export default Dashboard;