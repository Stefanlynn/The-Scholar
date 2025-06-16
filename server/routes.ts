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

  // Bible API integration using bible-api.com (free, reliable service)
  app.get("/api/bible/search", async (req, res) => {
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      // Use ESV Bible API for search functionality
      const response = await fetch(`https://api.esv.org/v3/passage/search/?q=${encodeURIComponent(query as string)}&include-passage-references=true&include-verse-numbers=true&page-size=10`, {
        method: 'GET',
        headers: {
          'Authorization': 'Token 88dc2b52c2e6eff9f1bb726721f10c0b3d0c5fef',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        // Fallback to simple keyword-based search using bible-api.com
        const fallbackResults = await searchByKeywords(query as string);
        return res.json(fallbackResults);
      }

      const data = await response.json();
      
      // Transform ESV API response to our format
      const searchResults = {
        query,
        results: data.results ? data.results.map((result: any) => ({
          book: result.reference.split(' ')[0],
          chapter: parseInt(result.reference.match(/(\d+):/)?.[1] || '1'),
          verse: parseInt(result.reference.match(/:(\d+)/)?.[1] || '1'),
          text: result.content.replace(/<[^>]*>/g, '').trim()
        })) : []
      };
      
      res.json(searchResults);
    } catch (error) {
      console.error('Bible search error:', error);
      // Fallback search
      const fallbackResults = await searchByKeywords(req.query.query as string);
      res.json(fallbackResults);
    }
  });

  app.get("/api/bible/:book/:chapter", async (req, res) => {
    try {
      const { book, chapter } = req.params;
      
      const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
      if (!RAPIDAPI_KEY) {
        return res.status(500).json({ message: "Bible API key not configured" });
      }

      const response = await fetch(`https://bible-api.com/${encodeURIComponent(book)}+${chapter}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Bible API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform the API response to match our expected format
      const chapterData = {
        book: data.reference?.split(' ')[0] || book,
        chapter: parseInt(chapter),
        verses: data.verses ? data.verses.map((verse: any) => ({
          verse: verse.verse,
          text: verse.text
        })) : []
      };
      
      res.json(chapterData);
    } catch (error) {
      console.error('Bible chapter error:', error);
      res.status(500).json({ message: "Failed to get Bible chapter" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Generate AI response using Google's Generative AI with Bible API integration
async function generateAIResponse(message: string): Promise<string> {
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
  
  if (!GOOGLE_API_KEY) {
    return "I'm experiencing technical difficulties connecting to my knowledge base. Please check that the Google API key is properly configured.";
  }

  // Enhanced context with Bible API access
  let biblicalContext = "";
  
  // Extract potential scripture references from the message
  const scripturePattern = /(\d?\s?[A-Za-z]+\s+\d+:\d+(-\d+)?)|([A-Za-z]+\s+\d+)/g;
  const potentialRefs = message.match(scripturePattern);
  
  if (potentialRefs && RAPIDAPI_KEY) {
    try {
      // Search for relevant Bible passages based on keywords
      const searchResponse = await fetch(`https://bible-search2.p.rapidapi.com/search?query=${encodeURIComponent(message)}&version=kjv&limit=3`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'bible-search2.p.rapidapi.com'
        }
      });

      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        if (searchData.verses && searchData.verses.length > 0) {
          biblicalContext = "\n\nRelevant Scripture Context:\n" + 
            searchData.verses.slice(0, 3).map((verse: any) => 
              `${verse.book_name} ${verse.chapter}:${verse.verse} - "${verse.text}"`
            ).join("\n");
        }
      }
    } catch (error) {
      console.log('Bible API context search failed:', error);
    }
  }

  const systemPrompt = `# Scholar AI System Prompt (Protestant Edition)

You are The Scholar: a Spirit-led, biblically grounded AI assistant created to help pastors, Bible teachers, and communicators study and present the Word of God with clarity, depth, and integrity.

You operate from a **Protestant theological framework**, upholding the authority of Scripture (sola scriptura), salvation by grace through faith (sola fide), and the finished work of Jesus Christ.

Your voice is a blend of:
- **Kris Vallotton** (prophetic, revelatory, Spirit-aware)
- **Dr. Michael L. Brown** and **Cliff Knechtle** (biblical apologetics and Jewish-Christian context)
- **Dr. Frank Turek** (logical defense of the Christian faith)
- **Bob Hamp** (inner healing and Spirit-led counseling)
- **John Maxwell** and **Andy Stanley** (clear, structured, transformational communication)

### 🎙️ Tone:
Encouraging, humble, biblically faithful, conversational, and rooted in the Holy Spirit's leadership.

### 🛡️ Guardrails:
1. **Do not give prophetic words, dream interpretations, or personal destiny claims.**
2. **Avoid definitive statements on denominational controversies.** Present perspectives while honoring core Protestant doctrine.
3. If a user seeks **emotional, mental health, or deliverance counseling**, offer spiritual wisdom and recommend connecting with a trusted pastor, counselor, or deliverance minister.
4. **Always point users back to Scripture, prayer, and local church community.**
5. If asked about **controversial topics** (e.g., gender, hell, salvation, suffering), respond with:
   - Biblical clarity from a Protestant lens
   - Acknowledgment of pastoral sensitivity
   - Encouragement to study, pray, and seek counsel

### 🧠 Capabilities:
- Break down Scripture with historical, cultural, and theological insight (Greek/Hebrew tools, Bible API integration, cross-references).
- Provide **sermon and study guidance**: titles, outlines, illustrations, themes, and applications.
- Give feedback on **sermon delivery** (structure, clarity, pacing, tone, story use).
- Adapt responses for different teaching styles or audiences (youth, adults, seekers).
- Offer devotionals, insights, and theological summaries in your tone and voice.
- Remain non-denominational Protestant—welcoming of Pentecostal, Evangelical, Reformed, and Charismatic users.

Always close challenging conversations with hope, grace, and a reminder that Jesus is the center of truth, transformation, and purpose.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nUser Question: ${message}${biblicalContext}\n\nPlease respond as The Scholar, incorporating your Protestant theological framework and pastoral heart. If relevant scripture is provided above, reference it directly in your response.`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
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
      throw new Error('Unexpected API response format');
    }
  } catch (error) {
    console.error('Error calling Google AI API:', error);
    return "I'm experiencing technical difficulties right now. Please try again in a moment, and remember that the Lord is always with you in your studies. 'Trust in the Lord with all your heart and lean not on your own understanding' (Proverbs 3:5).";
  }
}
