import { supabase } from "./supabase";

// Fetch all notes from Supabase
export async function getAllNotes() {
  const { data, error } = await supabase
    .from("notes")
    .select("id, title")
    .order("date", { ascending: false });
  return { data, error };
}

// Fetch a specific note by ID
export async function getNoteById(id: string) {
  const { data, error } = await supabase
    .from("notes")
    .select("title, content, date, tags, summary")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return {
    contentHtml: data.content,
    date: data.date,
    id,
    summary: data.summary,
    tags: data.tags,
    title: data.title,
  };
}
