import { eq } from "drizzle-orm";
import { db } from "./db";
import {
  users,
  chatMessages,
  notes,
  sermons,
  bookmarks,
  libraryItems,
  type User,
  type InsertUser,
  type ChatMessage,
  type InsertChatMessage,
  type Note,
  type InsertNote,
  type Sermon,
  type InsertSermon,
  type Bookmark,
  type InsertBookmark,
  type LibraryItem,
  type InsertLibraryItem
} from "@shared/schema";
import type { IStorage } from "./storage";

export class PostgreSQLStorage implements IStorage {
  async initialize(): Promise<void> {
    // No initialization needed for authenticated app
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.fullName, username));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users).set(updateData).where(eq(users.id, id)).returning();
    return result[0];
  }

  // Chat Messages
  async getChatMessages(userId: number): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages).where(eq(chatMessages.userId, userId));
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const result = await db.insert(chatMessages).values(message).returning();
    return result[0];
  }

  // Notes
  async getNotes(userId: number): Promise<Note[]> {
    return await db.select().from(notes).where(eq(notes.userId, userId));
  }

  async getNote(id: number): Promise<Note | undefined> {
    const result = await db.select().from(notes).where(eq(notes.id, id));
    return result[0];
  }

  async createNote(note: InsertNote): Promise<Note> {
    const result = await db.insert(notes).values(note).returning();
    return result[0];
  }

  async updateNote(id: number, updateData: Partial<InsertNote>): Promise<Note | undefined> {
    const result = await db.update(notes).set(updateData).where(eq(notes.id, id)).returning();
    return result[0];
  }

  async deleteNote(id: number): Promise<boolean> {
    const result = await db.delete(notes).where(eq(notes.id, id));
    return result.length > 0;
  }

  // Sermons
  async getSermons(userId: number): Promise<Sermon[]> {
    return await db.select().from(sermons).where(eq(sermons.userId, userId));
  }

  async getSermon(id: number): Promise<Sermon | undefined> {
    const result = await db.select().from(sermons).where(eq(sermons.id, id));
    return result[0];
  }

  async createSermon(sermon: InsertSermon): Promise<Sermon> {
    const result = await db.insert(sermons).values(sermon).returning();
    return result[0];
  }

  async updateSermon(id: number, updateData: Partial<InsertSermon>): Promise<Sermon | undefined> {
    const result = await db.update(sermons).set(updateData).where(eq(sermons.id, id)).returning();
    return result[0];
  }

  async deleteSermon(id: number): Promise<boolean> {
    const result = await db.delete(sermons).where(eq(sermons.id, id));
    return result.length > 0;
  }

  // Bookmarks
  async getBookmarks(userId: number): Promise<Bookmark[]> {
    return await db.select().from(bookmarks).where(eq(bookmarks.userId, userId));
  }

  async createBookmark(bookmark: InsertBookmark): Promise<Bookmark> {
    const result = await db.insert(bookmarks).values(bookmark).returning();
    return result[0];
  }

  async deleteBookmark(id: number): Promise<boolean> {
    const result = await db.delete(bookmarks).where(eq(bookmarks.id, id));
    return result.length > 0;
  }

  // Library Items
  async getLibraryItems(userId: number): Promise<LibraryItem[]> {
    return await db.select().from(libraryItems).where(eq(libraryItems.userId, userId));
  }

  async getLibraryItem(id: number): Promise<LibraryItem | undefined> {
    const result = await db.select().from(libraryItems).where(eq(libraryItems.id, id));
    return result[0];
  }

  async createLibraryItem(item: InsertLibraryItem): Promise<LibraryItem> {
    const result = await db.insert(libraryItems).values(item).returning();
    return result[0];
  }

  async updateLibraryItem(id: number, updateData: Partial<InsertLibraryItem>): Promise<LibraryItem | undefined> {
    const result = await db.update(libraryItems).set(updateData).where(eq(libraryItems.id, id)).returning();
    return result[0];
  }

  async deleteLibraryItem(id: number): Promise<boolean> {
    const result = await db.delete(libraryItems).where(eq(libraryItems.id, id));
    return result.length > 0;
  }
}