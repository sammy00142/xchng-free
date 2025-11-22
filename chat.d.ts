// USER CHAT RELATED

import { v4 as uuid } from "uuid";
import { Subcategory } from "./types";

type Timestamp = {
  seconds: number;
  nanoseconds: number;
};

enum MessageTypetype {
  TEXT = "text",
  MEDIA = "media",
}

export type MediaMeta = {
  media_size: string;
  media_name: string;
  media_type: string;
};

export type MediaContent = {
  text: string;
  caption?: string;
  url: string;
  metadata: MediaMeta;
};

export type Sender = {
  uid: string;
  username: string;
};

export type ReadReceipt = {
  time: Timestamp;
  delivery_status: string;
  status: boolean;
};
export type Message = {
  id: string;
  type: string;
  edited_at?: null | any;
  deleted: boolean;
  timeStamp: Timestamp;
  content: {
    text: string;
    media: MediaContent;
    url: string;
    caption: string;
  };
  card: {
    title: string;
    data: object | unknown | any | object;
  };
  quoted_message?: {
    text: string;
    url: string;
    metadata: MediaMeta;
  } | null;
  recipient: string;
  edited?: boolean;
  deleted_at?: null | any;
  sender: Sender;
  read_receipt: ReadReceipt;
};

export type CardDetails = {
  subcategory: Subcategory;
  popular: boolean;
  category: string;
  vendor: string;
  title: string;
  price: string;
  id: string;
  image: string;
  name: string;
  ecode: string;
  rate: string;
};
export type Transaction = {
  id: string;
  started: boolean;
  crypto: boolean;
  cryptoData: {
    name: string;
    image: string;
    acc: string;
    id: string;
    price: string;
    rate: string;
  };
  cardDetails: CardDetails;
  accountDetails: {
    accountName: string;
    accountNumber: number;
    bankName: string;
  };
  started: true;
  accepted: false;
  completed: false;
  status: "pending" | "done" | "cancelled" | "rejected" | "processing";
};

export type TransactionRec = {
  id: string;
  data: Transaction;
  chatId: string;
  userId: string;
  payment: {
    method: string;
    reference: string;
  };
  created_at: { seconds: number; nanoseconds: number };
  updated_at: { seconds: number; nanoseconds: number };
};

export type LastMessage = {
  id: string;
  read_receipt: ReadReceipt;
  sender: string;
  content: {
    text: string;
    media: boolean;
  };
  seen: true;
};
export type Conversation = {
  id: string;
  transaction: Transaction;
  messages: Message[];
  lastMessage: LastMessage;
  user: {
    username: string;
    uid: string;
    email: string;
    photoUrl: string;
  };
  chatStatus: "closed" | "open";
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type ConversationCollections = {
  id: string;
  data: Conversation;
}[];
