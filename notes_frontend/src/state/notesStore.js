import React, { createContext, useContext, useMemo, useReducer } from 'react';
import notesService from '../services/notesService';

const NotesContext = createContext(null);

const initialState = {
  notes: [],
  filtered: [],
  selectedId: null,
  filter: '',
  loading: false,
  error: null,
};

function applyFilter(notes, filter) {
  const f = (filter || '').toLowerCase().trim();
  if (!f) return [...notes];
  return notes.filter(
    (n) =>
      (n.title || '').toLowerCase().includes(f) ||
      (n.content || '').toLowerCase().includes(f)
  );
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'INIT_LOAD': {
      const notes = action.payload || [];
      const filtered = applyFilter(notes, state.filter);
      const selectedId = notes[0]?.id || null;
      return { ...state, notes, filtered, selectedId, loading: false, error: null };
    }
    case 'SET_FILTER': {
      const filter = action.payload || '';
      const filtered = applyFilter(state.notes, filter);
      return { ...state, filter, filtered };
    }
    case 'SELECT_NOTE':
      return { ...state, selectedId: action.payload || null };
    case 'CREATE_NOTE': {
      const notes = [action.payload, ...state.notes];
      const filtered = applyFilter(notes, state.filter);
      return { ...state, notes, filtered, selectedId: action.payload.id };
    }
    case 'UPDATE_NOTE': {
      const notes = state.notes.map((n) => (n.id === action.payload.id ? { ...n, ...action.payload.data } : n));
      const filtered = applyFilter(notes, state.filter);
      return { ...state, notes, filtered };
    }
    case 'DELETE_NOTE': {
      const notes = state.notes.filter((n) => n.id !== action.payload);
      const filtered = applyFilter(notes, state.filter);
      const selectedId = state.selectedId === action.payload ? (notes[0]?.id || null) : state.selectedId;
      return { ...state, notes, filtered, selectedId };
    }
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function NotesProvider({ children }) {
  /** React context provider wiring reducer and exposing actions. */
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

// PUBLIC_INTERFACE
export function useNotesStore() {
  /** Accessor to NotesContext with guard. */
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotesStore must be used within NotesProvider');
  return ctx;
}

export default NotesContext;
