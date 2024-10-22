import { supabase } from "@/lib/supabase";

// Function to extract references from content
export const extractReferences = (content: string): string[] => {
  const linkRegex = /\[\[(.+?)\]\]/g;
  const matches = Array.from(content.matchAll(linkRegex)); // Convert the iterator to an array
  return matches.map((match) => match[1]);
};

// Function to fetch a note by its ID
export const fetchNoteById = async (id: string) => {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error("Note not found");
  }
  return data;
};

// Function to save backlinks for a note
export const saveBacklinks = async (noteId: string, references: string[]) => {
  try {
    // For each referenced note, add backlink to the current note
    for (const referencedId of references) {
      const { data, error } = await supabase
        .from("notes")
        .select("backlinks")
        .eq("id", referencedId)
        .single();

      if (!error && data) {
        const backlinks = data.backlinks || [];
        if (!backlinks.includes(noteId)) {
          backlinks.push(noteId);
          await supabase
            .from("notes")
            .update({ backlinks })
            .eq("id", referencedId);
        }
      }
    }
  } catch (e) {
    console.error("Failed to save backlinks", e);
  }
};
