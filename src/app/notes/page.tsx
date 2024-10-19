import Link from 'next/link';
import { getAllNoteIds } from '../../lib/getNotes';

export default function NotesPage() {
  const notes = getAllNoteIds();

  return (
    <div className='max-w-2xl mx-auto px-4 py-8'>
      <ul className="space-y-4">
        {notes.map((note) => (
          <li key={note.params.id}>
            <Link href={`/notes/${note.params.id}`} className='text-gray-800 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-500 transition duration-500'>
              {decodeURIComponent(note.params.id.replace(/-/g, ' '))}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
