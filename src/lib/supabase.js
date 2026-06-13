import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mrvdiukyreakulguqeno.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ydmRpdWt5cmVha3VsZ3VxZW5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MTY2MzUsImV4cCI6MjA5NjQ5MjYzNX0.UV9gObhCpXUYuVwy7ocDWpM0BqygYtTwrDUNBnsxWRQ";

export const supabase = createClient(supabaseUrl, supabaseKey);
