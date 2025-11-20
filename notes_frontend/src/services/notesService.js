import { getSupabaseClient } from './supabaseClient';

const LOCAL_KEY = 'notes.offline';

function readLocal() {
  try {
    const s = localStorage.getItem(LOCAL_KEY);
    if (!s) return [];
    const arr = JSON.parse(s);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function writeLocal(arr) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(arr));
  } catch {
    // ignore
  }
}

function nowISO() {
  return new Date().toISOString();
}

function uuid4() {
  // Basic RFC4122-ish generator for offline mode
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

/**
 */
// PUBLIC_INTERFACE
const notesService = {
  /** List notes ordered by updated_at desc */
  async listNotes() {
    const client = getSupabaseClient();
    if (client) {
      // If you wire Supabase SDK here, implement:
      // const { data, error } = await client.from('notes').select('*').order('updated_at', { ascending: false });
      // if (error) throw error;
      // return data;
    }
    // localStorage fallback
    const data = readLocal().sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    return data;
  },

  /** Create a note with title and optional content */
  async createNote({ title, content = '' }) {
    const client = getSupabaseClient();
    const newNote = {
      id: uuid4(),
      title: title || '',
      content: content || '',
      created_at: nowISO(),
      updated_at: nowISO(),
    };

    if (client) {
      // Supabase path if SDK is present:
      // const { data, error } = await client.from('notes').insert({ title, content }).select('*').single();
      // if (error) throw error;
      // return data;
    }

    const list = readLocal();
    list.unshift(newNote);
    writeLocal(list);
    return newNote;
  },

  /** Get a note by id */
  async getNote(id) {
    const client = getSupabaseClient();
    if (client) {
      // const { data, error } = await client.from('notes').select('*').eq('id', id).single();
      // if (error) throw error;
      // return data;
    }
    const list = readLocal();
    return list.find((n) => n.id === id) || null;
  },

  /** Update a note by id with partial fields {title?, content?} */
  async updateNote(id, data) {
    const client = getSupabaseClient();
    if (client) {
      // const payload = { ...data, updated_at: new Date().toISOString() };
      // const { data: upd, error } = await client.from('notes').update(payload).eq('id', id).select('*').single();
      // if (error) throw error;
      // return upd;
    }
    const list = readLocal();
    const idx = list.findIndex((n) => n.id === id);
    if (idx === -1) return null;
    const updated = {
      ...list[idx],
      ...data,
      updated_at: nowISO(),
    };
    list[idx] = updated;
    writeLocal(list);
    return updated;
  },

  /** Delete a note by id */
  async deleteNote(id) {
    const client = getSupabaseClient();
    if (client) {
      // const { error } = await client.from('notes').delete().eq('id', id);
      // if (error) throw error;
      // return true;
    }
    const list = readLocal();
    const next = list.filter((n) => n.id !== id);
    writeLocal(next);
    return true;
  },
};

export default notesService;
