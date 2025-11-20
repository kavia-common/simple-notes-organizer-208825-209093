import React, { useEffect, useState } from 'react';
import { getInitialTheme, saveThemePreference, applyThemeToDocument } from '../utils/env';

// PUBLIC_INTERFACE
function TopBar({ onAdd }) {
  /** Top application bar with title, Add Note button, and Theme Toggle. */
  const [theme, setTheme] = useState(getInitialTheme());

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    saveThemePreference(next);
  };

  return (
    <div className="topbar">
      <div className="brand">
        <h1>Simple Notes</h1>
        <span className="badge">Ocean Professional</span>
      </div>
      <div className="actions">
        <button className="btn btn-secondary" onClick={onAdd} aria-label="Add Note">
          ➕ Add Note
        </button>
        <button
          className="btn btn-ghost"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          title="Toggle theme"
          style={{ marginLeft: 8 }}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
    </div>
  );
}

export default TopBar;
