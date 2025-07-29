import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qllxnvkwkxdghlexyrnr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsbHhudmt3a3hkZ2hsZXh5cm5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MDM0MzIsImV4cCI6MjA2NTI3OTQzMn0._7gAj53uIsOPIGdJFYuAEH8qOsoPzTmYBPlBipr6mMo"
);

export { supabase };
