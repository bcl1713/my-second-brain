import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { visit } from 'unist-util-visit';
import { Node, Literal, Parent } from 'unist';

function remarkLinkifyNotes() {
  return function transformer(tree: Node) {
    visit(tree, 'text', (node: Node) => {
      // Check if the node is a Literal type
      if (node.type === 'text') {
        const literalNode = node as Literal;
        const value = literalNode.value as string;

        const linkRegex = /\[\[([^\]]+)\]\]/g
        const matches = value.match(linkRegex);

        if (matches) {
          const newChildren = [];
          let lastIndex = 0;

          for (const match of matches) {
            const noteTitle = match.slice(2, -2);
            const start = value.indexOf(match, lastIndex);

            // Push text before the link
            if (start > lastIndex) {
              newChildren.push({
                type: 'text',
                value: value.slice(lastIndex, start)
              });
            }

            // Push the link node
            newChildren.push({
              type: 'link',
              url: `/notes/${noteTitle.replace(/\s+/g, '-')}`,
              children: [{ type: 'text', value: noteTitle }],
            });

            lastIndex = start + match.length;
          }

          // Push any remaining text after the last link
          if (lastIndex < value.length) {
            newChildren.push({
              type: 'text',
              value: value.slice(lastIndex)
            });
          }

          // Update node type and children
          const parentNode = node as Parent;
          parentNode.type = 'paragraph';
          parentNode.children = newChildren;
        }
      }
    })
  }
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
