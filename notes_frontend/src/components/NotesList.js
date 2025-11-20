import React from 'react';
import NoteCard from './NoteCard';

// PUBLIC_INTERFACE
function NotesList({ notes, selectedId, onSelect, onQuickEdit, onQuickDelete, loading }) {
  /** Renders the list of notes with selection and quick actions. */
  if (loading && (!notes || notes.length === 0)) {
    return (
      <div className="note-card">
        <div className="muted">Loading notes…</div>
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="note-card">
        <div className="muted">No notes found</div>
      </div>
    );
  }

  return (
    <div role="listbox" aria-label="Notes">
      {notes.map((n) => (
        <NoteCard
          key={n.id}
          note={n}
          selected={n.id === selectedId}
          onSelect={() => onSelect(n.id)}
          onQuickEdit={() => onQuickEdit(n.id)}
          onQuickDelete={() => onQuickDelete(n.id)}
        />
      ))}
    </div>
  );
}

export default NotesList;
