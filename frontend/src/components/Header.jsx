import ThemeToggle from "./ThemeToggle";

function Header() {
  return (
    <header className="header">
      <div>
        <h1>ServerPulse</h1>
        <p>Infrastructure monitoring dashboard</p>
      </div>

      <div className="header-actions">
        <div className="header-status">
          <span className="status-dot" />
          Backend connected
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}

export default Header;
