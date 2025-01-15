import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://odpdzsilykpoghnlmdgc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kcGR6c2lseWtwb2dobmxtZGdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4OTAwODgsImV4cCI6MjA1MjQ2NjA4OH0.biu_8eoqtMdC_pFAf4tXggYMonU25aPPh6JteHpF9DM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
