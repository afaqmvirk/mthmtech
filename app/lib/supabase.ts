import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cizgbdhddilfdckvlkiw.supabase.co';
const supabaseKey = 'sb_publishable_nfP9RBx1dvST4ohUBJFh9w_MXB-ZGBu';

export const supabase = createClient(supabaseUrl, supabaseKey);
