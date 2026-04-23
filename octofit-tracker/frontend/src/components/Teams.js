import React, { useCallback, useEffect, useState } from 'react';

const getApiBaseUrl = () => {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  if (codespaceName) {
    const url = `https://${codespaceName}-8000.app.github.dev`;
    console.log('[Teams] Using codespace API base URL:', url);
    return url;
  }
  console.log('[Teams] Using local API base URL: http://localhost:8000');
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

function Teams() {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);

  const endpoint = `${getApiBaseUrl()}/api/teams/`;

  const loadTeams = useCallback(() => {
    console.log('[Teams] Fetching from endpoint:', endpoint);
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        console.log('[Teams] Fetched data:', data);
        const normalized = normalizeResponse(data);
        setTeams(normalized);
        setFilteredTeams(normalized);
      })
      .catch((fetchError) => {
        console.error('[Teams] Fetch error:', fetchError);
        setError(fetchError.message || 'Unable to load teams.');
      });
  }, [endpoint]);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  useEffect(() => {
    const query = search.toLowerCase();
    setFilteredTeams(
      teams.filter((item) => JSON.stringify(item).toLowerCase().includes(query))
    );
  }, [search, teams]);

  const headers = teams.length > 0 ? Object.keys(teams[0]) : [];

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
        <div>
          <h2 className="h4 mb-1">Teams</h2>
          <p className="text-muted mb-0">Browse team data from the backend API with Bootstrap styling.</p>
        </div>
        <div className="btn-toolbar gap-2">
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={loadTeams}>
            Refresh
          </button>
          <button type="button" className="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#teamsDetailModal">
            Details
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <form className="row g-2" onSubmit={(event) => event.preventDefault()}>
            <div className="col-md-8">
              <label htmlFor="teamsSearch" className="form-label visually-hidden">
                Search teams
              </label>
              <input
                id="teamsSearch"
                className="form-control"
                placeholder="Search teams..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="col-md-4 d-grid">
              <button type="button" className="btn btn-primary">
                Found {filteredTeams.length}
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
              {filteredTeams.length === 0 ? (
                <tr>
                  <td colSpan={headers.length + 1} className="text-center py-4 text-muted">
                    No teams found.
                  </td>
                </tr>
              ) : (
                filteredTeams.map((team, index) => (
                  <tr key={team.id || index}>
                    {headers.map((header) => (
                      <td key={header}>{formatCell(team[header])}</td>
                    ))}
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        data-bs-toggle="modal"
                        data-bs-target="#teamsDetailModal"
                        onClick={() => setSelectedTeam(team)}
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

      <div className="modal fade" id="teamsDetailModal" tabIndex="-1" aria-labelledby="teamsDetailModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="teamsDetailModalLabel">
                Team details
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <pre className="mb-0">{selectedTeam ? JSON.stringify(selectedTeam, null, 2) : 'Select a team to view details.'}</pre>
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

export default Teams;
