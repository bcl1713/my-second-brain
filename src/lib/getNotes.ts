import { supabase } from './supabase';

// Fetch all notes from Supabase
export async function getAllNotes() {
  const { data, error } = await supabase
    .from('notes')
    .select('id, title')
    .order('date', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

// Fetch a specific note by ID
export async function getNoteById(id: string) {
  const { data, error } = await supabase
    .from('notes')
    .select('title, content, date, tags, summary')
    .eq('id', id)
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching note:', error);
    return null
  }

  return {
    id,
    contentHtml: data.content, // For now, we return the raw Markdown, but will convert to HTML later
    title: data.title,
    date: data.date,
    tags: data.tags,
    summary: data.summary,
  };
}

