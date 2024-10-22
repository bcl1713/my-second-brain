export type Note = {
  id: string;
  date: string;
  content?: string | null;
  summary?: string | null;
  tags?: string[];
  title?: string | null;
};
