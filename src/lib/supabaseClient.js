import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yjimnfjuznofbicdgnpf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqaW1uZmp1em5vZmJpY2RnbnBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NDMzMzIsImV4cCI6MjA2MTQxOTMzMn0.0GykVEFAtvB97yKgz3yqsdw_lGR8GHmtD87YQcEgFgM';

export const supabase = createClient(supabaseUrl, supabaseKey);