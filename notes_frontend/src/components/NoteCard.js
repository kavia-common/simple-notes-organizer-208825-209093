import React from 'react';

// PUBLIC_INTERFACE
function NoteCard({ note, selected, onSelect, onQuickEdit, onQuickDelete }) {
  /** Card row for a single note in the list. */
  return (
    <div
      className={`note-card ${selected ? 'selected' : ''}`}
      role="option"
      aria-selected={selected}
      onClick={onSelect}
    >
      <div className="title">{note.title || '(Untitled)'}</div>
      <div className="meta small">
        <span>Updated {new Date(note.updated_at).toLocaleString()}</span>
        <div className="actions" onClick={(e) => e.stopPropagation()}>
          <button className="btn btn-ghost" onClick={onQuickEdit} aria-label="Edit note">✏️</button>
          <button className="btn btn-ghost" onClick={onQuickDelete} aria-label="Delete note">🗑</button>
        </div>
      </div>
    </div>
  );
}

export default NoteCard;
