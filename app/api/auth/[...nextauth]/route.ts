// app/api/auth/[...nextauth]/route.ts
// Auth.js v5 — export handlers from centralized auth config

import { handlers } from "@/src/auth";

export const { GET, POST } = handlers;
