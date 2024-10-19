import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { visit } from 'unist-util-visit';
import { Node } from 'unist';

function remarkLinkifyNotes() {
  return function transsformer(tree: Node) {
    visit(tree, 'text', (node: any) => {
      const linkRegex = /\[\[([^\]]+)\]\]/g;
      const matches = [...node.value.matchAll(linkRegex)];

      if (matches.length > 0) {
        const newChildren = [];
        let lastIndex = 0;

        for (const match of matches) {
          const [fullMatch, noteTitle] = match;
          const start = match.index;

          // Push text before the link
          if (start > lastIndex) {
            newChildren.push({ type: 'text', value: node.value.slice(lastIndex, start) });
          }

          // Push the link node
          newChildren.push({
            type: 'link',
            url: `/notes/${noteTitle.replace(/\s+/g, '-')}`,
            children: [{ type: 'text', value: noteTitle }],
          });

          lastIndex = start + fullMatch.length;
        }

        // Push any remaining text after the last link
        if (lastIndex < node.value.length) {
          newChildren.push({ type: 'text', value: node.value.slice(lastIndex) });
        }

        node.type = 'paragraph';
        node.children = newChildren;
      }
    });
  };
}

const notesDirectory = path.join(process.cwd(), 'src', 'notes');

export interface Note {
  id: string;
  contentHtml: string;
  title?: string;
  date?: string;
  tags?: string[];
  summary?: string;
  links?: string[];
}

export async function getNoteById(id: string) {
  const decodedId = decodeURIComponent(id)
  const fullPath = path.join(notesDirectory, `${decodedId}.md`);
  if (!fs.existsSync(fullPath)) {
    return null
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Parse the front matter using gray-matter
  const { data, content } = matter(fileContents);

  // Convert markdown to HTML using remark
  const processedContent = await remark()
    .use(remarkLinkifyNotes)
    .use(html)
    .process(content);
  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    title: data.title,
    date: data.date,
    tags: data.tags,
    summary: data.summary,
    links: extractLinks(content),
  };
}

function extractLinks(content: string): string[] {
  const regex = /\[\[([^\]]+)\]\]/g;
  const links = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    links.push(match[1].trim());
  }

  return links;
}

export function getBacklinks(nodeId: string): string[] {
  const fileNames = fs.readdirSync(notesDirectory);
  const backlinks: string[] = [];

  fileNames.forEach((fileName) => {
    const fullPath = path.join(notesDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const noteContent = matter(fileContents).content;

    if (noteContent.includes(`[[${nodeId.replace(/-/g, ' ')}]]`)) {
      backlinks.push(fileName.replace(/\.md$/, ''));
    }
  });

  return backlinks;
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
