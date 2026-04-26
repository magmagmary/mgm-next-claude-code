"use server";

import { requireSession } from "@/lib/session";
import { createNote } from "@/lib/notes";
import { redirect } from "next/navigation";

export async function createNoteAction(formData: FormData) {
  const session = await requireSession();
  const title = (formData.get("title") as string).trim() || "Untitled note";
  const contentJson = formData.get("content_json") as string;

  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Create note action" , title);
  createNote(session.user.id, { title, contentJson });
  redirect("/dashboard");
}
