/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { database } from "../../../../.firebase/firebase";
import { ref, onValue, update } from "firebase/database";
import { Mail, Calendar, User, Shield } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

interface SecurityReport {
  id: string;
  timestamp: string;
  reporter: {
    name: string;
    email: string;
  };
  issue: {
    type: string;
    description: string;
    reproduction: string;
    location: string;
    potentialImpact: string;
    suggestedFix: string;
  };
  status: "new" | "in-progress" | "resolved" | "dismissed";
}

const SecurityManagement: React.FC = () => {
  const [reports, setReports] = useState<SecurityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<SecurityReport | null>(
    null
  );
  const [filter, setFilter] = useState<
    "all" | "new" | "in-progress" | "resolved" | "dismissed"
  >("all");

  useEffect(() => {
    const securityRef = ref(database, "Security");

    const unsubscribe = onValue(securityRef, (snapshot) => {
      if (snapshot.exists()) {
        const reportData = snapshot.val();
        const reportsList = Object.entries(reportData).map(
          ([id, data]: [string, any]) => ({
            id,
            ...data,
          })
        );
        setReports(
          reportsList.sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
        );
      } else {
        setReports([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (
    reportId: string,
    newStatus: SecurityReport["status"]
  ) => {
    try {
      await update(ref(database, `Security/${reportId}`), {
        status: newStatus,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const getStatusBadgeClass = (status: SecurityReport["status"]) => {
    const baseClasses = "badge";
    switch (status) {
      case "new":
        return `${baseClasses} bg-danger`;
      case "in-progress":
        return `${baseClasses} bg-warning`;
      case "resolved":
        return `${baseClasses} bg-success`;
      case "dismissed":
        return `${baseClasses} bg-secondary`;
      default:
        return baseClasses;
    }
  };

  const filteredReports = reports.filter((report) =>
    filter === "all" ? true : report.status === filter
  );

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12 mb-4">
          <div className="card">
            <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-center bg-dark text-white">
              <h3 className="text-info m-0 mb-3 mb-md-0">Security Reports Management</h3>
              <div className="btn-group d-flex flex-wrap gap-1">
                <button
                  className={`btn btn-sm px-3 py-2 ${
                    filter === "all" ? "btn-primary" : "btn-outline-primary"
                  }`}
                  onClick={() => setFilter("all")}
                  title="Show All"
                >
                  <i className="bi bi-list-ul me-1"></i> All
                </button>

                <button
                  className={`btn btn-sm px-3 py-2 ${
                    filter === "new" ? "btn-danger" : "btn-outline-danger"
                  }`}
                  onClick={() => setFilter("new")}
                  title="Show New Items"
                >
                  <i className="bi bi-plus-circle me-1"></i> New
                </button>

                <button
                  className={`btn btn-sm px-3 py-2 ${
                    filter === "in-progress"
                      ? "btn-warning"
                      : "btn-outline-warning"
                  }`}
                  onClick={() => setFilter("in-progress")}
                  title="Show In Progress Items"
                >
                  <i className="bi bi-hourglass-split me-1"></i> In Progress
                </button>

                <button
                  className={`btn btn-sm px-3 py-2 ${
                    filter === "resolved"
                      ? "btn-success"
                      : "btn-outline-success"
                  }`}
                  onClick={() => setFilter("resolved")}
                  title="Show Resolved Items"
                >
                  <i className="bi bi-check-circle me-1"></i> Resolved
                </button>
              </div>
            </div>

            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Reporter</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReports.map((report) => (
                        <tr key={report.id}>
                          <td>
                            <span
                              className={getStatusBadgeClass(report.status)}
                            >
                              {report.status.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            {new Date(report.timestamp).toLocaleDateString()}
                          </td>
                          <td>{report.issue.type}</td>
                          <td>{report.reporter.name}</td>
                          <td>
                            <div
                              className="text-truncate"
                              style={{ maxWidth: "200px" }}
                            >
                              {report.issue.description}
                            </div>
                          </td>
                          <td>
                            <div className="btn-group">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => setSelectedReport(report)}
                              >
                                View Details
                              </button>
                              <button
                                className="btn btn-sm btn-outline-success"
                                onClick={() =>
                                  handleStatusChange(report.id, "resolved")
                                }
                              >
                                Mark Resolved
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedReport && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content bg-dark text-light">
              <div className="modal-header border-0">
                <h5 className="modal-title">Security Report Details</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedReport(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <Calendar size={18} className="me-2 text-info" />
                    <strong>Reported on:</strong>
                    <span className="ms-2">
                      {new Date(selectedReport.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <User size={18} className="me-2 text-info" />
                    <strong>Reporter:</strong>
                    <span className="ms-2">{selectedReport.reporter.name}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <Mail size={18} className="me-2 text-info" />
                    <strong>Email:</strong>
                    <span className="ms-2">
                      {selectedReport.reporter.email}
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <Shield size={18} className="me-2 text-info" />
                    <strong>Issue Type:</strong>
                    <span className="ms-2">{selectedReport.issue.type}</span>
                  </div>
                  <div className="mb-2">
                    <strong>Description:</strong>
                    <p className="mt-1">{selectedReport.issue.description}</p>
                  </div>
                  <div className="mb-2">
                    <strong>Steps to Reproduce:</strong>
                    <p className="mt-1">{selectedReport.issue.reproduction}</p>
                  </div>
                  <div className="mb-2">
                    <strong>Location:</strong>
                    <p className="mt-1">{selectedReport.issue.location}</p>
                  </div>
                  <div className="mb-2">
                    <strong>Potential Impact:</strong>
                    <p className="mt-1">
                      {selectedReport.issue.potentialImpact}
                    </p>
                  </div>
                  {selectedReport.issue.suggestedFix && (
                    <div className="mb-2">
                      <strong>Suggested Fix:</strong>
                      <p className="mt-1">
                        {selectedReport.issue.suggestedFix}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-warning  btn-sm"
                    onClick={() =>
                      handleStatusChange(selectedReport.id, "in-progress")
                    }
                  >
                    Mark In Progress
                  </button>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() =>
                      handleStatusChange(selectedReport.id, "resolved")
                    }
                  >
                    Mark Resolved
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() =>
                      handleStatusChange(selectedReport.id, "dismissed")
                    }
                  >
                    Dismiss
                  </button>
                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={() => setSelectedReport(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityManagement;
