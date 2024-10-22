"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Note } from "@/types/Note";

export default function EditNotePage({ params }: { params: { id: string } }) {
  const noteId = params.id;
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch the note by id
    const fetchNote = async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("id, title, content, date, tags, summary")
        .eq("id", noteId)
        .single();

      if (error) {
        setError("Failed to fetch note");
      } else {
        setNote(data);
      }
    };

    fetchNote();
  }, [noteId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (note) {
      const { error } = await supabase
        .from("notes")
        .update({
          title: note.title,
          content: note.content,
          tags: note.tags,
          summary: note.summary,
        })
        .eq("id", noteId);

      if (error) {
        setError("Failed to update note");
      } else {
        router.push(`/notes/${noteId}`);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNote((prevNote) =>
      prevNote ? { ...prevNote, [name]: value } : prevNote,
    );
  };

  if (!note) {
    return <p>Loading...</p>;
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
          name="title"
          value={note?.title ?? ""}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Content
        </label>
        <textarea
          name="content"
          value={note?.content ?? ""}
          onChange={handleChange}
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
          name="tags"
          value={note.tags?.join(", ") || ""}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Summary
        </label>
        <input
          type="text"
          name="summary"
          value={note?.summary ?? ""}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Save Note
      </button>
    </form>
  );
}
