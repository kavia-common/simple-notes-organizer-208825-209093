import React, { useEffect, useMemo, useState } from 'react';
import './index.css';
import './App.css';
import TopBar from './components/TopBar';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';
import Modal from './components/Modal';
import { NotesProvider } from './state/notesStore';
import useNotes from './hooks/useNotes';

/*
README: Supabase schema and setup notes

SQL reference:
  create table public.notes (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    content text default '',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
  );
  -- optional trigger if available in the project:
  -- create function trigger_set_timestamp() returns trigger as $$ begin new.updated_at = now(); return new; end; $$ language plpgsql;
  -- create trigger set_timestamp before update on public.notes for each row execute procedure trigger_set_timestamp();

Environment:
  - REACT_APP_SUPABASE_URL
  - REACT_APP_SUPABASE_KEY

When these variables are not provided, the app runs fully offline using localStorage with key 'notes.offline'.
*/

function InnerAppShell() {
  const {
    state,
    initLoad,
    setFilter,
    selectNote,
    createNote,
    updateNote,
    deleteNote
  } = useNotes();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  // Load notes on mount
  useEffect(() => {
    initLoad();
  }, [initLoad]);

  const selectedNote = useMemo(
    () => state.notes.find(n => n.id === state.selectedId) || null,
    [state.notes, state.selectedId]
  );

  const onConfirmCreate = async () => {
    const title = newTitle.trim();
    if (!title) {
      setIsCreateModalOpen(false);
      setNewTitle('');
      return;
    }
    await createNote({ title, content: '' });
    setIsCreateModalOpen(false);
    setNewTitle('');
  };

  return (
    <div className="app-shell">
      <TopBar
        onAdd={() => setIsCreateModalOpen(true)}
      />
      <div className="content container">
        <div className="sidebar">
          <div className="search">
            <span aria-hidden="true" role="img">🔎</span>
            <input
              className="input"
              type="text"
              placeholder="Search notes..."
              value={state.filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Search notes"
            />
          </div>
          <div className="list card" role="list" aria-label="Notes list">
            <NotesList
              notes={state.filtered}
              selectedId={state.selectedId}
              onSelect={selectNote}
              onQuickEdit={(id) => selectNote(id)}
              onQuickDelete={(id) => deleteNote(id)}
              loading={state.loading}
            />
          </div>
        </div>
        <div className="editor card" role="region" aria-label="Note editor">
          {selectedNote ? (
            <>
              <div className="editor-header">
                <input
                  className="input"
                  placeholder="Title"
                  value={selectedNote.title}
                  onChange={(e) =>
                    updateNote(selectedNote.id, { title: e.target.value }, { optimistic: true })
                  }
                  onBlur={() => updateNote(selectedNote.id, null)}
                  aria-label="Note title"
                />
                <div className="small" style={{ marginLeft: 'auto' }}>
                  Created: {new Date(selectedNote.created_at).toLocaleString()} • Updated: {new Date(selectedNote.updated_at).toLocaleString()}
                </div>
                <button
                  className="btn"
                  onClick={() => updateNote(selectedNote.id, null)}
                  aria-label="Save note"
                  title="Save"
                >
                  💾 Save
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => deleteNote(selectedNote.id, { confirm: true })}
                  aria-label="Delete note"
                  title="Delete"
                >
                  🗑 Delete
                </button>
              </div>
              <div className="editor-body">
                <textarea
                  className="textarea"
                  placeholder="Write your note..."
                  value={selectedNote.content}
                  onChange={(e) =>
                    updateNote(selectedNote.id, { content: e.target.value }, { optimistic: true })
                  }
                  onBlur={() => updateNote(selectedNote.id, null)}
                  aria-label="Note content"
                />
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div>
                <div className="muted">No note selected</div>
                <div className="small">Choose a note from the left or create a new one.</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={isCreateModalOpen}
        title="Create a new note"
        onClose={() => setIsCreateModalOpen(false)}
        onConfirm={onConfirmCreate}
        confirmText="Create"
        cancelText="Cancel"
      >
        <label className="small" htmlFor="new-note-title">Title</label>
        <input
          id="new-note-title"
          className="input"
          placeholder="Quick title..."
          autoFocus
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onConfirmCreate();
            }
          }}
        />
      </Modal>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** App entry that wires the NotesProvider and inner shell. */
  return (
    <NotesProvider>
      <InnerAppShell />
    </NotesProvider>
  );
}

export default App;
