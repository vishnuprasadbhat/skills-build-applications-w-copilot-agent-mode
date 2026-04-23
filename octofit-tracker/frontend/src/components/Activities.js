import React, { useCallback, useEffect, useState } from 'react';

const getApiBaseUrl = () => {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  if (codespaceName) {
    const url = `https://${codespaceName}-8000.app.github.dev`;
    console.log('[Activities] Using codespace API base URL:', url);
    return url;
  }
  console.log('[Activities] Using local API base URL: http://localhost:8000');
  return 'http://localhost:8000';
};

const normalizeResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
};

const formatCell = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return value.toString();
};

function Activities() {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);

  const endpoint = `${getApiBaseUrl()}/api/activities/`;

  const loadActivities = useCallback(() => {
    console.log('[Activities] Fetching from endpoint:', endpoint);
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        console.log('[Activities] Fetched data:', data);
        const normalized = normalizeResponse(data);
        setActivities(normalized);
        setFilteredActivities(normalized);
      })
      .catch((fetchError) => {
        console.error('[Activities] Fetch error:', fetchError);
        setError(fetchError.message || 'Unable to load activities.');
      });
  }, [endpoint]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  useEffect(() => {
    const query = search.toLowerCase();
    setFilteredActivities(
      activities.filter((item) => JSON.stringify(item).toLowerCase().includes(query))
    );
  }, [search, activities]);

  const headers = activities.length > 0 ? Object.keys(activities[0]) : [];

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
        <div>
          <h2 className="h4 mb-1">Activities</h2>
          <p className="text-muted mb-0">Data is fetched from the backend REST API and displayed in a Bootstrap table.</p>
        </div>
        <div className="btn-toolbar gap-2">
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={loadActivities}>
            Refresh
          </button>
          <button type="button" className="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#activitiesDetailModal">
            Details
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <form className="row g-2" onSubmit={(event) => event.preventDefault()}>
            <div className="col-md-8">
              <label htmlFor="activitiesSearch" className="form-label visually-hidden">
                Search activities
              </label>
              <input
                id="activitiesSearch"
                className="form-control"
                placeholder="Search activities..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="col-md-4 d-grid">
              <button type="button" className="btn btn-primary">
                Found {filteredActivities.length}
              </button>
            </div>
          </form>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle mb-0">
            <thead className="table-primary">
              <tr>
                {headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={headers.length + 1} className="text-center py-4 text-muted">
                    No activities found.
                  </td>
                </tr>
              ) : (
                filteredActivities.map((activity, index) => (
                  <tr key={activity.id || index}>
                    {headers.map((header) => (
                      <td key={header}>{formatCell(activity[header])}</td>
                    ))}
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        data-bs-toggle="modal"
                        data-bs-target="#activitiesDetailModal"
                        onClick={() => setSelectedActivity(activity)}
                      >
                        View JSON
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="modal fade" id="activitiesDetailModal" tabIndex="-1" aria-labelledby="activitiesDetailModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="activitiesDetailModalLabel">
                Activity details
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <pre className="mb-0">{selectedActivity ? JSON.stringify(selectedActivity, null, 2) : 'Select an activity to view details.'}</pre>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Activities;
