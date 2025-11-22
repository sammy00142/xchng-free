"use client";

import { PresenceUser } from "@/app/(user)/(non_auth)/chat/[chatId]/page";
import { atom } from "jotai";

export const adminPresenceAtom = atom<PresenceUser[]>([]);
