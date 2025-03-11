
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = 'https://iwjvjburjnslwwcoqlhp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3anZqYnVyam5zbHd3Y29xbGhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2OTE1NjgsImV4cCI6MjA1NzI2NzU2OH0.WGtpwqHLB0W_1rDC1IyCI_8FoD8oilJacKnc64pSX04';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
