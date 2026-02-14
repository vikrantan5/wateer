import { useEffect, useState } from "react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/reports`);
      const data = await response.json();
      setReports(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/reports/${id}?status=${status}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        fetchReports(); // reload reports
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="reports-container">
      <h2>Water Quality Reports</h2>

      {loading ? (
        <p>Loading reports...</p>
      ) : reports.length === 0 ? (
        <p>No reports found</p>
      ) : (
        <div className="reports-list">
          {reports.map((report) => (
            <div key={report.id} className="report-card" style={{ 
              border: "1px solid #ddd", 
              padding: "15px", 
              marginBottom: "15px",
              borderRadius: "8px",
              backgroundColor: "#fff"
            }}>
              <h4>{report.title}</h4>
              <p>{report.description}</p>
              <p><b>Status:</b> <span style={{
                color: report.status === 'approved' ? 'green' : report.status === 'rejected' ? 'red' : 'orange',
                textTransform: 'capitalize'
              }}>{report.status}</span></p>

              {report.status === "pending" && (
                <div style={{marginTop: '10px'}}>
                  <button 
                    onClick={() => updateStatus(report.id, "approved")}
                    style={{
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      padding: '8px 16px',
                      marginRight: '10px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => updateStatus(report.id, "rejected")}
                    style={{
                      backgroundColor: '#f44336',
                      color: 'white',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Reports;
