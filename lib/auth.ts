import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
}

export async function getSession(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("nexora_session");
    
    if (!sessionCookie) {
      return null;
    }

    // In production, verify JWT token here
    // For now, decode the simple session
    const user = JSON.parse(atob(sessionCookie.value));
    return user;
  } catch {
    return null;
  }
}

export async function requireAuth(request: NextRequest): Promise<User> {
  const user = await getSession();
  
  if (!user) {
    throw new Error("Unauthorized");
  }
  
  return user;
}

export function setSession(user: User): string {
  // In production, use JWT with proper signing
  return btoa(JSON.stringify(user));
}
