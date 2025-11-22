import { StringToBoolean } from "class-variance-authority/dist/types";
import { Conversation, Timestamp } from "./chat";

export type TicketsData = {
  id: string;
  content: {
    type: string;
    description: string;
    images: string[]; //url
  };
  date: Timestamp;
  status: {
    seen: boolean;
    seen_at: Timestamp | null;
    addressed: boolean;
    addressed_at: Timestamp | null;
  };
  user: {
    fullname: string;
    email: string;
    id: string | null;
  };
  adminReply?: {
    adminId: string;
    message: string;
    date: Timestamp | null;
  }[];
};

export type CachedUser = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  emailVerified: boolean;
};

export type GiftCard = {
  id: string;
  popular: boolean;
  name: string;
  image: string;
  title: string;
  category: string;
  subcategory: Subcategory[];
};



export type Card = {
  id: string;
  name: string;
  vendor: string;
  subcategory: string;
  price: number;
  ecode?: number | undefined;
  rate: string;
};

export type Subcategory = {
  value: string;
  currency: string;
  image: string;
  country: string;
};

export type GiftcardNew = {
  package: string;
  image: string;
  category: string;
  countries: {
    name: string;
    image: string;
    packageName: string;
    currency: string;
    markup: number;
    items: {
      Local_Product_Value_Min: number;
      Local_Product_Value_Max: number;
      Cross_Rate: number;
      KUDA_IDENTIFIER: string;
      Amount_In_Naira: number;
      Rate: number;
    }[];
  }[];
}[];

export type AccountDetails = {
  accountName: string;
  accountNumber: string;
  bankName: string;
};

export type User = {
  uid: string;
  role: string;
  payment: AccountDetails[];
  notificationsToken: string;
  displayName: string;
  email: string;
  imageUrl?: string;
  emailVerified: boolean;
  phoneNumber: string | null;
  photoURL?: string | null;
  metadata: UserMetadata;
  role: string;
  conversations: string[];
  cardChoices: string[];
  transactions: string[];
  preferences: {};
};

export type ReviewContent = {
  stars: number;
  review: string;
};

export type ReviewData = {
  user: {
    id: string;
    username: string;
    photoUrl: string;
  };
  date: Timestamp;
  approved: boolean;
  content: ReviewContent;
  link?: string; // Optional link
};

export type Feedback = {
  approved: boolean;
  content: { review: string; stars: number };
  date: Timestamp;
  user: {
    photoUrl: string;
    username: string;
  };
};

type Preferences = {
  message: boolean;
  updates: boolean;
  reminders: boolean;
  account: boolean;
};
