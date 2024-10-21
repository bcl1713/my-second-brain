import { getNoteById } from '../../../lib/getNotes';

export default async function NotePage({ params }: { params: { id: string } }) {
  const note = await getNoteById(params.id);

  if (!note) {
    return (
      <div>Note not found.  Eventually we should be able to create it here</div>
    )
  }

  return (
    <div>
      {note.title && (
        <h1 className='text-gray-700 dark:text-gray-300 text-4xl font-bold mb-4'>{note.title}</h1>
      )}
      {note.date && (
        <p className='text-gray-700 dark:text-gray-300 mb-2'><strong>Date:</strong> {note.date}</p>
      )}
      {note.summary && (
        <p className='text-gray-700 dark:text-gray-300 mb-4'><strong>Summary:</strong> {note.summary}</p>
      )}
      {note.tags && (
        <p className='text-gray-700 dark:text-gray-300 mb-6'><strong>Tags:</strong> {note.tags.join(', ')}</p>
      )}
      <div className='prose dark:prose-invert' dangerouslySetInnerHTML={{ __html: note.contentHtml }} />
    </div>
  );
}
