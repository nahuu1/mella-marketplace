// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://iwjvjburjnslwwcoqlhp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3anZqYnVyam5zbHd3Y29xbGhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2OTE1NjgsImV4cCI6MjA1NzI2NzU2OH0.WGtpwqHLB0W_1rDC1IyCI_8FoD8oilJacKnc64pSX04";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);