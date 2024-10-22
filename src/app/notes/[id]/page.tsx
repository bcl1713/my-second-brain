"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Note } from "@/types/Note";

export default function NotePage({ params }: { params: { id: string } }) {
  const [note, setNote] = useState<Note | null>(null);
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
      }
    };

    fetchNote();
  }, [params.id]);

  if (error) {
    return <div>{error} Eventually we should be able to create it here</div>;
  }

  if (!note) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {note.title && (
        <h1 className="text-gray-700 dark:text-gray-300 text-4xl font-bold mb-4">
          {note.title}
        </h1>
      )}
      {note.date && (
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          <strong>Date:</strong> {note.date}
        </p>
      )}
      {note.summary && (
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          <strong>Summary:</strong> {note.summary}
        </p>
      )}
      {note.tags && (
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          <strong>Tags:</strong> {note.tags.join(", ")}
        </p>
      )}
      {note.content && (
        <div className="prose dark:prose-invert">
          <p>{note.content}</p>
        </div>
      )}
      <Link href={`/notes/${note.id}/edit`}>
        <button className="bg-gray-700 text-white p-2 rounded">Edit</button>
      </Link>
    </div>
  );
}
