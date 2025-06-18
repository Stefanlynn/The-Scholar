import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { 
  insertChatMessageSchema, 
  insertNoteSchema, 
  insertSermonSchema, 
  insertBookmarkSchema, 
  insertLibraryItemSchema,
  insertUserSchema,
  updateUserProfileSchema
} from "@shared/schema";
import { createClient } from '@supabase/supabase-js';

// Extend Express Request type to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        user_metadata?: {
          full_name?: string;
          avatar_url?: string;
        };
      };
    }
  }
}

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage_multer = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage_multer,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Middleware to verify user authentication
async function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No authorization header" });
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user || !user.email) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata
    };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Authentication failed" });
  }
}

// Bible search function using API-Bible for authentic scripture data
async function searchByKeywords(query: string) {
  try {
    // Use API-Bible service for authentic biblical text
    const response = await fetch(`https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-02/search?query=${encodeURIComponent(query)}&limit=50`, {
      method: 'GET',
      headers: {
        'api-key': process.env.RAPIDAPI_KEY || ''
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (data.data && data.data.verses) {
        return data.data.verses.map((verse: any) => {
          const reference = verse.reference;
          const bookMatch = reference.match(/^([^0-9]+)/);
          const chapterVerseMatch = reference.match(/(\d+):(\d+)/);
          
          return {
            book: bookMatch ? bookMatch[1].trim() : "Unknown",
            chapter: chapterVerseMatch ? parseInt(chapterVerseMatch[1]) : 1,
            verse: chapterVerseMatch ? parseInt(chapterVerseMatch[2]) : 1,
            text: verse.text.replace(/<[^>]*>/g, '') // Remove HTML tags
          };
        });
      }
    }
  } catch (error) {
    console.log('API-Bible search failed, trying alternative:', error);
  }
  
  // Fallback to bible-api.com for additional coverage
  try {
    const response = await fetch(`https://bible-api.com/${encodeURIComponent(query)}`);
    if (response.ok) {
      const data = await response.json();
      if (data.verses && Array.isArray(data.verses)) {
        return data.verses.map((verse: any) => ({
          book: verse.book_name || data.reference?.split(' ')[0] || 'Unknown',
          chapter: verse.chapter || data.chapter || 1,
          verse: verse.verse || data.verse || 1,
          text: verse.text || data.text || ''
        }));
      } else if (data.text) {
        return [{
          book: data.reference?.split(' ')[0] || 'Unknown',
          chapter: data.chapter || 1,
          verse: data.verse || 1,
          text: data.text
        }];
      }
    }
  } catch (error) {
    console.log('Bible-api.com also failed:', error);
  }
  
  return [];
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files statically
  app.use('/uploads', express.static(uploadDir));
  
  // Users
  app.get("/api/users/current", authenticateUser, async (req, res) => {
    try {
      const user = await storage.getUserByEmail(req.user.email);
      if (!user) {
        // Create user if they don't exist (first time login)
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
        return res.json({ id: newUser.id, username: newUser.fullName, hasCompletedOnboarding: newUser.hasCompletedOnboarding });
      }
      res.json({ id: user.id, username: user.fullName, hasCompletedOnboarding: user.hasCompletedOnboarding });
    } catch (error) {
      console.error("Error fetching current user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.post("/api/users/complete-onboarding", authenticateUser, async (req, res) => {
    try {
      const updatedUser = await storage.updateUser(req.user.id, { hasCompletedOnboarding: true });
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error completing onboarding:", error);
      res.status(500).json({ error: "Failed to complete onboarding" });
    }
  });

  // Profile Management Routes
  app.get("/api/profile", authenticateUser, async (req, res) => {
    try {
      const user = await storage.getUserByEmail(req.user.email);
      if (!user) {
        // Create user if they don't exist (first time login)
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

  app.put("/api/profile", authenticateUser, async (req, res) => {
    try {
      const updateData = updateUserProfileSchema.parse(req.body);
      
      const updatedUser = await storage.updateUser(req.user!.id, updateData);
      if (!updatedUser) {
        return res.status(404).json({ error: "Failed to update user" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Add PATCH endpoint for profile updates (what the frontend expects)
  app.patch("/api/profile", authenticateUser, async (req, res) => {
    try {
      const updateData = updateUserProfileSchema.parse(req.body);
      
      const updatedUser = await storage.updateUser(req.user!.id, updateData);
      if (!updatedUser) {
        return res.status(404).json({ error: "Failed to update user" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Profile picture upload endpoint
  app.post("/api/profile/upload-picture", authenticateUser, upload.single('profilePicture'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      
      const updatedUser = await storage.updateUser(req.user!.id, { 
        profilePicture: imageUrl 
      });
      
      if (!updatedUser) {
        return res.status(404).json({ error: "Failed to update user" });
      }
      
      res.json({ profilePicture: imageUrl });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      res.status(500).json({ error: "Failed to upload profile picture" });
    }
  });

  app.get("/api/profile/stats", authenticateUser, async (req, res) => {
    try {
      const user = await storage.getUserByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const [notes, sermons, bookmarks, chatMessages, libraryItems] = await Promise.all([
        storage.getNotes(user.id),
        storage.getSermons(user.id),
        storage.getBookmarks(user.id),
        storage.getChatMessages(user.id),
        storage.getLibraryItems(user.id)
      ]);

      // Calculate recent activity (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentNotes = notes.filter(note => new Date(note.createdAt) > sevenDaysAgo);
      const recentSermons = sermons.filter(sermon => new Date(sermon.createdAt) > sevenDaysAgo);
      const recentBookmarks = bookmarks.filter(bookmark => new Date(bookmark.createdAt) > sevenDaysAgo);
      const recentChats = chatMessages.filter(msg => new Date(msg.timestamp) > sevenDaysAgo);
      const recentLibrary = libraryItems.filter(item => new Date(item.createdAt) > sevenDaysAgo);

      // Get most recent activity for each type
      const lastNoteDate = notes.length > 0 ? Math.max(...notes.map(n => new Date(n.createdAt).getTime())) : null;
      const lastSermonDate = sermons.length > 0 ? Math.max(...sermons.map(s => new Date(s.createdAt).getTime())) : null;
      const lastBookmarkDate = bookmarks.length > 0 ? Math.max(...bookmarks.map(b => new Date(b.createdAt).getTime())) : null;
      const lastChatDate = chatMessages.length > 0 ? Math.max(...chatMessages.map(m => new Date(m.timestamp).getTime())) : null;

      res.json({
        // Total counts
        notes: notes.length,
        sermons: sermons.length,
        bookmarks: bookmarks.length,
        chatSessions: chatMessages.length,
        libraryItems: libraryItems.length,
        
        // Recent activity (last 7 days)
        recentActivity: {
          notes: recentNotes.length,
          sermons: recentSermons.length,
          bookmarks: recentBookmarks.length,
          chatSessions: recentChats.length,
          libraryItems: recentLibrary.length,
          total: recentNotes.length + recentSermons.length + recentBookmarks.length + recentChats.length + recentLibrary.length
        },

        // Last activity timestamps
        lastActivity: {
          note: lastNoteDate ? new Date(lastNoteDate).toISOString() : null,
          sermon: lastSermonDate ? new Date(lastSermonDate).toISOString() : null,
          bookmark: lastBookmarkDate ? new Date(lastBookmarkDate).toISOString() : null,
          chat: lastChatDate ? new Date(lastChatDate).toISOString() : null
        }
      });
    } catch (error) {
      console.error("Error fetching profile stats:", error);
      res.status(500).json({ error: "Failed to fetch profile stats" });
    }
  });

  app.delete("/api/profile", authenticateUser, async (req, res) => {
    try {
      const user = await storage.getUserByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Delete user's data
      await storage.deleteUser(user.id);
      
      // Delete user from Supabase auth
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

  // Chat Messages
  app.get("/api/chat/messages", authenticateUser, async (req, res) => {
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

  app.post("/api/chat/messages", authenticateUser, async (req, res) => {
    try {
      const user = await storage.getUserByEmail(req.user!.email);
      if (!user) {
        // Create user if they don't exist (first time login)
        const newUser = await storage.createUser({
          id: req.user!.id,
          email: req.user!.email,
          fullName: req.user!.user_metadata?.full_name || null,
          bio: null,
          ministryRole: null,
          profilePicture: req.user!.user_metadata?.avatar_url || null,
          defaultBibleTranslation: "NIV",
          darkMode: true,
          notifications: true,
          hasCompletedOnboarding: false
        });
        
        const messageData = insertChatMessageSchema.parse({
          message: req.body.message,
          userId: newUser.id
        });
        
        // Generate AI response with mode context
        const mode = req.body.mode || "study"; // Default to study mode
        const aiResponse = await generateAIResponse(messageData.message, mode);
        messageData.response = aiResponse;
        
        const message = await storage.createChatMessage(messageData);
        res.json(message);
        return;
      }

      const messageData = insertChatMessageSchema.parse({
        message: req.body.message,
        userId: user.id
      });
      
      // Generate AI response with mode context
      const mode = req.body.mode || "study"; // Default to study mode
      const aiResponse = await generateAIResponse(messageData.message, mode);
      messageData.response = aiResponse;
      
      const message = await storage.createChatMessage(messageData);
      res.json(message);
    } catch (error) {
      console.error('Chat message error:', error);
      res.status(400).json({ message: "Invalid message data" });
    }
  });

  // Study tools endpoint for Bible analysis requests
  app.post("/api/chat/send", authenticateUser, async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required" });
      }

      const user = await storage.getUserByEmail(req.user!.email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const messageData = insertChatMessageSchema.parse({
        message: message,
        userId: user.id
      });
      
      // Generate AI response using the same system as chat
      const aiResponse = await generateAIResponse(messageData.message);
      messageData.response = aiResponse;
      
      // Store the study tool request and response
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

  // Sermon enhancement endpoint for AI-powered sermon workspace features
  app.post("/api/chat/enhance", async (req, res) => {
    try {
      const { action, text, style } = req.body;
      
      if (!action || !text) {
        return res.status(400).json({ error: "Action and text are required" });
      }

      let enhancementPrompt = "";
      
      switch (action) {
        case "expand":
          enhancementPrompt = `As The Scholar, a Spirit-led biblical study assistant, expand on this sermon point with deeper biblical insight, practical application, and encouraging truth that calls out the royal identity of believers as children of the King. Use your access to biblical knowledge and cross-references to provide rich, authentic content:

"${text}"

Provide an expanded section that:
- Builds faith and reveals God's heart for His people
- Includes relevant cross-references and biblical context
- Applies the truth practically to believers' lives
- Maintains a prophetic, empowering tone that speaks identity`;
          break;
          
        case "rewrite":
          enhancementPrompt = `As The Scholar, rewrite this sermon content more clearly and powerfully. Use a prophetic, empowering tone that speaks identity and calls out greatness in believers. Access biblical knowledge to enhance the message:

"${text}"

Rewrite this with:
- Clarity, grace, and empowering truth
- Better flow while maintaining the core message
- Biblical backing and authentic scriptural insight
- Language that builds faith and reveals believers' royal identity`;
          break;
          
        case "add_verse":
          enhancementPrompt = `As The Scholar, find 2-3 relevant Bible verses that directly relate to this sermon point. Return ONLY the scripture references and verse text, no explanations or commentary:

"${text}"

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

"${text}"

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

Here are the sermon notes: "${text}"

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
"${text}"

Pull Scripture text from Bible knowledge if specific verses are mentioned. Do not shorten the message - expand it into a full-length sermon using the selected style above.`;
          break;

        case "format_outline":
          enhancementPrompt = `As The Scholar, transform this sermon content into a clear, structured outline format with main points, sub-points, and bullet lists:

"${text}"

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

"${text}"

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

"${text}"

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

      // Generate AI response using the same system as chat
      const aiResponse = await generateAIResponse(enhancementPrompt);
      
      // For outline conversion, parse the response to extract structured data
      let responseData: any = { message: aiResponse };
      if (action === "convert_outline") {
        try {
          // Extract outline structure from AI response
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
          // Keep the original response if parsing fails
        }
      }
      
      res.json(responseData);
    } catch (error) {
      console.error("Enhancement error:", error);
      res.status(500).json({ error: "Failed to enhance content" });
    }
  });

  // Notes
  app.get("/api/notes", authenticateUser, async (req, res) => {
    try {
      const user = await storage.getUserByEmail(req.user!.email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const notes = await storage.getNotes(user.id);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Failed to get notes" });
    }
  });

  app.post("/api/notes", authenticateUser, async (req, res) => {
    try {
      const user = await storage.getUserByEmail(req.user!.email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const noteData = insertNoteSchema.parse({
        ...req.body,
        userId: user.id
      });
      const note = await storage.createNote(noteData);
      res.json(note);
    } catch (error) {
      res.status(400).json({ message: "Invalid note data" });
    }
  });

  app.put("/api/notes/:id", authenticateUser, async (req, res) => {
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

  app.delete("/api/notes/:id", authenticateUser, async (req, res) => {
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
  app.get("/api/sermons", authenticateUser, async (req, res) => {
    try {
      const user = await storage.getUserByEmail(req.user!.email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const sermons = await storage.getSermons(user.id);
      res.json(sermons);
    } catch (error) {
      res.status(500).json({ message: "Failed to get sermons" });
    }
  });

  app.post("/api/sermons", authenticateUser, async (req, res) => {
    try {
      const user = await storage.getUserByEmail(req.user!.email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const sermonData = insertSermonSchema.parse({
        ...req.body,
        userId: user.id
      });
      const sermon = await storage.createSermon(sermonData);
      res.json(sermon);
    } catch (error) {
      res.status(400).json({ message: "Invalid sermon data" });
    }
  });

  app.put("/api/sermons/:id", authenticateUser, async (req, res) => {
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

  app.delete("/api/sermons/:id", authenticateUser, async (req, res) => {
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
  app.get("/api/bookmarks", authenticateUser, async (req, res) => {
    try {
      const user = await storage.getUserByEmail(req.user!.email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const bookmarks = await storage.getBookmarks(user.id);
      res.json(bookmarks);
    } catch (error) {
      res.status(500).json({ message: "Failed to get bookmarks" });
    }
  });

  app.post("/api/bookmarks", authenticateUser, async (req, res) => {
    try {
      const user = await storage.getUserByEmail(req.user!.email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const bookmarkData = insertBookmarkSchema.parse({
        ...req.body,
        userId: user.id
      });
      const bookmark = await storage.createBookmark(bookmarkData);
      res.json(bookmark);
    } catch (error) {
      res.status(400).json({ message: "Invalid bookmark data" });
    }
  });

  app.delete("/api/bookmarks/:id", authenticateUser, async (req, res) => {
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
  app.get("/api/library", authenticateUser, async (req, res) => {
    try {
      const user = await storage.getUserByEmail(req.user!.email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const items = await storage.getLibraryItems(user.id);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to get library items" });
    }
  });

  app.post("/api/library", authenticateUser, async (req, res) => {
    try {
      const user = await storage.getUserByEmail(req.user!.email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const itemData = insertLibraryItemSchema.parse({
        ...req.body,
        userId: user.id
      });
      const item = await storage.createLibraryItem(itemData);
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid library item data" });
    }
  });

  app.put("/api/library/:id", authenticateUser, async (req, res) => {
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

  app.delete("/api/library/:id", authenticateUser, async (req, res) => {
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

  // Bible API integration using IQ Bible semantic relations
  app.get("/api/bible/search", async (req, res) => {
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      // Use IQ Bible API with subscription
      const IQ_BIBLE_API_KEY = "968991c5c1mshc63a6b5b6e7e92dp1f8685jsnbfc8e9663eed";
      
      // Get semantic relations from IQ Bible API
      const semanticResponse = await fetch('https://iq-bible.p.rapidapi.com/GetSemanticRelationsAllWords', {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': IQ_BIBLE_API_KEY,
          'X-RapidAPI-Host': 'iq-bible.p.rapidapi.com'
        }
      });

      if (semanticResponse.ok) {
        const semanticWords = await semanticResponse.json();
        
        // Search through IQ Bible semantic words for matches
        const queryLower = (query as string).toLowerCase();
        const matchingWords = semanticWords.filter((word: string) => 
          word.toLowerCase().includes(queryLower) || 
          queryLower.includes(word.toLowerCase())
        );
        
        // Use matching semantic words to enhance search with authentic biblical data
        const searchResults = await searchByKeywords(query as string);
        
        // If we have semantic matches, enhance the results
        if (matchingWords.length > 0) {
          const enhancedResults = [];
          
          // Add semantic analysis information
          enhancedResults.push({
            book: "IQ Bible Analysis",
            chapter: 1,
            verse: 1,
            text: `Related biblical terms: ${matchingWords.slice(0, 10).join(', ')}`
          });
          
          // Add the actual biblical search results
          enhancedResults.push(...searchResults);
          
          return res.json({
            query: query as string,
            results: enhancedResults
          });
        }
        
        // Return regular search results with IQ Bible enhancement
        return res.json({
          query: query as string,
          results: searchResults
        });
      }
      
      // Fallback to regular search if IQ Bible API fails
      const results = await searchByKeywords(query as string);
      res.json({
        query: query as string,
        results
      });
    } catch (error) {
      console.error('Bible search error:', error);
      res.status(500).json({ message: "Failed to search Bible" });
    }
  });

  // Get semantic relations for biblical words using IQ Bible API
  app.get("/api/bible/semantic-relations", async (req, res) => {
    try {
      const IQ_BIBLE_API_KEY = process.env.IQ_BIBLE_API_KEY;

      const response = await fetch('https://iq-bible.p.rapidapi.com/GetSemanticRelationsAllWords', {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': IQ_BIBLE_API_KEY,
          'X-RapidAPI-Host': 'iq-bible.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error(`IQ Bible API error: ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('IQ Bible semantic relations error:', error);
      res.status(500).json({ message: "Failed to get semantic relations" });
    }
  });

  app.get("/api/bible/:book/:chapter", async (req, res) => {
    try {
      const { book, chapter } = req.params;
      const translation = req.query.translation || 'kjv';
      const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

      // Try NIV Bible API for NIV translation
      if (translation === 'niv' && RAPIDAPI_KEY) {
        try {
          console.log(`Fetching NIV for ${book} ${chapter}`);
          // Get all verses for the chapter using NIV Bible API
          const verses = [];
          let verseNum = 1;
          let hasMoreVerses = true;

          while (hasMoreVerses && verseNum <= 176) { // Max verses in any chapter
            try {
              const response = await fetch(`https://niv-bible.p.rapidapi.com/row?Book=${encodeURIComponent(book)}&Chapter=${chapter}&Verse=${verseNum}`, {
                method: 'GET',
                headers: {
                  'X-RapidAPI-Key': RAPIDAPI_KEY,
                  'X-RapidAPI-Host': 'niv-bible.p.rapidapi.com'
                }
              });

              if (response.ok) {
                const data = await response.json();
                // NIV API returns data in format: {"Text":{"21809":"verse text"}}
                if (data && data.Text) {
                  const textValues = Object.values(data.Text);
                  if (textValues.length > 0 && textValues[0]) {
                    verses.push({
                      verse: verseNum,
                      text: textValues[0] as string
                    });
                    verseNum++;
                  } else {
                    hasMoreVerses = false;
                  }
                } else {
                  hasMoreVerses = false;
                }
              } else {
                if (response.status === 429) {
                  console.log(`NIV API rate limit exceeded`);
                } else {
                  console.log(`NIV API error for verse ${verseNum}: ${response.status}`);
                }
                hasMoreVerses = false;
              }
            } catch (error) {
              console.log(`NIV API exception for verse ${verseNum}:`, error);
              hasMoreVerses = false;
            }
          }

          if (verses.length > 0) {
            console.log(`Successfully fetched ${verses.length} NIV verses`);
            return res.json({
              book: book,
              chapter: parseInt(chapter),
              verses: verses
            });
          } else {
            console.log('No NIV verses found, falling back to other APIs');
          }
        } catch (error) {
          console.log('NIV Bible API error:', error);
        }
      }

      // Only use fallback APIs for KJV or when NIV fails completely
      if (RAPIDAPI_KEY && (translation === 'kjv' || translation !== 'niv')) {
        try {
          console.log(`Trying Bible Search API for ${translation}`);
          const response = await fetch(`https://bible-search.p.rapidapi.com/books-by-name?bookName=${encodeURIComponent(book)}`, {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': RAPIDAPI_KEY,
              'X-RapidAPI-Host': 'bible-search.p.rapidapi.com'
            }
          });

        if (response.ok) {
          const data = await response.json();
          if (data && data.chapters && data.chapters[parseInt(chapter) - 1]) {
            const chapterData = data.chapters[parseInt(chapter) - 1];
            if (chapterData.verses) {
              console.log(`Successfully fetched ${chapterData.verses.length} verses from Bible Search API`);
              return res.json({
                book: book,
                chapter: parseInt(chapter),
                verses: chapterData.verses.map((verse: any, index: number) => ({
                  verse: index + 1,
                  text: verse
                }))
              });
            }
          }
        }
        } catch (error) {
          console.log('Bible Search API unavailable, trying IQ Bible');
        }
      }
      
      // Try IQ Bible API as fallback for KJV only
      const IQ_BIBLE_API_KEY = process.env.IQ_BIBLE_API_KEY;
      if (IQ_BIBLE_API_KEY && translation === 'kjv') {
        try {
          console.log(`Trying IQ Bible API for KJV`);
          const response = await fetch(`https://iq-bible.p.rapidapi.com/GetVersesByBookAndChapter?BookName=${encodeURIComponent(book)}&ChapterNumber=${chapter}`, {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': IQ_BIBLE_API_KEY,
              'X-RapidAPI-Host': 'iq-bible.p.rapidapi.com'
            }
          });

          if (response.ok) {
            const data = await response.json();
            if (data && !data.message && Array.isArray(data)) {
              console.log(`Successfully fetched ${data.length} verses from IQ Bible API`);
              const chapterData = {
                book: book,
                chapter: parseInt(chapter),
                verses: data.map((verse: any) => ({
                  verse: verse.Verse || 1,
                  text: verse.Text || ''
                }))
              };
              return res.json(chapterData);
            }
          }
        } catch (error) {
          console.log('IQ Bible API unavailable for chapter, using search fallback');
        }
      }
      
      // If NIV was requested but failed, return error with specific reason
      if (translation === 'niv') {
        return res.status(503).json({ 
          error: 'NIV translation quota exceeded',
          message: 'API rate limit reached. Please use KJV translation.',
          fallback: 'kjv'
        });
      }

      // Final fallback to search-based results
      const searchResults = await searchByKeywords(`${book} ${chapter}`);
      
      // Filter and organize results by chapter
      const chapterVerses = searchResults
        .filter(result => result.book.toLowerCase().includes(book.toLowerCase()) && result.chapter === parseInt(chapter))
        .map(result => ({
          verse: result.verse,
          text: result.text
        }))
        .sort((a, b) => a.verse - b.verse);
      
      res.json({
        book: book,
        chapter: parseInt(chapter),
        verses: chapterVerses
      });
    } catch (error) {
      console.error('Bible chapter error:', error);
      res.status(500).json({ message: "Failed to get Bible chapter" });
    }
  });

  // Strong's concordance lookup using Complete Study Bible API
  app.get("/api/strongs/:strongsNumber", async (req, res) => {
    try {
      const { strongsNumber } = req.params;
      const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

      if (!RAPIDAPI_KEY) {
        return res.status(500).json({ message: "RapidAPI key not configured" });
      }

      // Call Complete Study Bible API for Strong's lookup
      const response = await fetch(`https://complete-study-bible.p.rapidapi.com/search-strongs/${strongsNumber}/true/`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'complete-study-bible.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error(`Complete Study Bible API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform the API response to match our interface
      const strongsResult = {
        strongsNumber: strongsNumber,
        originalWord: data.originalWord || '',
        transliteration: data.transliteration || '',
        pronunciation: data.pronunciation || '',
        definition: data.definition || '',
        kjvTranslations: data.kjvTranslations || [],
        occurrences: data.occurrences || []
      };

      res.json(strongsResult);
    } catch (error) {
      console.error('Strong\'s concordance error:', error);
      res.status(500).json({ message: "Failed to search Strong's concordance" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}



// Generate AI response using Google's Generative AI with Bible API integration
async function generateAIResponse(message: string, mode: string = "study"): Promise<string> {
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  const IQ_BIBLE_API_KEY = process.env.IQ_BIBLE_API_KEY;
  
  if (!GOOGLE_API_KEY) {
    return "I'm experiencing technical difficulties connecting to my knowledge base. Please check that the Google API key is properly configured.";
  }

  // Enhanced context with Bible API access
  let biblicalContext = "";
  
  // Extract potential scripture references from the message
  const scripturePattern = /(\d?\s?[A-Za-z]+\s+\d+:\d+(-\d+)?)|([A-Za-z]+\s+\d+)/g;
  const potentialRefs = message.match(scripturePattern);
  
  // Extract Strong's numbers from the message (G#### or H####)
  const strongsPattern = /[GH]\d{3,4}/gi;
  const strongsNumbers = message.match(strongsPattern);
  
  // Check for biblical word study requests
  const wordStudyKeywords = ['original', 'greek', 'hebrew', 'strong', 'concordance', 'etymology', 'definition', 'meaning'];
  const isWordStudyRequest = wordStudyKeywords.some(keyword => 
    message.toLowerCase().includes(keyword)
  );
  
  // Priority 1: If specific verses are mentioned, use IQ Bible API for Scripture lookup
  if (potentialRefs && potentialRefs.length > 0 && IQ_BIBLE_API_KEY) {
    try {
      // Use IQ Bible semantic analysis to enhance scripture reference understanding
      const semanticResponse = await fetch('https://iq-bible.p.rapidapi.com/GetSemanticRelationsAllWords', {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': "968991c5c1mshc63a6b5b6e7e92dp1f8685jsnbfc8e9663eed",
          'X-RapidAPI-Host': 'iq-bible.p.rapidapi.com'
        }
      });

      if (semanticResponse.ok) {
        const semanticWords = await semanticResponse.json();
        
        // Extract key terms from the scripture references for IQ Bible analysis
        const referenceTerms = potentialRefs.join(' ').toLowerCase();
        const relatedTerms = semanticWords.filter((word: string) => 
          referenceTerms.includes(word.toLowerCase())
        );

        // Get Scripture text and IQ Bible enhanced context
        const scriptureTexts = [];
        for (const ref of potentialRefs.slice(0, 3)) {
          const results = await searchByKeywords(ref);
          if (results.length > 0) {
            const verse = results[0];
            scriptureTexts.push(`${verse.book} ${verse.chapter}:${verse.verse} - "${verse.text}"`);
          }
        }
        
        if (scriptureTexts.length > 0) {
          biblicalContext = `\n\nReferenced Scripture:\n${scriptureTexts.join('\n')}`;
          
          if (relatedTerms.length > 0) {
            biblicalContext += `\n\nIQ Bible Semantic Analysis: Related biblical terms - ${relatedTerms.slice(0, 8).join(', ')}`;
          }
        }
      }
    } catch (error) {
      console.log('IQ Bible scripture reference lookup failed:', error);
    }
  }

  // Priority 2: Strong's concordance lookup for word studies
  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
  if ((strongsNumbers || isWordStudyRequest) && RAPIDAPI_KEY) {
    try {
      let strongsContext = "";
      
      // If specific Strong's numbers are mentioned, look them up
      if (strongsNumbers && strongsNumbers.length > 0) {
        for (const strongsNum of strongsNumbers.slice(0, 3)) {
          const response = await fetch(`https://complete-study-bible.p.rapidapi.com/search-strongs/${strongsNum}/true/`, {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': RAPIDAPI_KEY,
              'X-RapidAPI-Host': 'complete-study-bible.p.rapidapi.com'
            }
          });

          if (response.ok) {
            const strongsData = await response.json();
            strongsContext += `\n\nStrong's ${strongsNum}:`;
            strongsContext += `\nOriginal Word: ${strongsData.originalWord || 'N/A'}`;
            strongsContext += `\nTransliteration: ${strongsData.transliteration || 'N/A'}`;
            strongsContext += `\nDefinition: ${strongsData.definition || 'N/A'}`;
            if (strongsData.kjvTranslations && strongsData.kjvTranslations.length > 0) {
              strongsContext += `\nKJV Translations: ${strongsData.kjvTranslations.join(', ')}`;
            }
          }
        }
      }
      
      if (strongsContext) {
        biblicalContext += strongsContext;
      }
    } catch (error) {
      console.log('Strong\'s concordance lookup failed:', error);
    }
  }
  
  // Priority 2: If no specific verses but IQ Bible can enhance context
  if (!biblicalContext && IQ_BIBLE_API_KEY) {
    try {
      // Get semantic relations from IQ Bible API for enhanced biblical context
      const semanticResponse = await fetch('https://iq-bible.p.rapidapi.com/GetSemanticRelationsAllWords', {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': "968991c5c1mshc63a6b5b6e7e92dp1f8685jsnbfc8e9663eed",
          'X-RapidAPI-Host': 'iq-bible.p.rapidapi.com'
        }
      });

      if (semanticResponse.ok) {
        const semanticWords = await semanticResponse.json();
        
        // Find related biblical terms for the user's message
        const messageLower = message.toLowerCase();
        const messageWords = message.split(' ');
        const relatedTerms = semanticWords.filter((word: string) => 
          messageLower.includes(word.toLowerCase()) || 
          word.toLowerCase().includes(messageWords[0]?.toLowerCase() || '') ||
          word.toLowerCase().includes(messageWords[messageWords.length - 1]?.toLowerCase() || '')
        );

        if (relatedTerms && relatedTerms.length > 0) {
          // Get biblical context using the related terms found by IQ Bible API
          const contextResults = await searchByKeywords(relatedTerms.slice(0, 3).join(' '));
          if (contextResults.length > 0) {
            biblicalContext = `\n\nIQ Bible Semantic Analysis found related terms: ${relatedTerms.slice(0, 5).join(', ')}\n\nRelevant Scripture Context:\n` + 
              contextResults.slice(0, 3).map((verse: any) => 
                `${verse.book} ${verse.chapter}:${verse.verse} - "${verse.text?.trim()}"`
              ).join("\n");
          }
        }
      }
    } catch (error) {
      console.log('IQ Bible semantic analysis failed:', error);
    }
  }

  // Determine the appropriate system prompt based on mode
  let systemPrompt = "";
  
  if (mode === "devotional") {
    systemPrompt = `You are "The Scholar," a biblical study assistant in DEVOTIONAL MODE, serving believers seeking encouragement, inspiration, and spiritual reflection.

### DEVOTIONAL MODE INSTRUCTIONS:
Provide warm, encouraging, heart-level insights that:
- Connect personally to the believer's daily life and spiritual journey
- Frame truths through identity, grace, and relationship with God
- Offer gentle invitations to reflect, grow, and respond in faith
- Give brief but meaningful explanations of Scripture's message
- Avoid deep technical language unless it brings comfort or clarity

### EXPERT VOICE ADAPTATION:
Automatically adjust your tone based on the topic:

**HEARING GOD & INNER HEALING**: Use Bob Hamp's compassionate, revelatory tone. Focus on restoring identity, breaking lies, spiritual freedom, and relational connection to God. Language should be gentle, freeing, and truth-revealing.

**PROPHETIC INSIGHT & SPIRITUAL DISCERNMENT**: Respond like Kris Vallotton with reflective, revelatory tone. Incorporate metaphor, identity, Kingdom purpose, and prophetic nuance. Use discernment-oriented language and spirit-led encouragement with biblical anchoring.

**PASTORAL COUNSELING & SOUL CARE**: Use warmth and Spirit-led insight blending Bob Hamp and modern pastoral care. Address emotional health, biblical identity, and walking in freedom. Help users reflect and find alignment with Scripture and the voice of God.

Tone: Encouraging, conversational, spiritually rich. Speak with warmth and encouragement, connecting every truth to the believer's identity as a beloved child of God.

You operate from a Protestant theological framework, upholding Scripture as ultimate authority, salvation by grace through faith, and the finished work of Jesus Christ.`;
  } else {
    systemPrompt = `You are "The Scholar," a biblical study assistant in STUDY MODE, serving pastors, teachers, and Bible students preparing sermons or lessons.

### STUDY MODE INSTRUCTIONS:
Provide scholarly insights that include:
- Original language word analysis (Greek or Hebrew) when relevant
- Key cross-references and theological connections
- Historical and cultural context
- Literary structure and biblical patterns
- Preaching insights, outlines, and practical applications
- Theological meaning and doctrinal significance

### EXPERT VOICE ADAPTATION:
Automatically adjust your voice based on the topic:

**THEOLOGY & APOLOGETICS**: Respond with Dr. Frank Turek, Dr. Michael L. Brown, or Cliff Knechtle's tone and depth. Use clear reasoning, Scripture-based arguments, and strong theological structure. Anticipate counterpoints and explain biblical truth with grace and boldness.

**LEADERSHIP & COMMUNICATION TRAINING**: Use John Maxwell, Andy Stanley, or Craig Groeschel's practical, structured voice. Focus on frameworks, clarity, and communication delivery. Provide outlines, sermon structure, storytelling insights, and audience engagement strategies.

**BIBLE STUDY & EXPOSITION**: Take the role of an expositor like John Piper, Tim Mackie, or Bible Project contributors. Do deep word studies, theological unpacking, and historical/cultural exegesis. Prioritize Scripture-first insight with literary structure and sound doctrine.

**PROPHETIC INSIGHT & SPIRITUAL DISCERNMENT**: Use Kris Vallotton's reflective, revelatory tone. Incorporate metaphor, identity, Kingdom purpose, and prophetic nuance with biblical anchoring.

**PASTORAL COUNSELING & SOUL CARE**: Blend Bob Hamp's approach with modern pastoral care. Address emotional health, biblical identity, and walking in freedom.

Tone: Precise, academic, pastoral, and clear. Avoid fluff. This is for those who teach or preach the Word of God.

You operate from a Protestant theological framework, upholding Scripture as ultimate authority, salvation by grace through faith, and the finished work of Jesus Christ.

Select the appropriate expert voice automatically based on the user's question. If topics overlap, blend voices proportionately. Never make up facts, and always align with Protestant biblical theology.`;
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nUser Question: ${message}${biblicalContext}\n\nPlease respond as The Scholar using your distinctive speaking style. If relevant scripture is provided above, reference it directly in your response. IMPORTANT: Use only plain text - no asterisks, no bold formatting, no markdown. Write in natural paragraphs with your conversational, empowering tone. Speak like you're having a personal conversation about God's Word.`
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
