"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function NewNoteForm() {
  const router = useRouter(),
    [title, setTitle] = useState(""),
    [content, setContent] = useState(""),
    [tags, setTags] = useState(""),
    [summary, setSummary] = useState(""),
    [error, setError] = useState(""),
    handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();

      // Send new note data to Supabase
      const { data, error: insertError } = await supabase
        .from("notes")
        .insert([
          {
            content,
            date: new Date().toISOString(),
            summary,
            tags: tags.split(",").map((tag) => tag.trim()),
            title,
          },
        ])
        .select("id");

      if (insertError) {
        setError("Failed to create note");
      } else if (data && data.length > 0) {
        const noteId = data[0].id;

        // Refresh sidebar or navigate to the new note
        router.push(`/notes/${noteId}`);
        router.refresh();
      }
    };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create New Note</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Content
        </label>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
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
          onChange={(event) => setTags(event.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Summary
        </label>
        <input
          type="text"
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Create Note
      </button>
    </form>
  );
}
