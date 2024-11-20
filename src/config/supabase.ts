import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ngncpouswzrmselykcgd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nbmNwb3Vzd3pybXNlbHlrY2dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIwODIwNTIsImV4cCI6MjA0NzY1ODA1Mn0.EOjjASxnaDBoI84YtgU5Ku93NdE0iIB3SWzMxJ0yFow'

export const supabase = createClient(supabaseUrl, supabaseKey)