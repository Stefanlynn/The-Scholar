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

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  
  // Chat Messages
  getChatMessages(userId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Notes
  getNotes(userId: string): Promise<Note[]>;
  getNote(id: number): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: number, note: Partial<InsertNote>): Promise<Note | undefined>;
  deleteNote(id: number): Promise<boolean>;
  
  // Sermons
  getSermons(userId: string): Promise<Sermon[]>;
  getSermon(id: number): Promise<Sermon | undefined>;
  createSermon(sermon: InsertSermon): Promise<Sermon>;
  updateSermon(id: number, sermon: Partial<InsertSermon>): Promise<Sermon | undefined>;
  deleteSermon(id: number): Promise<boolean>;
  
  // Bookmarks
  getBookmarks(userId: string): Promise<Bookmark[]>;
  createBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  deleteBookmark(id: number): Promise<boolean>;
  
  // Library Items
  getLibraryItems(userId: string): Promise<LibraryItem[]>;
  getLibraryItem(id: number): Promise<LibraryItem | undefined>;
  createLibraryItem(item: InsertLibraryItem): Promise<LibraryItem>;
  updateLibraryItem(id: number, item: Partial<InsertLibraryItem>): Promise<LibraryItem | undefined>;
  deleteLibraryItem(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private chatMessages: Map<number, ChatMessage>;
  private notes: Map<number, Note>;
  private sermons: Map<number, Sermon>;
  private bookmarks: Map<number, Bookmark>;
  private libraryItems: Map<number, LibraryItem>;
  private currentChatMessageId: number;
  private currentNoteId: number;
  private currentSermonId: number;
  private currentBookmarkId: number;
  private currentLibraryItemId: number;

  constructor() {
    this.users = new Map();
    this.chatMessages = new Map();
    this.notes = new Map();
    this.sermons = new Map();
    this.bookmarks = new Map();
    this.libraryItems = new Map();
    this.currentUserId = 1;
    this.currentChatMessageId = 1;
    this.currentNoteId = 1;
    this.currentSermonId = 1;
    this.currentBookmarkId = 1;
    this.currentLibraryItemId = 1;

    // Initialize with demo user
    this.initializeData();
  }

  private initializeData() {
    // Create demo user who hasn't completed onboarding
    const demoUser: User = {
      id: 1,
      username: "demo",
      password: "demo",
      hasCompletedOnboarding: false
    };
    this.users.set(1, demoUser);
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, hasCompletedOnboarding: false };
    this.users.set(id, user);
    return user;
  }

  // Chat Messages
  async getChatMessages(userId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values()).filter(msg => msg.userId === userId);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentChatMessageId++;
    const message: ChatMessage = { 
      ...insertMessage, 
      id, 
      timestamp: new Date() 
    };
    this.chatMessages.set(id, message);
    return message;
  }

  // Notes
  async getNotes(userId: number): Promise<Note[]> {
    return Array.from(this.notes.values()).filter(note => note.userId === userId);
  }

  async getNote(id: number): Promise<Note | undefined> {
    return this.notes.get(id);
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const id = this.currentNoteId++;
    const note: Note = { 
      ...insertNote, 
      id, 
      createdAt: new Date() 
    };
    this.notes.set(id, note);
    return note;
  }

  async updateNote(id: number, updateData: Partial<InsertNote>): Promise<Note | undefined> {
    const note = this.notes.get(id);
    if (!note) return undefined;
    
    const updatedNote = { ...note, ...updateData };
    this.notes.set(id, updatedNote);
    return updatedNote;
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteNote(id: number): Promise<boolean> {
    return this.notes.delete(id);
  }

  // Sermons
  async getSermons(userId: number): Promise<Sermon[]> {
    return Array.from(this.sermons.values()).filter(sermon => sermon.userId === userId);
  }

  async getSermon(id: number): Promise<Sermon | undefined> {
    return this.sermons.get(id);
  }

  async createSermon(insertSermon: InsertSermon): Promise<Sermon> {
    const id = this.currentSermonId++;
    const sermon: Sermon = { 
      ...insertSermon, 
      id, 
      createdAt: new Date() 
    };
    this.sermons.set(id, sermon);
    return sermon;
  }

  async updateSermon(id: number, updateData: Partial<InsertSermon>): Promise<Sermon | undefined> {
    const sermon = this.sermons.get(id);
    if (!sermon) return undefined;
    
    const updatedSermon = { ...sermon, ...updateData };
    this.sermons.set(id, updatedSermon);
    return updatedSermon;
  }

  async deleteSermon(id: number): Promise<boolean> {
    return this.sermons.delete(id);
  }

  // Bookmarks
  async getBookmarks(userId: number): Promise<Bookmark[]> {
    return Array.from(this.bookmarks.values()).filter(bookmark => bookmark.userId === userId);
  }

  async createBookmark(insertBookmark: InsertBookmark): Promise<Bookmark> {
    const id = this.currentBookmarkId++;
    const bookmark: Bookmark = { 
      ...insertBookmark, 
      id, 
      createdAt: new Date() 
    };
    this.bookmarks.set(id, bookmark);
    return bookmark;
  }

  async deleteBookmark(id: number): Promise<boolean> {
    return this.bookmarks.delete(id);
  }

  // Library Items
  async getLibraryItems(userId: number): Promise<LibraryItem[]> {
    return Array.from(this.libraryItems.values()).filter(item => item.userId === userId);
  }

  async getLibraryItem(id: number): Promise<LibraryItem | undefined> {
    return this.libraryItems.get(id);
  }

  async createLibraryItem(insertItem: InsertLibraryItem): Promise<LibraryItem> {
    const id = this.currentLibraryItemId++;
    const item: LibraryItem = { 
      ...insertItem, 
      id, 
      createdAt: new Date() 
    };
    this.libraryItems.set(id, item);
    return item;
  }

  async updateLibraryItem(id: number, updateData: Partial<InsertLibraryItem>): Promise<LibraryItem | undefined> {
    const item = this.libraryItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...updateData };
    this.libraryItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteLibraryItem(id: number): Promise<boolean> {
    return this.libraryItems.delete(id);
  }
}

// Temporarily using memory storage while resolving Supabase connection
export const storage = new MemStorage();
