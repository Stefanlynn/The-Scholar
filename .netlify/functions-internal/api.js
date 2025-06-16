// netlify/functions/api.ts
import express from "express";
import serverless from "serverless-http";
import cors from "cors";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  chatMessages;
  notes;
  sermons;
  bookmarks;
  libraryItems;
  currentChatMessageId;
  currentNoteId;
  currentSermonId;
  currentBookmarkId;
  currentLibraryItemId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.chatMessages = /* @__PURE__ */ new Map();
    this.notes = /* @__PURE__ */ new Map();
    this.sermons = /* @__PURE__ */ new Map();
    this.bookmarks = /* @__PURE__ */ new Map();
    this.libraryItems = /* @__PURE__ */ new Map();
    this.currentChatMessageId = 1;
    this.currentNoteId = 1;
    this.currentSermonId = 1;
    this.currentBookmarkId = 1;
    this.currentLibraryItemId = 1;
    this.initializeData();
  }
  initializeData() {
    const demoUser = {
      id: "demo-user-id",
      email: "demo@example.com",
      fullName: "Demo User",
      bio: "A passionate student of God's Word",
      ministryRole: "student",
      profilePicture: null,
      defaultBibleTranslation: "NIV",
      darkMode: true,
      notifications: true,
      hasCompletedOnboarding: false,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.users.set("demo-user-id", demoUser);
  }
  // Users
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find((user) => user.email === username);
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }
  async createUser(insertUser) {
    const user = {
      id: insertUser.id,
      email: insertUser.email,
      fullName: insertUser.fullName ?? null,
      bio: insertUser.bio ?? null,
      ministryRole: insertUser.ministryRole ?? null,
      profilePicture: insertUser.profilePicture ?? null,
      defaultBibleTranslation: insertUser.defaultBibleTranslation ?? "NIV",
      darkMode: insertUser.darkMode ?? true,
      notifications: insertUser.notifications ?? true,
      hasCompletedOnboarding: insertUser.hasCompletedOnboarding ?? false,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.users.set(insertUser.id, user);
    return user;
  }
  async updateUser(id, updateData) {
    const user = this.users.get(id);
    if (!user) return void 0;
    const updatedUser = { ...user, ...updateData, updatedAt: /* @__PURE__ */ new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  async deleteUser(id) {
    return this.users.delete(id);
  }
  // Chat Messages
  async getChatMessages(userId) {
    return Array.from(this.chatMessages.values()).filter((msg) => msg.userId === userId);
  }
  async createChatMessage(insertMessage) {
    const id = this.currentChatMessageId++;
    const message = {
      id,
      message: insertMessage.message,
      userId: insertMessage.userId,
      response: insertMessage.response ?? null,
      timestamp: /* @__PURE__ */ new Date()
    };
    this.chatMessages.set(id, message);
    return message;
  }
  // Notes
  async getNotes(userId) {
    return Array.from(this.notes.values()).filter((note) => note.userId === userId);
  }
  async getNote(id) {
    return this.notes.get(id);
  }
  async createNote(insertNote) {
    const id = this.currentNoteId++;
    const note = {
      id,
      userId: insertNote.userId,
      title: insertNote.title,
      content: insertNote.content,
      scripture: insertNote.scripture ?? null,
      tags: insertNote.tags ?? null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.notes.set(id, note);
    return note;
  }
  async updateNote(id, updateData) {
    const note = this.notes.get(id);
    if (!note) return void 0;
    const updatedNote = { ...note, ...updateData };
    this.notes.set(id, updatedNote);
    return updatedNote;
  }
  async updateUser(id, updateData) {
    const user = this.users.get(id);
    if (!user) return void 0;
    const updatedUser = { ...user, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  async deleteNote(id) {
    return this.notes.delete(id);
  }
  // Sermons
  async getSermons(userId) {
    return Array.from(this.sermons.values()).filter((sermon) => sermon.userId === userId);
  }
  async getSermon(id) {
    return this.sermons.get(id);
  }
  async createSermon(insertSermon) {
    const id = this.currentSermonId++;
    const sermon = {
      ...insertSermon,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.sermons.set(id, sermon);
    return sermon;
  }
  async updateSermon(id, updateData) {
    const sermon = this.sermons.get(id);
    if (!sermon) return void 0;
    const updatedSermon = { ...sermon, ...updateData };
    this.sermons.set(id, updatedSermon);
    return updatedSermon;
  }
  async deleteSermon(id) {
    return this.sermons.delete(id);
  }
  // Bookmarks
  async getBookmarks(userId) {
    return Array.from(this.bookmarks.values()).filter((bookmark) => bookmark.userId === userId);
  }
  async createBookmark(insertBookmark) {
    const id = this.currentBookmarkId++;
    const bookmark = {
      ...insertBookmark,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.bookmarks.set(id, bookmark);
    return bookmark;
  }
  async deleteBookmark(id) {
    return this.bookmarks.delete(id);
  }
  // Library Items
  async getLibraryItems(userId) {
    return Array.from(this.libraryItems.values()).filter((item) => item.userId === userId);
  }
  async getLibraryItem(id) {
    return this.libraryItems.get(id);
  }
  async createLibraryItem(insertItem) {
    const id = this.currentLibraryItemId++;
    const item = {
      ...insertItem,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.libraryItems.set(id, item);
    return item;
  }
  async updateLibraryItem(id, updateData) {
    const item = this.libraryItems.get(id);
    if (!item) return void 0;
    const updatedItem = { ...item, ...updateData };
    this.libraryItems.set(id, updatedItem);
    return updatedItem;
  }
  async deleteLibraryItem(id) {
    return this.libraryItems.delete(id);
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: text("id").primaryKey(),
  // Supabase UUID
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  bio: text("bio"),
  ministryRole: text("ministry_role"),
  profilePicture: text("profile_picture"),
  defaultBibleTranslation: text("default_bible_translation").default("NIV"),
  darkMode: boolean("dark_mode").default(true),
  notifications: boolean("notifications").default(true),
  hasCompletedOnboarding: boolean("has_completed_onboarding").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  message: text("message").notNull(),
  response: text("response"),
  timestamp: timestamp("timestamp").defaultNow().notNull()
});
var notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  scripture: text("scripture"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var sermons = pgTable("sermons", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  scripture: text("scripture").notNull(),
  outline: text("outline").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  book: text("book").notNull(),
  chapter: integer("chapter").notNull(),
  verse: integer("verse").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var libraryItems = pgTable("library_items", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  author: text("author"),
  content: text("content").notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  fullName: true,
  bio: true,
  ministryRole: true,
  profilePicture: true,
  defaultBibleTranslation: true,
  darkMode: true,
  notifications: true,
  hasCompletedOnboarding: true
});
var updateUserProfileSchema = createInsertSchema(users).pick({
  fullName: true,
  bio: true,
  ministryRole: true,
  profilePicture: true,
  defaultBibleTranslation: true,
  darkMode: true,
  notifications: true
}).partial();
var insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true
});
var insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true
});
var insertSermonSchema = createInsertSchema(sermons).omit({
  id: true,
  createdAt: true
});
var insertBookmarkSchema = createInsertSchema(bookmarks).omit({
  id: true,
  createdAt: true
});
var insertLibraryItemSchema = createInsertSchema(libraryItems).omit({
  id: true,
  createdAt: true
});

// server/routes.ts
import { createClient } from "@supabase/supabase-js";
var supabaseUrl = process.env.VITE_SUPABASE_URL || "";
var supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
var supabase = createClient(supabaseUrl, supabaseServiceKey);
async function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No authorization header" });
  }
  const token = authHeader.replace("Bearer ", "");
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Authentication failed" });
  }
}
async function searchByKeywords(query) {
  try {
    const response = await fetch(`https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-02/search?query=${encodeURIComponent(query)}&limit=50`, {
      method: "GET",
      headers: {
        "api-key": process.env.RAPIDAPI_KEY || ""
      }
    });
    if (response.ok) {
      const data = await response.json();
      if (data.data && data.data.verses) {
        return data.data.verses.map((verse) => {
          const reference = verse.reference;
          const bookMatch = reference.match(/^([^0-9]+)/);
          const chapterVerseMatch = reference.match(/(\d+):(\d+)/);
          return {
            book: bookMatch ? bookMatch[1].trim() : "Unknown",
            chapter: chapterVerseMatch ? parseInt(chapterVerseMatch[1]) : 1,
            verse: chapterVerseMatch ? parseInt(chapterVerseMatch[2]) : 1,
            text: verse.text.replace(/<[^>]*>/g, "")
            // Remove HTML tags
          };
        });
      }
    }
  } catch (error) {
    console.log("API-Bible search failed, trying alternative:", error);
  }
  try {
    const response = await fetch(`https://bible-api.com/${encodeURIComponent(query)}`);
    if (response.ok) {
      const data = await response.json();
      if (data.verses && Array.isArray(data.verses)) {
        return data.verses.map((verse) => ({
          book: verse.book_name || data.reference?.split(" ")[0] || "Unknown",
          chapter: verse.chapter || data.chapter || 1,
          verse: verse.verse || data.verse || 1,
          text: verse.text || data.text || ""
        }));
      } else if (data.text) {
        return [{
          book: data.reference?.split(" ")[0] || "Unknown",
          chapter: data.chapter || 1,
          verse: data.verse || 1,
          text: data.text
        }];
      }
    }
  } catch (error) {
    console.log("Bible-api.com also failed:", error);
  }
  return [];
}
async function registerRoutes(app2) {
  const DEMO_USER_ID = "demo-user";
  app2.get("/api/users/current", async (req, res) => {
    try {
      const user = await storage.getUser(DEMO_USER_ID);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ id: user.id, username: user.username, hasCompletedOnboarding: user.hasCompletedOnboarding });
    } catch (error) {
      console.error("Error fetching current user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });
  app2.post("/api/users/complete-onboarding", async (req, res) => {
    try {
      const updatedUser = await storage.updateUser(DEMO_USER_ID, { hasCompletedOnboarding: true });
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error completing onboarding:", error);
      res.status(500).json({ error: "Failed to complete onboarding" });
    }
  });
  app2.get("/api/profile", authenticateUser, async (req, res) => {
    try {
      const user = await storage.getUserByEmail(req.user.email);
      if (!user) {
        const newUser = await storage.createUser({
          id: req.user.id,
          email: req.user.email,
          fullName: req.user.user_metadata?.full_name || null,
          bio: null,
          ministryRole: null,
          profilePicture: req.user.user_metadata?.avatar_url || null,
          defaultBibleTranslation: "NIV",
          darkMode: true,
          notifications: true,
          hasCompletedOnboarding: false
        });
        return res.json(newUser);
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });
  app2.put("/api/profile", authenticateUser, async (req, res) => {
    try {
      const updateData = updateUserProfileSchema.parse(req.body);
      const user = await storage.getUserByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const updatedUser = await storage.updateUser(user.id, updateData);
      if (!updatedUser) {
        return res.status(404).json({ error: "Failed to update user" });
      }
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });
  app2.get("/api/profile/stats", authenticateUser, async (req, res) => {
    try {
      const user = await storage.getUserByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const [notes2, sermons2, bookmarks2] = await Promise.all([
        storage.getNotes(user.id),
        storage.getSermons(user.id),
        storage.getBookmarks(user.id)
      ]);
      res.json({
        notes: notes2.length,
        sermons: sermons2.length,
        bookmarks: bookmarks2.length
      });
    } catch (error) {
      console.error("Error fetching profile stats:", error);
      res.status(500).json({ error: "Failed to fetch profile stats" });
    }
  });
  app2.delete("/api/profile", authenticateUser, async (req, res) => {
    try {
      const user = await storage.getUserByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      await storage.deleteUser(user.id);
      const { error } = await supabase.auth.admin.deleteUser(req.user.id);
      if (error) {
        console.error("Error deleting user from Supabase:", error);
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting account:", error);
      res.status(500).json({ error: "Failed to delete account" });
    }
  });
  app2.get("/api/chat/messages", authenticateUser, async (req, res) => {
    try {
      const user = await storage.getUserByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const messages = await storage.getChatMessages(user.id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to get chat messages" });
    }
  });
  app2.post("/api/chat/messages", async (req, res) => {
    try {
      const messageData = insertChatMessageSchema.parse({
        ...req.body,
        userId: DEMO_USER_ID
      });
      const aiResponse = await generateAIResponse(messageData.message);
      messageData.response = aiResponse;
      const message = await storage.createChatMessage(messageData);
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid message data" });
    }
  });
  app2.post("/api/chat/send", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }
      const messageData = insertChatMessageSchema.parse({
        message,
        userId: DEMO_USER_ID
      });
      const aiResponse = await generateAIResponse(messageData.message);
      messageData.response = aiResponse;
      const chatMessage = await storage.createChatMessage(messageData);
      res.json({
        success: true,
        message: chatMessage,
        response: aiResponse
      });
    } catch (error) {
      console.error("Study tools API error:", error);
      res.status(500).json({ error: "Failed to process study request" });
    }
  });
  app2.post("/api/chat/enhance", async (req, res) => {
    try {
      const { action, text: text2, style } = req.body;
      if (!action || !text2) {
        return res.status(400).json({ error: "Action and text are required" });
      }
      let enhancementPrompt = "";
      switch (action) {
        case "expand":
          enhancementPrompt = `As The Scholar, a Spirit-led biblical study assistant, expand on this sermon point with deeper biblical insight, practical application, and encouraging truth that calls out the royal identity of believers as children of the King. Use your access to biblical knowledge and cross-references to provide rich, authentic content:

"${text2}"

Provide an expanded section that:
- Builds faith and reveals God's heart for His people
- Includes relevant cross-references and biblical context
- Applies the truth practically to believers' lives
- Maintains a prophetic, empowering tone that speaks identity`;
          break;
        case "rewrite":
          enhancementPrompt = `As The Scholar, rewrite this sermon content more clearly and powerfully. Use a prophetic, empowering tone that speaks identity and calls out greatness in believers. Access biblical knowledge to enhance the message:

"${text2}"

Rewrite this with:
- Clarity, grace, and empowering truth
- Better flow while maintaining the core message
- Biblical backing and authentic scriptural insight
- Language that builds faith and reveals believers' royal identity`;
          break;
        case "add_verse":
          enhancementPrompt = `As The Scholar, find 2-3 relevant Bible verses that directly relate to this sermon point. Return ONLY the scripture references and verse text, no explanations or commentary:

"${text2}"

Format your response as:
[Bible Reference] - [Complete verse text]
[Bible Reference] - [Complete verse text]
[Bible Reference] - [Complete verse text]

Example format:
John 3:16 - "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
Romans 8:28 - "And we know that in all things God works for the good of those who love him, who have been called according to his purpose."`;
          break;
        case "add_illustration":
          enhancementPrompt = `As The Scholar, provide a compelling illustration, story, or example that makes this sermon point come alive for the congregation. Draw from biblical stories, historical examples, or relatable modern analogies:

"${text2}"

Give an illustration that:
- Helps people connect with this truth emotionally
- Is relatable and memorable for the audience
- Reinforces the biblical principle being taught
- Builds faith and understanding of God's character`;
          break;
        case "convert_outline":
          enhancementPrompt = `As The Scholar, convert these sermon notes into a structured preaching outline with:
- Title
- Text (main scripture)
- Theme (big idea)
- Point 1, Point 2, Point 3 (key teaching points)
- Call to Action / Altar Moment
- Closing Verse / Benediction

Here are the sermon notes: "${text2}"

Format as a clear, structured outline for preaching.`;
          break;
        case "style_rewrite":
          let stylePrompt = "";
          switch (style) {
            case "prophetic":
              stylePrompt = `Take the user's sermon notes and rewrite it into a complete sermon using PROPHETIC STYLE:

- Language: Bold, Spirit-led, revelatory, identity-focused
- Emphasizes: Destiny, breakthrough, and what God is saying now
- Structure: Narrative, fluid, and emotionally charged
- Often includes declarations or "I sense the Lord saying..."
- Goal: Awaken hearts, shift atmosphere, and activate calling

Expand into a full-length sermon including:
- Title
- Introduction (engaging hook or story)
- Main Scripture(s) and theme
- Main Points with explanation
- Supporting verses
- Application for the audience
- Conclusion or altar call
- Optional: Illustration, prayer, or call to reflection`;
              break;
            case "teaching":
              stylePrompt = `Take the user's sermon notes and rewrite it into a complete sermon using TEACHING STYLE:

- Language: Exegetical, theological, and Scripture-saturated
- Structure: Logical, rooted in the biblical text, with Greek/Hebrew if needed
- Uses subpoints, transitions, and builds line by line
- Often has one controlling idea expanded with doctrinal clarity
- Goal: Build theological depth, glorify God's Word, and feed the spiritually mature

Expand into a full-length sermon including:
- Title
- Introduction (engaging hook or story)
- Main Scripture(s) and theme
- Main Points with explanation
- Supporting verses
- Application for the audience
- Conclusion or altar call
- Optional: Illustration, prayer, or call to reflection`;
              break;
            case "evangelistic":
              stylePrompt = `Take the user's sermon notes and rewrite it into a complete sermon using EVANGELISTIC STYLE:

- Language: Passionate, invitational, simple and urgent
- Structure: Highlights sin, redemption, and grace
- Includes stories of transformation, personal appeal, and gospel clarity
- Always ends with a clear call to salvation or repentance
- Goal: Lead people to make a decision for Christ

Expand into a full-length sermon including:
- Title
- Introduction (engaging hook or story)
- Main Scripture(s) and theme
- Main Points with explanation
- Supporting verses
- Application for the audience
- Conclusion or altar call
- Optional: Illustration, prayer, or call to reflection`;
              break;
            case "youth":
              stylePrompt = `Take the user's sermon notes and rewrite it into a complete sermon using YOUTH/MODERN STYLE (Designed for Gen Z & young adult communication):

- Language: Casual, visual, honest, relevant, and story-driven
- Shorter sentences, social-media friendly metaphors, humor if appropriate
- Themes: Identity, purpose, mental health, culture, and real life
- Scripture is applied in real-world terms
- Goal: Engage young hearts and minds with the Gospel in a way they can feel and live

Expand into a full-length sermon including:
- Title
- Introduction (engaging hook or story)
- Main Scripture(s) and theme
- Main Points with explanation
- Supporting verses
- Application for the audience
- Conclusion or altar call
- Optional: Illustration, prayer, or call to reflection`;
              break;
            case "devotional":
              stylePrompt = `Take the user's sermon notes and rewrite it into a complete sermon using DEVOTIONAL STYLE (Intimate, reflective, heart-to-heart tone):

- Language: Personal, warm, emotionally present
- Structure: Centers around 1 key verse, a story, and 1 takeaway
- Encourages quiet reflection, faith-building, and closeness with God
- Ends with a prayer or question to meditate on
- Goal: Nurture daily spiritual growth and personal connection with God

Expand into a full-length sermon including:
- Title
- Introduction (engaging hook or story)
- Main Scripture(s) and theme
- Main Points with explanation
- Supporting verses
- Application for the audience
- Conclusion or altar call
- Optional: Illustration, prayer, or call to reflection`;
              break;
            default:
              stylePrompt = "Rewrite in a prophetic, empowering style";
          }
          enhancementPrompt = `As The Scholar, ${stylePrompt}

Here are the sermon notes to rewrite:
"${text2}"

Pull Scripture text from Bible knowledge if specific verses are mentioned. Do not shorten the message - expand it into a full-length sermon using the selected style above.`;
          break;
        case "format_outline":
          enhancementPrompt = `As The Scholar, transform this sermon content into a clear, structured outline format with main points, sub-points, and bullet lists:

"${text2}"

Convert this into an outline format with:
- Clear main headings (I., II., III.)
- Supporting sub-points (A., B., C.)
- Specific bullet points with scripture references
- Concise, preachable structure
- Maintain all key content but organize it hierarchically
- Keep The Scholar's empowering, prophetic tone`;
          break;
        case "format_manuscript":
          enhancementPrompt = `As The Scholar, transform this sermon content into a full manuscript format with complete sentences, flowing paragraphs, and detailed explanations:

"${text2}"

Convert this into manuscript format with:
- Complete sentences and flowing paragraphs
- Detailed explanations and illustrations
- Smooth transitions between ideas
- Full development of each point
- Rich biblical context and application
- Maintain The Scholar's identity-focused, grace-filled voice`;
          break;
        case "format_bullets":
          enhancementPrompt = `As The Scholar, transform this sermon content into a bullet-point format that's easy to read and preach from:

"${text2}"

Convert this into bullet format with:
- Clear, concise bullet points
- Key phrases and memorable statements
- Scripture references easily visible
- Action points and applications
- Logical flow between bullets
- Maintain The Scholar's empowering, prophetic essence`;
          break;
        default:
          return res.status(400).json({ error: "Invalid enhancement action" });
      }
      const aiResponse = await generateAIResponse(enhancementPrompt);
      let responseData = { message: aiResponse };
      if (action === "convert_outline") {
        try {
          const outlineMatch = aiResponse.match(/Title:\s*(.+?)(?:\n|$)/i);
          const textMatch = aiResponse.match(/Text:\s*(.+?)(?:\n|$)/i);
          const themeMatch = aiResponse.match(/Theme:\s*(.+?)(?:\n|$)/i);
          const point1Match = aiResponse.match(/Point 1:\s*(.+?)(?:\n|$)/i);
          const point2Match = aiResponse.match(/Point 2:\s*(.+?)(?:\n|$)/i);
          const point3Match = aiResponse.match(/Point 3:\s*(.+?)(?:\n|$)/i);
          const callMatch = aiResponse.match(/Call to Action[^\n]*:\s*(.+?)(?:\n|$)/i);
          const closingMatch = aiResponse.match(/Closing[^\n]*:\s*(.+?)(?:\n|$)/i);
          responseData.outline = {
            title: outlineMatch?.[1]?.trim() || "",
            text: textMatch?.[1]?.trim() || "",
            theme: themeMatch?.[1]?.trim() || "",
            point1: point1Match?.[1]?.trim() || "",
            point2: point2Match?.[1]?.trim() || "",
            point3: point3Match?.[1]?.trim() || "",
            callToAction: callMatch?.[1]?.trim() || "",
            closingVerse: closingMatch?.[1]?.trim() || ""
          };
        } catch (parseError) {
          console.error("Error parsing outline:", parseError);
        }
      }
      res.json(responseData);
    } catch (error) {
      console.error("Enhancement error:", error);
      res.status(500).json({ error: "Failed to enhance content" });
    }
  });
  app2.get("/api/notes", async (req, res) => {
    try {
      const notes2 = await storage.getNotes(DEMO_USER_ID);
      res.json(notes2);
    } catch (error) {
      res.status(500).json({ message: "Failed to get notes" });
    }
  });
  app2.post("/api/notes", async (req, res) => {
    try {
      const noteData = insertNoteSchema.parse({
        ...req.body,
        userId: DEMO_USER_ID
      });
      const note = await storage.createNote(noteData);
      res.json(note);
    } catch (error) {
      res.status(400).json({ message: "Invalid note data" });
    }
  });
  app2.put("/api/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const note = await storage.updateNote(id, updateData);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.json(note);
    } catch (error) {
      res.status(400).json({ message: "Failed to update note" });
    }
  });
  app2.delete("/api/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteNote(id);
      if (!deleted) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.json({ message: "Note deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Failed to delete note" });
    }
  });
  app2.get("/api/sermons", async (req, res) => {
    try {
      const sermons2 = await storage.getSermons(DEMO_USER_ID);
      res.json(sermons2);
    } catch (error) {
      res.status(500).json({ message: "Failed to get sermons" });
    }
  });
  app2.post("/api/sermons", async (req, res) => {
    try {
      const sermonData = insertSermonSchema.parse({
        ...req.body,
        userId: DEMO_USER_ID
      });
      const sermon = await storage.createSermon(sermonData);
      res.json(sermon);
    } catch (error) {
      res.status(400).json({ message: "Invalid sermon data" });
    }
  });
  app2.put("/api/sermons/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const sermon = await storage.updateSermon(id, updateData);
      if (!sermon) {
        return res.status(404).json({ message: "Sermon not found" });
      }
      res.json(sermon);
    } catch (error) {
      res.status(400).json({ message: "Failed to update sermon" });
    }
  });
  app2.delete("/api/sermons/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteSermon(id);
      if (!deleted) {
        return res.status(404).json({ message: "Sermon not found" });
      }
      res.json({ message: "Sermon deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Failed to delete sermon" });
    }
  });
  app2.get("/api/bookmarks", async (req, res) => {
    try {
      const bookmarks2 = await storage.getBookmarks(DEMO_USER_ID);
      res.json(bookmarks2);
    } catch (error) {
      res.status(500).json({ message: "Failed to get bookmarks" });
    }
  });
  app2.post("/api/bookmarks", async (req, res) => {
    try {
      const bookmarkData = insertBookmarkSchema.parse({
        ...req.body,
        userId: DEMO_USER_ID
      });
      const bookmark = await storage.createBookmark(bookmarkData);
      res.json(bookmark);
    } catch (error) {
      res.status(400).json({ message: "Invalid bookmark data" });
    }
  });
  app2.delete("/api/bookmarks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBookmark(id);
      if (!deleted) {
        return res.status(404).json({ message: "Bookmark not found" });
      }
      res.json({ message: "Bookmark deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Failed to delete bookmark" });
    }
  });
  app2.get("/api/library", async (req, res) => {
    try {
      const items = await storage.getLibraryItems(DEMO_USER_ID);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to get library items" });
    }
  });
  app2.post("/api/library", async (req, res) => {
    try {
      const itemData = insertLibraryItemSchema.parse({
        ...req.body,
        userId: DEMO_USER_ID
      });
      const item = await storage.createLibraryItem(itemData);
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid library item data" });
    }
  });
  app2.put("/api/library/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const item = await storage.updateLibraryItem(id, updateData);
      if (!item) {
        return res.status(404).json({ message: "Library item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Failed to update library item" });
    }
  });
  app2.delete("/api/library/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteLibraryItem(id);
      if (!deleted) {
        return res.status(404).json({ message: "Library item not found" });
      }
      res.json({ message: "Library item deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Failed to delete library item" });
    }
  });
  app2.get("/api/bible/search", async (req, res) => {
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const IQ_BIBLE_API_KEY = "968991c5c1mshc63a6b5b6e7e92dp1f8685jsnbfc8e9663eed";
      const semanticResponse = await fetch("https://iq-bible.p.rapidapi.com/GetSemanticRelationsAllWords", {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": IQ_BIBLE_API_KEY,
          "X-RapidAPI-Host": "iq-bible.p.rapidapi.com"
        }
      });
      if (semanticResponse.ok) {
        const semanticWords = await semanticResponse.json();
        const queryLower = query.toLowerCase();
        const matchingWords = semanticWords.filter(
          (word) => word.toLowerCase().includes(queryLower) || queryLower.includes(word.toLowerCase())
        );
        const searchResults = await searchByKeywords(query);
        if (matchingWords.length > 0) {
          const enhancedResults = [];
          enhancedResults.push({
            book: "IQ Bible Analysis",
            chapter: 1,
            verse: 1,
            text: `Related biblical terms: ${matchingWords.slice(0, 10).join(", ")}`
          });
          enhancedResults.push(...searchResults);
          return res.json({
            query,
            results: enhancedResults
          });
        }
        return res.json({
          query,
          results: searchResults
        });
      }
      const results = await searchByKeywords(query);
      res.json({
        query,
        results
      });
    } catch (error) {
      console.error("Bible search error:", error);
      res.status(500).json({ message: "Failed to search Bible" });
    }
  });
  app2.get("/api/bible/semantic-relations", async (req, res) => {
    try {
      const IQ_BIBLE_API_KEY = "968991c5c1mshc63a6b5b6e7e92dp1f8685jsnbfc8e9663eed";
      const response = await fetch("https://iq-bible.p.rapidapi.com/GetSemanticRelationsAllWords", {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": IQ_BIBLE_API_KEY,
          "X-RapidAPI-Host": "iq-bible.p.rapidapi.com"
        }
      });
      if (!response.ok) {
        throw new Error(`IQ Bible API error: ${response.status}`);
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("IQ Bible semantic relations error:", error);
      res.status(500).json({ message: "Failed to get semantic relations" });
    }
  });
  app2.get("/api/bible/:book/:chapter", async (req, res) => {
    try {
      const { book, chapter } = req.params;
      const translation = req.query.translation || "kjv";
      const RAPIDAPI_KEY = "968991c5c1mshc63a6b5b6e7e92dp1f8685jsnbfc8e9663eed";
      if (translation === "niv") {
        try {
          const verses = [];
          let verseNum = 1;
          let hasMoreVerses = true;
          while (hasMoreVerses && verseNum <= 176) {
            try {
              const response = await fetch(`https://niv-bible.p.rapidapi.com/row?Book=${encodeURIComponent(book)}&Chapter=${chapter}&Verse=${verseNum}`, {
                method: "GET",
                headers: {
                  "X-RapidAPI-Key": RAPIDAPI_KEY,
                  "X-RapidAPI-Host": "niv-bible.p.rapidapi.com"
                }
              });
              if (response.ok) {
                const data = await response.json();
                if (data && data.text && data.text.trim()) {
                  verses.push({
                    verse: verseNum,
                    text: data.text
                  });
                  verseNum++;
                } else {
                  hasMoreVerses = false;
                }
              } else {
                hasMoreVerses = false;
              }
            } catch (error) {
              hasMoreVerses = false;
            }
          }
          if (verses.length > 0) {
            return res.json({
              book,
              chapter: parseInt(chapter),
              verses
            });
          }
        } catch (error) {
          console.log("NIV Bible API unavailable, trying Bible Search API");
        }
      }
      try {
        const response = await fetch(`https://bible-search.p.rapidapi.com/books-by-name?bookName=${encodeURIComponent(book)}`, {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": RAPIDAPI_KEY,
            "X-RapidAPI-Host": "bible-search.p.rapidapi.com"
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data && data.chapters && data.chapters[parseInt(chapter) - 1]) {
            const chapterData = data.chapters[parseInt(chapter) - 1];
            if (chapterData.verses) {
              return res.json({
                book,
                chapter: parseInt(chapter),
                verses: chapterData.verses.map((verse, index) => ({
                  verse: index + 1,
                  text: verse
                }))
              });
            }
          }
        }
      } catch (error) {
        console.log("Bible Search API unavailable, trying IQ Bible");
      }
      const IQ_BIBLE_API_KEY = process.env.IQ_BIBLE_API_KEY;
      if (IQ_BIBLE_API_KEY) {
        try {
          const response = await fetch(`https://iq-bible.p.rapidapi.com/GetVersesByBookAndChapter?BookName=${encodeURIComponent(book)}&ChapterNumber=${chapter}`, {
            method: "GET",
            headers: {
              "X-RapidAPI-Key": IQ_BIBLE_API_KEY,
              "X-RapidAPI-Host": "iq-bible.p.rapidapi.com"
            }
          });
          if (response.ok) {
            const data = await response.json();
            if (data && !data.message && Array.isArray(data)) {
              const chapterData = {
                book,
                chapter: parseInt(chapter),
                verses: data.map((verse) => ({
                  verse: verse.Verse || 1,
                  text: verse.Text || ""
                }))
              };
              return res.json(chapterData);
            }
          }
        } catch (error) {
          console.log("IQ Bible API unavailable for chapter, using search fallback");
        }
      }
      const searchResults = await searchByKeywords(`${book} ${chapter}`);
      const chapterVerses = searchResults.filter((result) => result.book.toLowerCase().includes(book.toLowerCase()) && result.chapter === parseInt(chapter)).map((result) => ({
        verse: result.verse,
        text: result.text
      })).sort((a, b) => a.verse - b.verse);
      res.json({
        book,
        chapter: parseInt(chapter),
        verses: chapterVerses
      });
    } catch (error) {
      console.error("Bible chapter error:", error);
      res.status(500).json({ message: "Failed to get Bible chapter" });
    }
  });
  app2.get("/api/strongs/:strongsNumber", async (req, res) => {
    try {
      const { strongsNumber } = req.params;
      const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
      if (!RAPIDAPI_KEY) {
        return res.status(500).json({ message: "RapidAPI key not configured" });
      }
      const response = await fetch(`https://complete-study-bible.p.rapidapi.com/search-strongs/${strongsNumber}/true/`, {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": "complete-study-bible.p.rapidapi.com"
        }
      });
      if (!response.ok) {
        throw new Error(`Complete Study Bible API error: ${response.status}`);
      }
      const data = await response.json();
      const strongsResult = {
        strongsNumber,
        originalWord: data.originalWord || "",
        transliteration: data.transliteration || "",
        pronunciation: data.pronunciation || "",
        definition: data.definition || "",
        kjvTranslations: data.kjvTranslations || [],
        occurrences: data.occurrences || []
      };
      res.json(strongsResult);
    } catch (error) {
      console.error("Strong's concordance error:", error);
      res.status(500).json({ message: "Failed to search Strong's concordance" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}
async function generateAIResponse(message) {
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  const IQ_BIBLE_API_KEY = process.env.IQ_BIBLE_API_KEY;
  if (!GOOGLE_API_KEY) {
    return "I'm experiencing technical difficulties connecting to my knowledge base. Please check that the Google API key is properly configured.";
  }
  let biblicalContext = "";
  const scripturePattern = /(\d?\s?[A-Za-z]+\s+\d+:\d+(-\d+)?)|([A-Za-z]+\s+\d+)/g;
  const potentialRefs = message.match(scripturePattern);
  const strongsPattern = /[GH]\d{3,4}/gi;
  const strongsNumbers = message.match(strongsPattern);
  const wordStudyKeywords = ["original", "greek", "hebrew", "strong", "concordance", "etymology", "definition", "meaning"];
  const isWordStudyRequest = wordStudyKeywords.some(
    (keyword) => message.toLowerCase().includes(keyword)
  );
  if (potentialRefs && potentialRefs.length > 0 && IQ_BIBLE_API_KEY) {
    try {
      const semanticResponse = await fetch("https://iq-bible.p.rapidapi.com/GetSemanticRelationsAllWords", {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": "968991c5c1mshc63a6b5b6e7e92dp1f8685jsnbfc8e9663eed",
          "X-RapidAPI-Host": "iq-bible.p.rapidapi.com"
        }
      });
      if (semanticResponse.ok) {
        const semanticWords = await semanticResponse.json();
        const referenceTerms = potentialRefs.join(" ").toLowerCase();
        const relatedTerms = semanticWords.filter(
          (word) => referenceTerms.includes(word.toLowerCase())
        );
        const scriptureTexts = [];
        for (const ref of potentialRefs.slice(0, 3)) {
          const results = await searchByKeywords(ref);
          if (results.length > 0) {
            const verse = results[0];
            scriptureTexts.push(`${verse.book} ${verse.chapter}:${verse.verse} - "${verse.text}"`);
          }
        }
        if (scriptureTexts.length > 0) {
          biblicalContext = `

Referenced Scripture:
${scriptureTexts.join("\n")}`;
          if (relatedTerms.length > 0) {
            biblicalContext += `

IQ Bible Semantic Analysis: Related biblical terms - ${relatedTerms.slice(0, 8).join(", ")}`;
          }
        }
      }
    } catch (error) {
      console.log("IQ Bible scripture reference lookup failed:", error);
    }
  }
  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
  if ((strongsNumbers || isWordStudyRequest) && RAPIDAPI_KEY) {
    try {
      let strongsContext = "";
      if (strongsNumbers && strongsNumbers.length > 0) {
        for (const strongsNum of strongsNumbers.slice(0, 3)) {
          const response = await fetch(`https://complete-study-bible.p.rapidapi.com/search-strongs/${strongsNum}/true/`, {
            method: "GET",
            headers: {
              "X-RapidAPI-Key": RAPIDAPI_KEY,
              "X-RapidAPI-Host": "complete-study-bible.p.rapidapi.com"
            }
          });
          if (response.ok) {
            const strongsData = await response.json();
            strongsContext += `

Strong's ${strongsNum}:`;
            strongsContext += `
Original Word: ${strongsData.originalWord || "N/A"}`;
            strongsContext += `
Transliteration: ${strongsData.transliteration || "N/A"}`;
            strongsContext += `
Definition: ${strongsData.definition || "N/A"}`;
            if (strongsData.kjvTranslations && strongsData.kjvTranslations.length > 0) {
              strongsContext += `
KJV Translations: ${strongsData.kjvTranslations.join(", ")}`;
            }
          }
        }
      }
      if (strongsContext) {
        biblicalContext += strongsContext;
      }
    } catch (error) {
      console.log("Strong's concordance lookup failed:", error);
    }
  }
  if (!biblicalContext && IQ_BIBLE_API_KEY) {
    try {
      const semanticResponse = await fetch("https://iq-bible.p.rapidapi.com/GetSemanticRelationsAllWords", {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": "968991c5c1mshc63a6b5b6e7e92dp1f8685jsnbfc8e9663eed",
          "X-RapidAPI-Host": "iq-bible.p.rapidapi.com"
        }
      });
      if (semanticResponse.ok) {
        const semanticWords = await semanticResponse.json();
        const messageLower = message.toLowerCase();
        const messageWords = message.split(" ");
        const relatedTerms = semanticWords.filter(
          (word) => messageLower.includes(word.toLowerCase()) || word.toLowerCase().includes(messageWords[0]?.toLowerCase() || "") || word.toLowerCase().includes(messageWords[messageWords.length - 1]?.toLowerCase() || "")
        );
        if (relatedTerms && relatedTerms.length > 0) {
          const contextResults = await searchByKeywords(relatedTerms.slice(0, 3).join(" "));
          if (contextResults.length > 0) {
            biblicalContext = `

IQ Bible Semantic Analysis found related terms: ${relatedTerms.slice(0, 5).join(", ")}

Relevant Scripture Context:
` + contextResults.slice(0, 3).map(
              (verse) => `${verse.book} ${verse.chapter}:${verse.verse} - "${verse.text?.trim()}"`
            ).join("\n");
          }
        }
      }
    } catch (error) {
      console.log("IQ Bible semantic analysis failed:", error);
    }
  }
  const systemPrompt = `# Scholar AI System Prompt (Protestant Edition)

You are The Scholar: a Spirit-led, biblically grounded AI assistant who speaks with the distinctive voice and style that empowers God's people to see themselves through heaven's lens. You communicate with prophetic insight, passionate conviction, and the kind of grace that calls people into their true identity.

You operate from a **Protestant theological framework**, upholding Scripture as ultimate authority, salvation by grace through faith, and the finished work of Jesus Christ.

### Your Teaching DNA:
You embody the prophetic, empowering style that:
- **Speaks Identity**: Constantly remind people they are sons and daughters of the King
- **Builds Faith**: Encourage bold believing and supernatural expectation  
- **Reveals Heaven's Perspective**: Show how God sees vs. natural circumstances
- **Calls Out Greatness**: See the champion in every believer and call it forth
- **Bridges Truth with Love**: Speak hard truths wrapped in tremendous grace
- **Honors Process**: Acknowledge growth while calling people higher

Your voice combines wisdom from:
- Prophetic insight and apostolic authority (like those who teach identity and empowerment)
- **Dr. Michael L. Brown** (biblical apologetics and Jewish-Christian context)
- **Bob Hamp** (inner healing and identity transformation)
- **Bill Johnson** (supernatural Kingdom perspective)
- **Danny Silk** (honor-based relationships)

### \u{1F399}\uFE0F Speaking Style:
You communicate exactly like someone who sees people through heaven's lens with passionate conviction:

- **Start with Identity**: "Listen, you are a son/daughter of the King..." or "Here's what Father sees when He looks at this verse..."
- **Use Present Tense Faith**: "God IS doing something powerful here" not "God will do"
- **Speak with Authority**: "This is what heaven looks like on earth" or "Let me tell you what this really means"
- **Build on Truth**: "The reality is..." or "Here's the thing..." followed by empowering revelation
- **Address the Heart**: "Your heart was made for this truth" or "This is why you were created"
- **Use Conversational Power**: "I want you to understand something" or "Can I tell you what I see in this passage?"
- **Connect to Purpose**: "This verse is calling out the champion in you" or "God put this truth in Scripture because He knew you'd need it"
- **Bridge Heaven and Earth**: "In the Kingdom..." or "Heaven's perspective on this is..."

### \u{1F6E1}\uFE0F Guardrails:
1. **Focus on biblical identity rather than personal prophecy.** Speak truth about who believers are in Christ without giving specific personal words.
2. **Bridge denominational perspectives with grace.** Honor core Protestant doctrine while welcoming charismatic, evangelical, and reformed believers.
3. **Offer spiritual wisdom for life challenges** while recommending pastoral care for deep emotional or mental health needs.
4. **Always point people to Scripture, prayer, and healthy church community.**
5. **For controversial topics**, respond with biblical clarity wrapped in tremendous grace, encouraging wise counsel and personal study.

### \u{1F9E0} Your Study Tools Expertise:
When providing biblical analysis, you excel at:
- **Greek/Hebrew Breakdown**: Show original words with Strong's numbers, pronunciation, and cross-references to reveal deeper meaning
- **Cross-References**: Connect verses by theme, keywords, and prophetic fulfillment between Old and New Testament
- **Commentary Insights**: Combine theological depth with practical application, always connecting to identity and calling
- **Cultural Context**: Explain historical background while bridging ancient truth to modern life
- **Topical Tags**: Identify major themes and suggest related verses for deeper study
- **Sermon Tools**: Provide outlines, illustrations, and applications with Kingdom perspective
- **Structural Patterns**: Reveal literary devices and show how passages fit in broader biblical narrative
- **Devotional Building**: Create personal reflections that build faith and reveal God's heart

Always speak life, call out greatness, and remind people they are loved, chosen, and destined for significance in God's Kingdom. Connect every truth to their royal identity as sons and daughters of the King.`;
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}

User Question: ${message}${biblicalContext}

Please respond as The Scholar using your distinctive speaking style. If relevant scripture is provided above, reference it directly in your response. IMPORTANT: Use only plain text - no asterisks, no bold formatting, no markdown. Write in natural paragraphs with your conversational, empowering tone. Speak like you're having a personal conversation about God's Word.`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });
    if (!response.ok) {
      throw new Error(`Google AI API error: ${response.status}`);
    }
    const data = await response.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Unexpected API response format");
    }
  } catch (error) {
    console.error("Error calling Google AI API:", error);
    return "I'm experiencing technical difficulties right now. Please try again in a moment, and remember that the Lord is always with you in your studies. 'Trust in the Lord with all your heart and lean not on your own understanding' (Proverbs 3:5).";
  }
}

// netlify/functions/api.ts
var app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
registerRoutes(app);
var serverlessHandler = serverless(app);
var handler = async (event, context) => {
  const result = await serverlessHandler(event, context);
  return result;
};
export {
  handler
};
