

const RecentSessions = ({ sessions }) => {
  if (!sessions || sessions.length === 0) return null;

  return (
    <div className="recent-sessions-card">
      <h3>Recent Sessions</h3>
      <table className="sessions-table">
        <thead>
          <tr>
            <th>Session name</th>
            <th>Puzzle</th>
            <th>Best Time</th>
            <th>A05</th>
            <th>A012</th>
            <th>Mean</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((row, i) => (
            <tr key={i}>
              <td>{row.name}</td>
              <td>3 x 3 WCA</td> {/* Hardcoded puzzle type for now to match UI visually */}
              <td>{row.best}s</td>
              <td>{row.ao5}{row.ao5 !== '--' && 's'}</td>
              <td>{row.ao12}{row.ao12 !== '--' && 's'}</td>
              <td>{row.mean}s</td>
              <td>{row.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentSessions;
