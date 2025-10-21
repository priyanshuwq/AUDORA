import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { config } from "dotenv";

config();

// Smart matching logic based on album name and artist patterns
const albumMatchingRules = {
  "Punjabi Songs": {
    maxSongs: 40,
    artists: [
      "Karan Aujla", "AP Dhillon", "Sidhu Moose Wala", "Diljit Dosanjh",
      "Guru Randhawa", "Badshah", "Bohemia", "Yo Yo Honey Singh",
      "Jaz Dhami", "Jassi Gill", "Jassie Gill", "Dhanda Nyoliwala"
    ],
    keywords: ["punjabi", "dhol", "bhangra"],
    exclude: ["hindi", "bollywood"]
  },
  
  "Bollywood Mix": {
    maxSongs: 50,
    artists: [
      "Arijit Singh", "Shreya Ghoshal", "Neha Kakkar", "Armaan Malik",
      "Atif Aslam", "Jubin Nautiyal", "Darshan Raval", "Sonu Nigam",
      "KK", "Sunidhi Chauhan", "Alka Yagnik", "Pritam", "A.R. Rahman",
      "Vishal Mishra", "Sachin-Jigar", "Tanishk Bagchi", "Anuv Jain",
      "Mohit Chauhan", "Shaan", "Tulsi Kumar", "Palak Muchhal",
      "Rekha Bhardwaj", "Shalmali Kholgade", "Monali Thakur"
    ],
    keywords: ["from", "lofi", "unplugged", "version"],
    exclude: []
  },
  
  "Old Era >3": {
    maxSongs: 35,
    artists: [
      "Kishore Kumar", "Lata Mangeshkar", "Mohammed Rafi", "Asha Bhosle",
      "R. D. Burman", "Mukesh", "Hemant Kumar", "Kalyanji-Anandji",
      "Laxmikant–Pyarelal", "Manna Dey", "Talat Mahmood"
    ],
    keywords: ["old", "classic", "vintage", "retro", "1970", "1980", "1990"],
    titleKeywords: ["dil", "pyar", "mere", "tere", "aankh", "raat", "chand"],
    exclude: ["remix", "2.0", "version"]
  },
  
  "Party Mood": {
    maxSongs: 40,
    artists: [
      "Badshah", "Yo Yo Honey Singh", "Raftaar", "Emiway Bantai",
      "KR$NA", "Drake", "The Weeknd", "Justin Bieber", "BTS",
      "Dua Lipa", "Diljit Dosanjh", "Guru Randhawa", "Neha Kakkar",
      "Millind Gaba", "Hardy Sandhu", "Harrdy Sandhu"
    ],
    keywords: [
      "party", "dance", "dj", "remix", "club", "high", "crazy",
      "patola", "bomb", "swag", "bang", "birthday", "celebration"
    ],
    titleKeywords: [
      "party", "dance", "bang", "high", "nachde", "zingaat",
      "dilliwaali", "proper patola", "chogada", "kamariya", "hookah"
    ],
    exclude: ["sad", "emotional", "unplugged", "acoustic"]
  }
};

function normalize(str) {
  return String(str || "").toLowerCase().trim();
}

function matchSongToAlbum(song, albumName, rules) {
  const songArtist = normalize(song.artist);
  const songTitle = normalize(song.title);
  
  let score = 0;
  
  // Artist match (highest priority)
  if (rules.artists) {
    for (const artist of rules.artists) {
      if (songArtist.includes(normalize(artist))) {
        score += 10;
        break;
      }
    }
  }
  
  // Keyword match in title or artist
  if (rules.keywords) {
    for (const keyword of rules.keywords) {
      if (songTitle.includes(normalize(keyword)) || songArtist.includes(normalize(keyword))) {
        score += 3;
      }
    }
  }
  
  // Title-specific keywords
  if (rules.titleKeywords) {
    for (const keyword of rules.titleKeywords) {
      if (songTitle.includes(normalize(keyword))) {
        score += 5;
      }
    }
  }
  
  // Exclude patterns (disqualify)
  if (rules.exclude) {
    for (const exclude of rules.exclude) {
      if (songTitle.includes(normalize(exclude)) || songArtist.includes(normalize(exclude))) {
        return -1; // Disqualified
      }
    }
  }
  
  return score;
}

async function run() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not set in the environment.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB\n");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message || err);
    process.exit(1);
  }

  const albums = await Album.find({});
  let availableSongs = await Song.find({ albumId: { $exists: false } }); // Only unassigned songs

  console.log(`Found ${albums.length} albums and ${availableSongs.length} unassigned songs\n`);

  for (const album of albums) {
    const albumName = album.title;
    const rules = albumMatchingRules[albumName];
    
    if (!rules) {
      console.log(`⚠️  No matching rules for album: "${albumName}"`);
      continue;
    }

    console.log(`\n📀 Processing: "${albumName}"`);
    console.log(`   Max songs: ${rules.maxSongs}`);
    
    // Score all available songs for this album
    const scoredSongs = availableSongs
      .map(song => ({
        song,
        score: matchSongToAlbum(song, albumName, rules)
      }))
      .filter(s => s.score > 0) // Only positive scores
      .sort((a, b) => b.score - a.score) // Highest score first
      .slice(0, rules.maxSongs); // Limit to max songs

    console.log(`   Matched ${scoredSongs.length} songs`);

    if (scoredSongs.length === 0) {
      console.log(`   ⚠️  No songs matched for this album`);
      continue;
    }

    // Add songs to album
    const songIds = scoredSongs.map(s => s.song._id);
    
    await Album.updateOne(
      { _id: album._id },
      { $set: { songs: songIds } }
    );

    // Update songs with albumId
    await Song.updateMany(
      { _id: { $in: songIds } },
      { $set: { albumId: album._id } }
    );

    // Remove assigned songs from available pool
    const assignedIds = new Set(songIds.map(id => String(id)));
    availableSongs = availableSongs.filter(s => !assignedIds.has(String(s._id)));

    console.log(`   ✅ Added ${songIds.length} songs to album`);
    
    // Show top 5 matched songs
    console.log(`   Top matches:`);
    scoredSongs.slice(0, 5).forEach((s, i) => {
      console.log(`      ${i + 1}. ${s.song.title} - ${s.song.artist} (score: ${s.score})`);
    });
  }

  // Summary
  console.log(`\n\n=== Summary ===`);
  for (const album of albums) {
    const updated = await Album.findById(album._id);
    console.log(`${updated.title}: ${updated.songs?.length || 0} songs`);
  }

  const unassigned = await Song.countDocuments({ albumId: { $exists: false } });
  console.log(`\nUnassigned songs: ${unassigned}`);

  await mongoose.connection.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
