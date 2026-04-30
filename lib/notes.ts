import { nanoid } from "nanoid";
import { type SQLQueryBindings } from "bun:sqlite";
import { query, get, run } from "@/lib/db";

export type Note = {
  id: string;
  userId: string;
  title: string;
  contentJson: string;
  isPublic: boolean;
  publicSlug: string | null;
  createdAt: string;
  updatedAt: string;
};

type NoteRow = {
  id: string;
  user_id: string;
  title: string;
  content_json: string;
  is_public: number;
  public_slug: string | null;
  created_at: string;
  updated_at: string;
};

function fromRow(row: NoteRow): Note {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    contentJson: row.content_json,
    isPublic: row.is_public === 1,
    publicSlug: row.public_slug,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const EMPTY_DOC = JSON.stringify({ type: "doc", content: [] });

export function createNote(
  userId: string,
  data: { title?: string; contentJson?: string } = {},
): Note {
  const id = nanoid();
  const title = data.title ?? "Untitled note";
  const contentJson = data.contentJson ?? EMPTY_DOC;
  run(`INSERT INTO notes (id, user_id, title, content_json) VALUES (?, ?, ?, ?)`, [
    id,
    userId,
    title,
    contentJson,
  ]);
  return fromRow(get<NoteRow>(`SELECT * FROM notes WHERE id = ?`, [id])!);
}

export function getNoteById(userId: string, noteId: string): Note | null {
  const row = get<NoteRow>(`SELECT * FROM notes WHERE id = ? AND user_id = ?`, [noteId, userId]);
  return row ? fromRow(row) : null;
}

export function getNotesByUser(userId: string): Note[] {
  return query<NoteRow>(`SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC`, [
    userId,
  ]).map(fromRow);
}

export function updateNote(
  userId: string,
  noteId: string,
  data: Partial<{ title: string; contentJson: string }>,
): Note | null {
  const sets: string[] = ["updated_at = datetime('now')"];
  const params: SQLQueryBindings[] = [];
  if (data.title !== undefined) {
    sets.push("title = ?");
    params.push(data.title);
  }
  if (data.contentJson !== undefined) {
    sets.push("content_json = ?");
    params.push(data.contentJson);
  }
  params.push(noteId, userId);
  run(`UPDATE notes SET ${sets.join(", ")} WHERE id = ? AND user_id = ?`, params);
  return getNoteById(userId, noteId);
}

export function deleteNote(userId: string, noteId: string): void {
  run(`DELETE FROM notes WHERE id = ? AND user_id = ?`, [noteId, userId]);
}

export function setNotePublic(userId: string, noteId: string, isPublic: boolean): Note | null {
  if (isPublic) {
    const existing = getNoteById(userId, noteId);
    if (!existing) return null;
    const slug = existing.publicSlug ?? nanoid(16);
    run(
      `UPDATE notes SET is_public = 1, public_slug = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?`,
      [slug, noteId, userId],
    );
  } else {
    run(
      `UPDATE notes SET is_public = 0, public_slug = NULL, updated_at = datetime('now') WHERE id = ? AND user_id = ?`,
      [noteId, userId],
    );
  }
  return getNoteById(userId, noteId);
}

export function getNoteByPublicSlug(slug: string): Note | null {
  const row = get<NoteRow>(`SELECT * FROM notes WHERE public_slug = ? AND is_public = 1`, [slug]);
  return row ? fromRow(row) : null;
}
