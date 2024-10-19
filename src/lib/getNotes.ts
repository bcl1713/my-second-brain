import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const notesDirectory = path.join(process.cwd(), 'src', 'notes');

export interface Note {
  id: string;
  contentHtml: string;
  title: string;
}

export async function getNoteById(id: string) {
  const decodedId = decodeURIComponent(id)
  const fullPath = path.join(notesDirectory, `${decodedId}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Parse the front matter using gray-matter
  const { data, content } = matter(fileContents);

  // Convert markdown to HTML using remark
  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    title: data.title,
    date: data.date,
    tags: data.tags,
    summary: data.summary,
  };
}

export function getAllNoteIds() {
  const fileNames = fs.readdirSync(notesDirectory);

  // Returns an array of objects with params (for dynamic routing)
  return fileNames.map((fileName) => ({
    params: {
      id: encodeURIComponent(fileName.replace(/\.md$/, '')), // Remove the file extension
    },
  }));
}
