let supabase = null;

// We avoid adding external libs. If Supabase env is provided, a typical project would import createClient from '@supabase/supabase-js'.
// Since we cannot add dependencies, we gracefully fallback to localStorage by returning null client.
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY;

// PUBLIC_INTERFACE
export function getSupabaseClient() {
  /**
   * Returns a Supabase client if environment variables are set and the SDK is available,
   * otherwise returns null to indicate offline/local mode.
   *
   * Note: This template does not install '@supabase/supabase-js' per constraints.
   * If you add it in your environment, you can initialize here:
   *   import { createClient } from '@supabase/supabase-js';
   *   supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
   */
  if (supabase) {
    return supabase;
  }

  // If env vars are missing, warn once and operate in offline mode.
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    if (typeof console !== 'undefined') {
      const missing = [
        !SUPABASE_URL ? 'REACT_APP_SUPABASE_URL' : null,
        !SUPABASE_KEY ? 'REACT_APP_SUPABASE_KEY' : null,
      ].filter(Boolean).join(', ');
      console.warn(
        `[supabaseClient] Missing environment variables (${missing}). Running in offline/localStorage mode.`
      );
    }
    return null;
  }

  // SDK not installed in this template; return null to signal offline mode.
  // To enable Supabase, add '@supabase/supabase-js' and initialize here.
  return null;
}

export default getSupabaseClient;
