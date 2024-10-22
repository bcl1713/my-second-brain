"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Note } from "@/types/Note";

export default function EditNotePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [tags, setTags] = useState<string>(""); // Handle tags as a string for input
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNote = async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        setError("Note not found.");
      } else {
        setNote(data as Note);
        setTags((data.tags || []).join(", ")); // Convert tags array to a comma-separated string
      }
    };

    fetchNote();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!note) return;

    // Prepare updated note data
    const updatedNote = {
      ...note,
      tags: tags.split(",").map((tag) => tag.trim()), // Convert tags string back to an array
    };

    const { error } = await supabase
      .from("notes")
      .update(updatedNote)
      .eq("id", note.id);

    if (error) {
      setError("Failed to update the note");
    } else {
      router.push(`/notes/${note.id}`);
    }
  };

  if (!note) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Note</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Title
        </label>
        <input
          type="text"
          value={note.title || ""}
          onChange={(e) => setNote({ ...note, title: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Content
        </label>
        <textarea
          value={note.content || ""}
          onChange={(e) => setNote({ ...note, content: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded"
          rows={5}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Summary
        </label>
        <input
          type="text"
          value={note.summary || ""}
          onChange={(e) => setNote({ ...note, summary: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Save Changes
      </button>
    </form>
  );
}
