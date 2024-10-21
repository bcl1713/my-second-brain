export type Note = {
  id: string;
  date: string;
  content?: string | null;
  summary?: string | null;
  tags?: string[] | null;
  title?: string | null;
}
