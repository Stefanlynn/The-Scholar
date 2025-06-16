import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Supabase UUID
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  bio: text("bio"),
  ministryRole: text("ministry_role"),
  profilePicture: text("profile_picture"),
  defaultBibleTranslation: text("default_bible_translation").default("NIV"),
  darkMode: boolean("dark_mode").default(true),
  notifications: boolean("notifications").default(true),
  hasCompletedOnboarding: boolean("has_completed_onboarding").default(false).notNull(),
  isPremiumMember: boolean("is_premium_member").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  message: text("message").notNull(),
  response: text("response"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  scripture: text("scripture"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sermons = pgTable("sermons", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  scripture: text("scripture").notNull(),
  outline: text("outline").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  book: text("book").notNull(),
  chapter: integer("chapter").notNull(),
  verse: integer("verse").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const libraryItems = pgTable("library_items", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  author: text("author"),
  content: text("content").notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  fullName: true,
  bio: true,
  ministryRole: true,
  profilePicture: true,
  defaultBibleTranslation: true,
  darkMode: true,
  notifications: true,
  hasCompletedOnboarding: true,
});

export const updateUserProfileSchema = createInsertSchema(users).pick({
  fullName: true,
  bio: true,
  ministryRole: true,
  profilePicture: true,
  defaultBibleTranslation: true,
  darkMode: true,
  notifications: true,
}).partial();

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true,
});

export const insertSermonSchema = createInsertSchema(sermons).omit({
  id: true,
  createdAt: true,
});

export const insertBookmarkSchema = createInsertSchema(bookmarks).omit({
  id: true,
  createdAt: true,
});

export const insertLibraryItemSchema = createInsertSchema(libraryItems).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type Note = typeof notes.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Sermon = typeof sermons.$inferSelect;
export type InsertSermon = z.infer<typeof insertSermonSchema>;
export type Bookmark = typeof bookmarks.$inferSelect;
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
export type LibraryItem = typeof libraryItems.$inferSelect;
export type InsertLibraryItem = z.infer<typeof insertLibraryItemSchema>;
