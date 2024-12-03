import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://oaxwhnwsobcmmvjqgnbx.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9heHdobndzb2JjbW12anFnbmJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxNjk1OTQsImV4cCI6MjA0ODc0NTU5NH0.te6X98qotmeIH0AM9N0pLnEZMoImLxlgpBdaoLVzh2s";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
