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
  // Temporary user ID for demo (in real app would come from authentication)
  const DEMO_USER_ID = 1;

  // Users
  app.get("/api/users/current", async (req, res) => {
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

  app.post("/api/users/complete-onboarding", async (req, res) => {
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

  // Study tools endpoint for Bible analysis requests
  app.post("/api/chat/send", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required" });
      }

      const messageData = insertChatMessageSchema.parse({
        message: message,
        userId: DEMO_USER_ID
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
      const IQ_BIBLE_API_KEY = "968991c5c1mshc63a6b5b6e7e92dp1f8685jsnbfc8e9663eed";

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
      const RAPIDAPI_KEY = "968991c5c1mshc63a6b5b6e7e92dp1f8685jsnbfc8e9663eed";

      // Try NIV Bible API for NIV translation
      if (translation === 'niv') {
        try {
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
              book: book,
              chapter: parseInt(chapter),
              verses: verses
            });
          }
        } catch (error) {
          console.log('NIV Bible API unavailable, trying Bible Search API');
        }
      }

      // Try Bible Search API for other translations
      try {
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
      
      // Try IQ Bible API as fallback
      const IQ_BIBLE_API_KEY = process.env.IQ_BIBLE_API_KEY;
      if (IQ_BIBLE_API_KEY) {
        try {
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
async function generateAIResponse(message: string): Promise<string> {
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
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nUser Question: ${message}${biblicalContext}\n\nPlease respond as The Scholar, incorporating your Protestant theological framework and pastoral heart. If relevant scripture is provided above, reference it directly in your response. Format your response in clean, readable text without asterisks (*) or markdown formatting. Use simple paragraphs and natural language.`
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
