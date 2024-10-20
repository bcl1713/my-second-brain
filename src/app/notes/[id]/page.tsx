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

      {/* {note.links && note.links.length > 0 && ( */}
      {/*   <div className='mt-8'> */}
      {/*     <h2 className='text-xl font-semibold text-gray-700 dark:text-gray-300'>Links</h2> */}
      {/*     <ul className='list-disc pl-6'> */}
      {/*       {note.links.map((link) => ( */}
      {/*         <li key={link}> */}
      {/*           <Link href={`/notes/${link.replace(/\s+/g, '-')}`} className='text-blue-500 hover:underline'> */}
      {/*             {link} */}
      {/*           </Link> */}
      {/*         </li> */}
      {/*       ))} */}
      {/*     </ul> */}
      {/*   </div> */}
      {/* )} */}

      {/* {backlinks && backlinks.length > 0 && ( */}
      {/*   <div className='mt-8'> */}
      {/*     <h2 className='text-xl font-semibold text-gray-700 dark:text-gray-300'>BackLinks</h2> */}
      {/*     <ul className='list-disc pl-6'> */}
      {/*       {backlinks.map((backlink) => ( */}
      {/*         <li key={backlink}> */}
      {/*           <Link href={`/notes/${backlink}`} className='text-blue-500 hover:underline'> */}
      {/*             {decodeURIComponent(backlink.replace(/-/g, ' '))} */}
      {/*           </Link> */}
      {/*         </li> */}
      {/*       ))} */}
      {/*     </ul> */}
      {/*   </div> */}
      {/* )} */}
    </div>
  );
}
