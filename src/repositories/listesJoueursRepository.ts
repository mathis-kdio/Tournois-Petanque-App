import { ListeJoueursInfos } from '@/types/interfaces/listeJoueurs';
import { ListesJoueurs, listesJoueurs } from '@/db/schema/listesJoueurs';
import { drizzleDb } from '@/db/drizzleClient';

function formatListesJoueurs(lJ: ListesJoueurs): ListeJoueursInfos {
  return {
    listId: lJ.id,
    name: lJ.name,
  };
}

export async function getAllListesJoueurs(): Promise<ListeJoueursInfos[]> {
  const result = await drizzleDb.select().from(listesJoueurs);
  //let result: ListesJoueurs[] = [];
  return result.map(formatListesJoueurs);
}

/*
export async function getNotesByUser(userId: number): Promise<Note[]> {
  return db.select().from(notes).where(eq(notes.userId, userId));
}

export async function addNote(newNote: NewNote): Promise<void> {
  await db.insert(notes).values({
    ...newNote,
    updatedAt: Date.now(),
  });
}

export async function deleteNote(id: number): Promise<void> {
  await db.delete(notes).where(eq(notes.id, id));
}
*/
