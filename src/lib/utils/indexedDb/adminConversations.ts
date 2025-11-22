import { openDB } from "idb";
import { ConversationCollections } from "../../../../chat";

const dbName = "chatDB";
const storeName = "conversations";

export const getDb = async () => {
  return openDB(dbName, 1, {
    upgrade(db) {
      db.createObjectStore(storeName);
    },
  });
};

export const saveConversationsToDB = async (
  conversations: ConversationCollections
) => {
  const db = await getDb();
  const tx = db.transaction(storeName, "readwrite");
  const store = tx.objectStore(storeName);
  await store.put(conversations, "conversations");
  return tx.done;
};

export const getConversationsFromDB = async () => {
  const db = await getDb();
  return db.get(storeName, "conversations");
};
