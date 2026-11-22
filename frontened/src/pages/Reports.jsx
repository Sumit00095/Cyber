
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  FileText,
  ShieldAlert,
  CheckCircle,
  Activity,
  Download,
  RefreshCw,
  BarChart3
} from "lucide-react";

function Reports() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:5000/api/threats"
      );

      setThreats(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (err) {
      console.error("Reports fetch error:", err);
      setError("Unable to load reports. Check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const total = threats.length;

  const critical = threats.filter(
    (t) => t.severity === "Critical"
  ).length;

  const high = threats.filter(
    (t) => t.severity === "High"
  ).length;

  const medium = threats.filter(
    (t) => t.severity === "Medium"
  ).length;

  const low = threats.filter(
    (t) => t.severity === "Low"
  ).length;

  const resolved = threats.filter(
    (t) => t.status === "Resolved"
  ).length;

  const active = threats.filter(
    (t) => t.status !== "Resolved"
  ).length;

  // Export threats as CSV
  const downloadCSV = () => {
    if (threats.length === 0) {
      alert("No threat data available to export.");
      return;
    }

    const headers = [
      "Threat Type",
      "Source",
      "Severity",
      "Status",
      "Description"
    ];

    const rows = threats.map((t) => [
      t.type || "",
      t.source || "",
      t.severity || "",
      t.status || "",
      t.description || ""
    ]);

    const csvContent = [
      headers,
      ...rows
    ]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csvContent],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "CyberShield-Threat-Report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="app reports-app">

      <Sidebar />

      <main className="main reports-main">

        <Topbar />

        <div className="reports-page">

          {/* Page Heading */}

          <div className="reports-heading">

            <div>
              <div className="reports-label">
                <FileText size={16} />
                SECURITY REPORTS
              </div>

              <h1>Reports & Analytics</h1>

              <p>
                View security incidents, threat statistics,
                and generate reports for your system.
              </p>
            </div>

            <div className="reports-actions">

              <button
                className="reports-refresh"
                onClick={fetchReports}
                disabled={loading}
              >
                <RefreshCw size={16} />
                Refresh
              </button>

              <button
                className="reports-download"
                onClick={downloadCSV}
              >
                <Download size={16} />
                Export CSV
              </button>

            </div>

          </div>

          {/* Error */}

          {error && (
            <div className="reports-error">
              {error}
            </div>
          )}

          {/* Statistics */}

          <section className="reports-stats">

            <div className="report-stat-card">
              <div className="report-stat-icon blue">
                <FileText size={22} />
              </div>

              <div>
                <span>Total Incidents</span>
                <h2>{loading ? "..." : total}</h2>
                <small>All recorded threats</small>
              </div>
            </div>

            <div className="report-stat-card">
              <div className="report-stat-icon red">
                <ShieldAlert size={22} />
              </div>

              <div>
                <span>Critical Threats</span>
                <h2>{loading ? "..." : critical}</h2>
                <small>Highest risk incidents</small>
              </div>
            </div>

            <div className="report-stat-card">
              <div className="report-stat-icon green">
                <CheckCircle size={22} />
              </div>

              <div>
                <span>Resolved</span>
                <h2>{loading ? "..." : resolved}</h2>
                <small>Successfully resolved</small>
              </div>
            </div>

            <div className="report-stat-card">
              <div className="report-stat-icon orange">
                <Activity size={22} />
              </div>

              <div>
                <span>Active Threats</span>
                <h2>{loading ? "..." : active}</h2>
                <small>Pending resolution</small>
              </div>
            </div>

          </section>

          {/* Severity Report */}

          <section className="reports-panel">

            <div className="reports-panel-heading">
              <div className="reports-panel-title">
                <BarChart3 size={20} />
                <h2>Threat Severity Analysis</h2>
              </div>

              <p>
                Breakdown of threats according to severity.
              </p>
            </div>

            <div className="severity-report-list">

              <SeverityRow
                label="Critical"
                count={critical}
                total={total}
                color="#ef4444"
              />

              <SeverityRow
                label="High"
                count={high}
                total={total}
                color="#f97316"
              />

              <SeverityRow
                label="Medium"
                count={medium}
                total={total}
                color="#eab308"
              />

              <SeverityRow
                label="Low"
                count={low}
                total={total}
                color="#22c55e"
              />

            </div>

          </section>

          {/* Threat Table */}

          <section className="reports-panel threat-table-panel">

            <div className="reports-panel-heading">
              <div className="reports-panel-title">
                <FileText size={20} />
                <h2>Incident Records</h2>
              </div>

              <p>
                Complete list of detected threats.
              </p>
            </div>

            {loading ? (
              <div className="reports-empty">
                Loading report data...
              </div>
            ) : threats.length === 0 ? (
              <div className="reports-empty">
                <ShieldAlert size={35} />
                <h3>No threat records found</h3>
                <p>
                  Threat records will appear here when detected.
                </p>
              </div>
            ) : (
              <div className="reports-table-wrapper">
                <table className="reports-table">
                  <thead>
                    <tr>
                      <th>Threat Type</th>
                      <th>Source</th>
                      <th>Severity</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {threats.map((threat) => (
                      <tr key={threat._id}>
                        <td>
                          <strong>
                            {threat.type || "Unknown Threat"}
                          </strong>
                        </td>

                        <td>
                          {threat.source || "Unknown"}
                        </td>

                        <td>
                          <span
                            className={`report-severity ${
                              (threat.severity || "unknown")
                                .toLowerCase()
                            }`}
                          >
                            {threat.severity || "Unknown"}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`report-status ${
                              threat.status === "Resolved"
                                ? "resolved"
                                : "active"
                            }`}
                          >
                            {threat.status || "Active"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </section>

          {/* Footer */}

          <div className="reports-footer">
            <ShieldAlert size={15} />
            CyberShield Security Management System
          </div>

        </div>

      </main>

      {/* Reports CSS in same file */}

      <style>{`

        .reports-app {
          min-height: 100vh;
          background: #f4f7fb;
        }

        .reports-main {
          flex: 1;
          min-width: 0;
        }

        .reports-page {
          width: 100%;
          padding: 30px;
          background: #f4f7fb;
          min-height: calc(100vh - 85px);
        }

        /* Heading */

        .reports-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 28px;
        }

        .reports-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #2563eb;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          margin-bottom: 12px;
        }

        .reports-heading h1 {
          color: #172033;
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 9px;
        }

        .reports-heading p {
          color: #718096;
          font-size: 14px;
          line-height: 1.7;
        }

        .reports-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .reports-actions button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px 16px;
          border: none;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }

        .reports-refresh {
          background: #ffffff;
          color: #334155;
          border: 1px solid #dbe3ee !important;
        }

        .reports-refresh:hover {
          background: #f1f5f9;
        }

        .reports-download {
          background: #2563eb;
          color: white;
        }

        .reports-download:hover {
          background: #1d4ed8;
        }

        /* Stats */

        .reports-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
          margin-bottom: 25px;
        }

        .report-stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 23px;
          background: white;
          border: 1px solid #e5eaf2;
          border-radius: 14px;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.035);
          transition: 0.25s;
          min-width: 0;
        }

        .report-stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 9px 22px rgba(15, 23, 42, 0.07);
        }

        .report-stat-icon {
          width: 46px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          flex-shrink: 0;
        }

        .report-stat-icon.blue {
          color: #2563eb;
          background: #eff6ff;
        }

        .report-stat-icon.red {
          color: #dc2626;
          background: #fef2f2;
        }

        .report-stat-icon.green {
          color: #16a34a;
          background: #f0fdf4;
        }

        .report-stat-icon.orange {
          color: #ea580c;
          background: #fff7ed;
        }

        .report-stat-card span {
          display: block;
          color: #718096;
          font-size: 12px;
          margin-bottom: 7px;
        }

        .report-stat-card h2 {
          font-size: 26px;
          color: #172033;
          margin-bottom: 5px;
        }

        .report-stat-card small {
          color: #94a3b8;
          font-size: 11px;
        }

        /* Panels */

        .reports-panel {
          background: white;
          padding: 25px;
          border: 1px solid #e5eaf2;
          border-radius: 15px;
          margin-bottom: 25px;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.035);
        }

        .reports-panel-heading {
          margin-bottom: 24px;
        }

        .reports-panel-title {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .reports-panel-title svg {
          color: #2563eb;
        }

        .reports-panel-title h2 {
          font-size: 17px;
          color: #172033;
        }

        .reports-panel-heading p {
          color: #718096;
          font-size: 12px;
          margin-top: 8px;
        }

        /* Severity bars */

        .severity-report-list {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .severity-row {
          width: 100%;
        }

        .severity-row-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 9px;
        }

        .severity-row-top strong {
          color: #334155;
          font-size: 13px;
        }

        .severity-row-top span {
          color: #64748b;
          font-size: 12px;
        }

        .severity-track {
          width: 100%;
          height: 9px;
          background: #edf1f7;
          border-radius: 10px;
          overflow: hidden;
        }

        .severity-fill {
          height: 100%;
          border-radius: 10px;
          transition: width 0.5s ease;
        }

        /* Table */

        .reports-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .reports-table {
          width: 100%;
          min-width: 600px;
          border-collapse: collapse;
        }

        .reports-table thead th {
          background: #f8fafc;
          color: #64748b;
          padding: 14px;
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          border-bottom: 1px solid #e5eaf2;
        }

        .reports-table tbody td {
          padding: 16px 14px;
          border-bottom: 1px solid #edf0f5;
          font-size: 13px;
          color: #64748b;
        }

        .reports-table tbody tr:hover {
          background: #f8fafc;
        }

        .reports-table tbody td strong {
          color: #172033;
          font-size: 13px;
        }

        .report-severity,
        .report-status {
          display: inline-block;
          padding: 5px 9px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }

        .report-severity.critical {
          color: #dc2626;
          background: #fef2f2;
        }

        .report-severity.high {
          color: #ea580c;
          background: #fff7ed;
        }

        .report-severity.medium {
          color: #ca8a04;
          background: #fefce8;
        }

        .report-severity.low {
          color: #16a34a;
          background: #f0fdf4;
        }

        .report-severity.unknown {
          color: #64748b;
          background: #f1f5f9;
        }

        .report-status.resolved {
          color: #16a34a;
          background: #f0fdf4;
        }

        .report-status.active {
          color: #2563eb;
          background: #eff6ff;
        }

        /* Empty states */

        .reports-empty {
          min-height: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          text-align: center;
          color: #94a3b8;
        }

        .reports-empty svg {
          color: #2563eb;
        }

        .reports-empty h3 {
          color: #334155;
          font-size: 15px;
        }

        .reports-empty p {
          font-size: 13px;
        }

        .reports-error {
          padding: 15px;
          margin-bottom: 20px;
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
          border-radius: 10px;
          font-size: 13px;
        }

        /* Footer */

        .reports-footer {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          color: #94a3b8;
          font-size: 11px;
          padding: 15px;
        }

        .reports-footer svg {
          color: #2563eb;
        }

        /* Responsive */

        @media (max-width: 1150px) {
          .reports-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .reports-page {
            padding: 20px 14px;
          }

          .reports-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .reports-heading h1 {
            font-size: 23px;
          }

          .reports-actions {
            width: 100%;
          }

          .reports-actions button {
            flex: 1;
          }

          .reports-stats {
            grid-template-columns: 1fr;
            gap: 13px;
          }

          .reports-panel {
            padding: 18px;
          }
        }

      `}</style>

    </div>
  );
}

// Severity bar component
function SeverityRow({ label, count, total, color }) {
  const percentage = total > 0
    ? (count / total) * 100
    : 0;

  return (
    <div className="severity-row">

      <div className="severity-row-top">
        <strong>{label}</strong>
        <span>
          {count} incident(s) · {percentage.toFixed(0)}%
        </span>
      </div>

      <div className="severity-track">
        <div
          className="severity-fill"
          style={{
            width: `${percentage}%`,
            background: color
          }}
        />
      </div>

    </div>
  );
}

export default Reports;