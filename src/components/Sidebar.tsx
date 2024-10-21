import { getAllNotes } from "@/lib/getNotes";
import RealtimeNotesList from "@/realtime-components/RealtimeNotesList";
import { Note } from "@/types/Note";

export default async function Sidebar() {
  const notes = await getAllNotes() as Note[];

  return (
    <div className="w-64 bg-gray-100 dark:bg-gray-800 p-4">
      <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4">Index</h2>
      <RealtimeNotesList serverNotes={notes} />
    </div>
  );
}
