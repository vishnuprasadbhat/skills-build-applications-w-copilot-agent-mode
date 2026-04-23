import React, { useCallback, useEffect, useState } from 'react';

const getApiBaseUrl = () => {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  if (codespaceName) {
    const url = `https://${codespaceName}-8000.app.github.dev`;
    console.log('[Leaderboard] API endpoint: https://' + codespaceName + '-8000.app.github.dev/api/leaderboard');
    return url;
  }
  console.log('[Leaderboard] Using local API base URL: http://localhost:8000');
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

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [filteredLeaders, setFilteredLeaders] = useState([]);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);

  const endpoint = `${getApiBaseUrl()}/api/leaderboard/`;

  const loadLeaders = useCallback(() => {
    console.log('[Leaderboard] Fetching from endpoint:', endpoint);
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        console.log('[Leaderboard] Fetched data:', data);
        const normalized = normalizeResponse(data);
        setLeaders(normalized);
        setFilteredLeaders(normalized);
      })
      .catch((fetchError) => {
        console.error('[Leaderboard] Fetch error:', fetchError);
        setError(fetchError.message || 'Unable to load leaderboard.');
      });
  }, [endpoint]);

  useEffect(() => {
    loadLeaders();
  }, [loadLeaders]);

  useEffect(() => {
    const query = search.toLowerCase();
    setFilteredLeaders(
      leaders.filter((item) => JSON.stringify(item).toLowerCase().includes(query))
    );
  }, [search, leaders]);

  const headers = leaders.length > 0 ? Object.keys(leaders[0]) : [];

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
        <div>
          <h2 className="h4 mb-1">Leaderboard</h2>
          <p className="text-muted mb-0">View leaderboard data from the REST API with consistent Bootstrap styling.</p>
        </div>
        <div className="btn-toolbar gap-2">
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={loadLeaders}>
            Refresh
          </button>
          <button type="button" className="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#leaderboardDetailModal">
            Details
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <form className="row g-2" onSubmit={(event) => event.preventDefault()}>
            <div className="col-md-8">
              <label htmlFor="leaderboardSearch" className="form-label visually-hidden">
                Search leaderboard
              </label>
              <input
                id="leaderboardSearch"
                className="form-control"
                placeholder="Search leaderboard..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="col-md-4 d-grid">
              <button type="button" className="btn btn-primary">
                Found {filteredLeaders.length}
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
              {filteredLeaders.length === 0 ? (
                <tr>
                  <td colSpan={headers.length + 1} className="text-center py-4 text-muted">
                    No leaderboard entries found.
                  </td>
                </tr>
              ) : (
                filteredLeaders.map((leader, index) => (
                  <tr key={leader.id || index}>
                    {headers.map((header) => (
                      <td key={header}>{formatCell(leader[header])}</td>
                    ))}
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        data-bs-toggle="modal"
                        data-bs-target="#leaderboardDetailModal"
                        onClick={() => setSelectedLeader(leader)}
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

      <div className="modal fade" id="leaderboardDetailModal" tabIndex="-1" aria-labelledby="leaderboardDetailModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="leaderboardDetailModalLabel">
                Leaderboard details
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <pre className="mb-0">{selectedLeader ? JSON.stringify(selectedLeader, null, 2) : 'Select a leaderboard entry to view details.'}</pre>
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

export default Leaderboard;
