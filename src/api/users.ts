
// lib/api/users.ts
import { db } from '@/db/db';
import { users, User, NewUser } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { CreateUserPayload, UpdateUserPayload } from '@/types/user';

export async function getAllUsers(): Promise<User[]> {
  return db.select().from(users);
}

export async function getUserById(id: string): Promise<User | undefined> {
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0];
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0];
}

// -----------------------------------------------------------------------------------------------

export async function createUser(data: CreateUserPayload): Promise<User> {
	const newUser: NewUser = data;
	const result = await db.insert(users).values(newUser).returning();
	return result[0];
  }


export async function updateUser(id: string, data: UpdateUserPayload): Promise<User | undefined> {
  const result = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning();
  return result[0];
}

export async function deleteUser(id: string): Promise<void> {
  	await db.delete(users).where(eq(users.id, id));
}
