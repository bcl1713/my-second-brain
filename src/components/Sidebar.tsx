import Link from "next/link";
import { getAllNotes } from "@/lib/getNotes";

export default async function Sidebar() {
  const notes = await getAllNotes();

  return (
    <div className="w-64 bg-gray-100 dark:bg-gray-800 p-4">
      <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4">Notes</h2>
      <ul>
        {notes.map((note) => (
          <li key={note.id} className="mb-2">
            <Link href={`/notes/${note.id}`} className="text-gray-700 dark:text-gray-200">
              {note.title || 'Untitled Note'}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
