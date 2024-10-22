"use client";

import { getAllNotes } from "@/lib/getNotes";
import { supabase } from "@/lib/supabase";
import { Note } from "@/types/Note";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function RealtimeNotesList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const fetchNotes = async () => {
      try {
        const { data, error } = await getAllNotes();
        if (error) throw error;
        setNotes((data as Note[]) || []);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch Notes:" + err);
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("realtime notes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notes",
        },
        (payload: RealtimePostgresChangesPayload<Note>) => {
          handlePayload(payload, setNotes);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [notes, setNotes]);
  if (error) {
    return <div>{error}</div>;
  }
  if (isLoading) {
    return <div>Loading Notes...</div>;
  }
  return (
    <ul>
      {notes.map((note) => (
        <li key={note.id}>
          <Link href={`/notes/${note.id}`}>{note.title}</Link>
        </li>
      ))}
    </ul>
  );
}
function handlePayload(
  payload: RealtimePostgresChangesPayload<Note>,
  setNotes: Dispatch<SetStateAction<Note[]>>,
) {
  console.log(payload);
  if (payload.eventType == "INSERT") {
    addNote(payload.new as Note);
  } else if (payload.eventType == "DELETE") {
    removeNote(payload.old as Note);
  } else if (payload.eventType == "UPDATE") {
    removeNote(payload.old as Note);
    addNote(payload.new as Note);
  }

  function removeNote(oldNote: Note) {
    setNotes((prev) =>
      prev.filter((note) => {
        return note.id != oldNote.id;
      }),
    );
  }

  function addNote(newNote: Note) {
    setNotes((prev) => [...prev, newNote]);
  }
}
