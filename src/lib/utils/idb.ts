// NEXT_UPDATE: Add indexedDB feature to allow for offline use

import { ConversationCollections } from "../../../chat";
import { GiftCard } from "../../../types";
import {
  ALLCONVERSATIONS_DB,
  ALLCONVERSATIONS_DB_VERSION,
  CONVERSATION_STORE_NAME,
  GIFTCARDS_STORE_NAME,
} from "../constants";

const dbSchema: { [key: number]: { keyPath: string; autoIncrement: boolean } } =
  {
    1: {
      keyPath: "id",
      autoIncrement: true,
    },
  };

const conversationsIndexSchema: { [key: string]: string } = {
  chat: "id",
};

const giftcardsIndexSchema: { [key: string]: string } = {
  id: "id",
  popular: "popular",
  category: "category",
};

export const init = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(
      ALLCONVERSATIONS_DB,
      ALLCONVERSATIONS_DB_VERSION
    );

    request.onerror = () => reject(request.error);

    request.onsuccess = () => resolve(request.result as IDBDatabase);

    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;

      for (const version in dbSchema) {
        if (Object.prototype.hasOwnProperty.call(dbSchema, version)) {
          const conversationsObjectStore = db.createObjectStore(
            CONVERSATION_STORE_NAME,
            dbSchema[version]
          );
          const giftcardsObjectStore = db.createObjectStore(
            GIFTCARDS_STORE_NAME,
            dbSchema[version]
          );

          for (const index in conversationsIndexSchema) {
            if (Object.prototype.hasOwnProperty.call(dbSchema, version)) {
              conversationsObjectStore.createIndex(
                index,
                conversationsIndexSchema[index] as string
              );
            }
          }

          for (const index in giftcardsIndexSchema) {
            if (Object.prototype.hasOwnProperty.call(dbSchema, version)) {
              giftcardsObjectStore.createIndex(
                index,
                giftcardsIndexSchema[index] as string
              );
            }
          }
        }
      }
    };
  });
};

export const getObjectStore = async (
  store_name: string,
  mode: IDBTransactionMode
) => {
  const db = await init();
  var tx = db.transaction(store_name, mode);
  return tx.objectStore(store_name);
};

export const addGiftcards = async (giftcards: GiftCard[]) => {
  const store = await getObjectStore(GIFTCARDS_STORE_NAME, "readwrite");
  let req;

  try {
    req = store.add(giftcards);
  } catch (error) {
    console.error(
      "Error @@ IDB :: ERROR_OCCURED_WHILE_STORING_GIFTCARDS_IN_LOCAL_STORAGE:",
      error
    );

    throw error;
  }

  req.onsuccess = () => {
    console.log("Insertion in DB successful");

    return store;
  };

  req.onerror = () => {
    console.error("addGiftcards error");
  };
};

export const addConversation = async (
  conversations: ConversationCollections
) => {
  const store = await getObjectStore(CONVERSATION_STORE_NAME, "readwrite");

  let req;
  try {
    req = store.add(conversations);
  } catch (error) {
    console.error(
      "Error @@ IDB :: ERROR_OCCURED_WHILE_STORING_GIFTCARDS_IN_LOCAL_STORAGE:",
      error
    );

    throw error;
  }

  req.onsuccess = () => {
    console.log("Insertion in DB successful");

    return store;
  };

  req.onerror = () => {};
};
