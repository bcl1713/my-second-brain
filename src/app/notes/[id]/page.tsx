"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Note } from "@/types/Note";
import { remark } from "remark";
import html from "remark-html";
import { fetchNoteById } from "@/lib/notes";

export default function NotePage({ params }: { params: { id: string } }) {
  const [note, setNote] = useState<Note | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const data = await fetchNoteById(params.id);

        const parsedContent = await remark()
          .use(html)
          .process(data.content || "");

        setNote({
          ...data,
          content: parsedContent.toString(),
        } as Note);
      } catch (err) {
        setError("Note not found." + err);
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
        <div
          className="prose dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      )}
      <Link href={`/notes/${note.id}/edit`}>
        <button className="bg-gray-700 text-white p-2 rounded">Edit</button>
      </Link>
    </div>
  );
}
