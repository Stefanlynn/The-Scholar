// Simple KJV Bible data for reliable deployment
export const KJV_BOOKS = {
  "Matthew": {
    1: [
      { verse: 1, text: "The book of the generation of Jesus Christ, the son of David, the son of Abraham." },
      { verse: 2, text: "Abraham begat Isaac; and Isaac begat Jacob; and Jacob begat Judas and his brethren;" },
      { verse: 3, text: "And Judas begat Phares and Zara of Thamar; and Phares begat Esrom; and Esrom begat Aram;" },
      { verse: 4, text: "And Aram begat Aminadab; and Aminadab begat Naasson; and Naasson begat Salmon;" },
      { verse: 5, text: "And Salmon begat Booz of Rachab; and Booz begat Obed of Ruth; and Obed begat Jesse;" },
      { verse: 16, text: "And Jacob begat Joseph the husband of Mary, of whom was born Jesus, who is called Christ." },
      { verse: 18, text: "Now the birth of Jesus Christ was on this wise: When as his mother Mary was espoused to Joseph, before they came together, she was found with child of the Holy Ghost." },
      { verse: 21, text: "And she shall bring forth a son, and thou shalt call his name JESUS: for he shall save his people from their sins." },
      { verse: 23, text: "Behold, a virgin shall be with child, and shall bring forth a son, and they shall call his name Emmanuel, which being interpreted is, God with us." }
    ],
    3: [
      { verse: 16, text: "And Jesus, when he was baptized, went up straightway out of the water: and, lo, the heavens were opened unto him, and he saw the Spirit of God descending like a dove, and lighting upon him:" },
      { verse: 17, text: "And lo a voice from heaven, saying, This is my beloved Son, in whom I am well pleased." }
    ]
  },
  "John": {
    1: [
      { verse: 1, text: "In the beginning was the Word, and the Word was with God, and the Word was God." },
      { verse: 14, text: "And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth." }
    ],
    3: [
      { verse: 16, text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." },
      { verse: 17, text: "For God sent not his Son into the world to condemn the world; but that the world through him might be saved." }
    ],
    14: [
      { verse: 6, text: "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me." }
    ]
  },
  "Romans": {
    8: [
      { verse: 28, text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose." }
    ]
  },
  "Philippians": {
    4: [
      { verse: 13, text: "I can do all things through Christ which strengtheneth me." }
    ]
  },
  "1 John": {
    4: [
      { verse: 8, text: "He that loveth not knoweth not God; for God is love." }
    ]
  }
};

export function getKJVChapter(book: string, chapter: number) {
  const bookData = KJV_BOOKS[book as keyof typeof KJV_BOOKS];
  if (!bookData) return null;
  
  const chapterData = bookData[chapter as keyof typeof bookData];
  if (!chapterData) return null;
  
  return {
    book,
    chapter,
    verses: chapterData
  };
}