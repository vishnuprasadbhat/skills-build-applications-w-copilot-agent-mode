import React, { useCallback, useEffect, useState } from 'react';

const getApiBaseUrl = () => {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  if (codespaceName) {
    const url = `https://${codespaceName}-8000.app.github.dev`;
    console.log('[Users] Using codespace API base URL:', url);
    return url;
  }
  console.log('[Users] Using local API base URL: http://localhost:8000');
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

function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);

  const endpoint = `${getApiBaseUrl()}/api/users/`;

  const loadUsers = useCallback(() => {
    console.log('[Users] Fetching from endpoint:', endpoint);
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        console.log('[Users] Fetched data:', data);
        const normalized = normalizeResponse(data);
        setUsers(normalized);
        setFilteredUsers(normalized);
      })
      .catch((fetchError) => {
        console.error('[Users] Fetch error:', fetchError);
        setError(fetchError.message || 'Unable to load users.');
      });
  }, [endpoint]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    const query = search.toLowerCase();
    setFilteredUsers(
      users.filter((item) => JSON.stringify(item).toLowerCase().includes(query))
    );
  }, [search, users]);

  const headers = users.length > 0 ? Object.keys(users[0]) : [];

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
        <div>
          <h2 className="h4 mb-1">Users</h2>
          <p className="text-muted mb-0">Browse user records from the backend API using a Bootstrap table layout.</p>
        </div>
        <div className="btn-toolbar gap-2">
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={loadUsers}>
            Refresh
          </button>
          <button type="button" className="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#usersDetailModal">
            Details
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <form className="row g-2" onSubmit={(event) => event.preventDefault()}>
            <div className="col-md-8">
              <label htmlFor="usersSearch" className="form-label visually-hidden">
                Search users
              </label>
              <input
                id="usersSearch"
                className="form-control"
                placeholder="Search users..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="col-md-4 d-grid">
              <button type="button" className="btn btn-primary">
                Found {filteredUsers.length}
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
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={headers.length + 1} className="text-center py-4 text-muted">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user.id || index}>
                    {headers.map((header) => (
                      <td key={header}>{formatCell(user[header])}</td>
                    ))}
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        data-bs-toggle="modal"
                        data-bs-target="#usersDetailModal"
                        onClick={() => setSelectedUser(user)}
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

      <div className="modal fade" id="usersDetailModal" tabIndex="-1" aria-labelledby="usersDetailModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="usersDetailModalLabel">
                User details
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <pre className="mb-0">{selectedUser ? JSON.stringify(selectedUser, null, 2) : 'Select a user to view details.'}</pre>
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

export default Users;
