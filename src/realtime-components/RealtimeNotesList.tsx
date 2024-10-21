'use client'

import { supabase } from "@/lib/supabase";
import { Note } from "@/types/Note";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function RealtimeNotesList({ serverNotes, }: { serverNotes: Note[]; }) {
  const [notes, setNotes] = useState(serverNotes)

  useEffect(() => {
    const channel = supabase.channel('realtime notes').on('postgres_changes', {
      event: '*', schema: 'public', table: 'notes'
    }, (payload) => {
      handlePayload(payload, notes, setNotes);
    }).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, notes, setNotes])
  return (
    <ul>
      {notes.map((note) => (
        <li id={note.id}>
          <Link href={`/notes/${note.id}`}>
            {note.title}
          </Link>
        </li>
      ))}
    </ul>
  )
}
function handlePayload(payload: RealtimePostgresChangesPayload<{ [key: string]: any; }>, notes: Note[], setNotes: Dispatch<SetStateAction<Note[]>>) {
  console.log(payload)
  if (payload.eventType == "INSERT") {
    addNote(payload.new as Note);
  } else if (payload.eventType == "DELETE") {
    removeNote(payload.old as Note);
  } else if (payload.eventType == "UPDATE") {
    removeNote(payload.old as Note);
    addNote(payload.new as Note);
  }

  function removeNote(oldNote: Note) {
    setNotes(prev => prev.filter(note => {
      return note.id != oldNote.id;
    }));
  }

  function addNote(newNote: Note) {
    setNotes(prev => [...prev, newNote]);
  }
}
