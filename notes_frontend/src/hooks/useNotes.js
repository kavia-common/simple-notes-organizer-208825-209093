import { useCallback } from 'react';
import { useNotesStore } from '../state/notesStore';
import notesService from '../services/notesService';

// PUBLIC_INTERFACE
export default function useNotes() {
  /** Custom hook exposing store state and CRUD actions with optimistic updates. */
  const { state, dispatch } = useNotesStore();

  const initLoad = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const notes = await notesService.listNotes();
      dispatch({ type: 'INIT_LOAD', payload: notes });
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e?.message || 'Failed to load notes' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  const setFilter = useCallback((value) => {
    dispatch({ type: 'SET_FILTER', payload: value });
  }, [dispatch]);

  const selectNote = useCallback((id) => {
    dispatch({ type: 'SELECT_NOTE', payload: id });
  }, [dispatch]);

  const createNote = useCallback(async ({ title, content }) => {
    // optimistic: create a temp note
    const temp = {
      id: `temp-${Date.now()}`,
      title: title || '',
      content: content || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dispatch({ type: 'CREATE_NOTE', payload: temp });
    try {
      const created = await notesService.createNote({ title, content });
      // replace temp with real
      dispatch({
        type: 'DELETE_NOTE',
        payload: temp.id,
      });
      dispatch({
        type: 'CREATE_NOTE',
        payload: created,
      });
    } catch (e) {
      dispatch({ type: 'DELETE_NOTE', payload: temp.id });
      dispatch({ type: 'SET_ERROR', payload: e?.message || 'Failed to create note' });
    }
  }, [dispatch]);

  const updateNote = useCallback(async (id, fields, options = {}) => {
    const note = state.notes.find((n) => n.id === id);
    if (!note) return;

    const optimistic = options.optimistic;
    let newData = {};
    if (fields) {
      newData = { ...fields, updated_at: new Date().toISOString() };
      if (optimistic) {
        dispatch({ type: 'UPDATE_NOTE', payload: { id, data: newData } });
      }
    }
    try {
      if (!fields) {
        // treat as save current store version
        const current = state.notes.find((n) => n.id === id);
        await notesService.updateNote(id, { title: current.title, content: current.content });
      } else {
        await notesService.updateNote(id, fields);
      }
      // If not optimistic, refresh exact updated fields
      if (!optimistic && fields) {
        dispatch({ type: 'UPDATE_NOTE', payload: { id, data: { ...fields, updated_at: new Date().toISOString() } } });
      }
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e?.message || 'Failed to update note' });
    }
  }, [dispatch, state.notes]);

  const deleteNote = useCallback(async (id, options = {}) => {
    if (options.confirm) {
      const yes = window.confirm('Delete this note?');
      if (!yes) return;
    }
    // optimistic delete
    const backup = state.notes.find((n) => n.id === id);
    dispatch({ type: 'DELETE_NOTE', payload: id });
    try {
      await notesService.deleteNote(id);
    } catch (e) {
      // revert
      if (backup) {
        dispatch({ type: 'CREATE_NOTE', payload: backup });
      }
      dispatch({ type: 'SET_ERROR', payload: e?.message || 'Failed to delete note' });
    }
  }, [dispatch, state.notes]);

  return {
    state: {
      ...state,
      // derived filtered list is already stored in state.filtered
    },
    initLoad,
    setFilter,
    selectNote,
    createNote,
    updateNote,
    deleteNote,
  };
}
