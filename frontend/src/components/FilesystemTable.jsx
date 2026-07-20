function formatKilobytes(value) {
  const kilobytes = Number(value);

  if (!Number.isFinite(kilobytes) || kilobytes <= 0) {
    return "0 B";
  }

  const bytes = kilobytes * 1024;
  const units = ["B", "KB", "MB", "GB", "TB"];

  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  const amount = bytes / 1024 ** index;

  return `${amount.toFixed(index === 0 ? 0 : 2)} ${
    units[index]
  }`;
}

function FilesystemTable({ filesystems = [] }) {
  return (
    <section className="details-card">
      <div className="card-heading-row">
        <div>
          <h3>Filesystems</h3>
          <p>Disk usage by mounted filesystem</p>
        </div>
      </div>

      {filesystems.length === 0 ? (
        <div className="empty-state">
          No filesystem information is available.
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="filesystem-table">
            <thead>
              <tr>
                <th>Filesystem</th>
                <th>Mount point</th>
                <th>Total</th>
                <th>Used</th>
                <th>Available</th>
                <th>Usage</th>
              </tr>
            </thead>

            <tbody>
              {filesystems.map((filesystem) => (
                <tr
                  key={`${filesystem.filesystem}-${filesystem.mountPoint}`}
                >
                  <td>{filesystem.filesystem}</td>
                  <td>{filesystem.mountPoint}</td>
                  <td>
                    {formatKilobytes(filesystem.totalKb)}
                  </td>
                  <td>
                    {formatKilobytes(filesystem.usedKb)}
                  </td>
                  <td>
                    {formatKilobytes(
                      filesystem.availableKb
                    )}
                  </td>
                  <td>
                    <div className="usage-cell">
                      <span>
                        {filesystem.usagePercent}%
                      </span>

                      <div className="usage-bar">
                        <div
                          className={`usage-bar-fill ${
                            filesystem.usagePercent >= 85
                              ? "usage-danger"
                              : filesystem.usagePercent >=
                                  70
                                ? "usage-warning"
                                : ""
                          }`}
                          style={{
                            width: `${Math.min(
                              filesystem.usagePercent,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default FilesystemTable;
