import React from 'react';

// PUBLIC_INTERFACE
function NoteEditor({ note, onChange, onSave, onDelete }) {
  /** Full note editor with title/content and actions. Not directly used; inline editing is in App shell. */
  if (!note) {
    return (
      <div className="empty-state">
        <div>
          <div className="muted">No note selected</div>
          <div className="small">Choose a note from the left or create a new one.</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="editor-header">
        <input
          className="input"
          placeholder="Title"
          value={note.title}
          onChange={(e) => onChange({ title: e.target.value })}
          onBlur={onSave}
          aria-label="Note title"
        />
        <div className="small" style={{ marginLeft: 'auto' }}>
          Created: {new Date(note.created_at).toLocaleString()} • Updated: {new Date(note.updated_at).toLocaleString()}
        </div>
        <button className="btn" onClick={onSave} aria-label="Save note">💾 Save</button>
        <button className="btn btn-ghost" onClick={onDelete} aria-label="Delete note">🗑 Delete</button>
      </div>
      <div className="editor-body">
        <textarea
          className="textarea"
          placeholder="Write your note..."
          value={note.content}
          onChange={(e) => onChange({ content: e.target.value })}
          onBlur={onSave}
          aria-label="Note content"
        />
      </div>
    </>
  );
}

export default NoteEditor;
