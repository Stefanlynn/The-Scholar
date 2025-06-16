import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertChatMessageSchema, 
  insertNoteSchema, 
  insertSermonSchema, 
  insertBookmarkSchema, 
  insertLibraryItemSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Temporary user ID for demo (in real app would come from authentication)
  const DEMO_USER_ID = 1;

  // Chat Messages
  app.get("/api/chat/messages", async (req, res) => {
    try {
      const messages = await storage.getChatMessages(DEMO_USER_ID);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to get chat messages" });
    }
  });

  app.post("/api/chat/messages", async (req, res) => {
    try {
      const messageData = insertChatMessageSchema.parse({
        ...req.body,
        userId: DEMO_USER_ID
      });
      
      // Simulate AI response
      const aiResponse = await generateAIResponse(messageData.message);
      messageData.response = aiResponse;
      
      const message = await storage.createChatMessage(messageData);
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid message data" });
    }
  });

  // Notes
  app.get("/api/notes", async (req, res) => {
    try {
      const notes = await storage.getNotes(DEMO_USER_ID);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Failed to get notes" });
    }
  });

  app.post("/api/notes", async (req, res) => {
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

  app.put("/api/notes/:id", async (req, res) => {
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

  app.delete("/api/notes/:id", async (req, res) => {
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

  // Sermons
  app.get("/api/sermons", async (req, res) => {
    try {
      const sermons = await storage.getSermons(DEMO_USER_ID);
      res.json(sermons);
    } catch (error) {
      res.status(500).json({ message: "Failed to get sermons" });
    }
  });

  app.post("/api/sermons", async (req, res) => {
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

  app.put("/api/sermons/:id", async (req, res) => {
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

  app.delete("/api/sermons/:id", async (req, res) => {
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

  // Bookmarks
  app.get("/api/bookmarks", async (req, res) => {
    try {
      const bookmarks = await storage.getBookmarks(DEMO_USER_ID);
      res.json(bookmarks);
    } catch (error) {
      res.status(500).json({ message: "Failed to get bookmarks" });
    }
  });

  app.post("/api/bookmarks", async (req, res) => {
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

  app.delete("/api/bookmarks/:id", async (req, res) => {
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

  // Library Items
  app.get("/api/library", async (req, res) => {
    try {
      const items = await storage.getLibraryItems(DEMO_USER_ID);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to get library items" });
    }
  });

  app.post("/api/library", async (req, res) => {
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

  app.put("/api/library/:id", async (req, res) => {
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

  app.delete("/api/library/:id", async (req, res) => {
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

  // Bible API proxy (using API.Bible or similar service)
  app.get("/api/bible/search", async (req, res) => {
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      // Here you would integrate with a Bible API like API.Bible
      // For now, returning a placeholder response
      const searchResults = {
        query,
        results: [
          {
            book: "Matthew",
            chapter: 13,
            verse: 3,
            text: "And he spake many things unto them in parables, saying, Behold, a sower went forth to sow;"
          }
        ]
      };
      
      res.json(searchResults);
    } catch (error) {
      res.status(500).json({ message: "Failed to search Bible" });
    }
  });

  app.get("/api/bible/:book/:chapter", async (req, res) => {
    try {
      const { book, chapter } = req.params;
      
      // Here you would integrate with a Bible API
      // For now, returning a placeholder response
      const chapterData = {
        book,
        chapter: parseInt(chapter),
        verses: [
          { verse: 1, text: "Sample verse text..." },
        ]
      };
      
      res.json(chapterData);
    } catch (error) {
      res.status(500).json({ message: "Failed to get Bible chapter" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Simulate AI response generation
async function generateAIResponse(message: string): Promise<string> {
  // In a real implementation, this would call an AI API like OpenAI, Claude, etc.
  const responses = [
    "I'd be happy to help you with that biblical question. Let me provide you with some theological insights and context.",
    "That's an excellent question about Scripture. Here's what the text reveals in its historical and theological context.",
    "This passage offers rich material for study and preaching. Let me break down the key themes and applications.",
    "The original Hebrew/Greek provides additional depth to this passage. Here's what scholars have discovered.",
    "This text connects beautifully with other scriptural themes. Let me show you some cross-references and patterns."
  ];
  
  // Simple keyword-based response selection for demo
  if (message.toLowerCase().includes('parable')) {
    return "The Parable of the Sower (Matthew 13:1-23) is a foundational teaching on how people receive God's word. The four soils represent different heart conditions: the hard path (Word stolen by Satan), rocky ground (shallow faith that falls away), thorny ground (worldly concerns choke the Word), and good soil (receptive heart that bears fruit). This parable teaches us about the importance of heart condition in receiving and responding to God's truth.";
  }
  
  if (message.toLowerCase().includes('sermon') || message.toLowerCase().includes('preach')) {
    return "For sermon preparation, I'd recommend structuring your message around the key theological themes. Start with the historical context, then move to the textual analysis, and conclude with practical applications for your congregation. Consider using the three-point structure: What does it say? What does it mean? How does it apply?";
  }
  
  return responses[Math.floor(Math.random() * responses.length)];
}
