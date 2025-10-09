# Song Import Instructions

This document explains how to import the songs from the `frontend/public/songs` folder into your database.

## Prerequisites

All dependencies are now automatically installed:

- `music-metadata`: For extracting metadata from MP3 files
- `ffmpeg-static`: Provides a bundled FFmpeg binary
- `fluent-ffmpeg`: Node.js wrapper for FFmpeg

## Steps to Import Songs

1. **Extract Metadata from MP3 Files**

   Run the metadata extraction script:

   ```
   cd backend
   npm run extract:metadata
   ```

   This will:

   - Scan all MP3 files in the `frontend/public/songs` folder
   - Extract title and artist information from the filenames
   - Calculate the duration of each song
   - Generate a file `backend/src/seeds/generatedSongs.js`

2. **Import Songs into Database**

   Run the import script:

   ```
   cd backend
   npm run import:songs
   ```

   This will:

   - Import all songs into your database
   - Create albums for artists with 3 or more songs
   - Associate songs with their respective albums

## How It Works

### Metadata Extraction

- The script attempts to extract embedded metadata (title, artist, duration) directly from MP3 files
- If embedded metadata is missing, it falls back to parsing the filename format: `Artist - Title.mp3` or `Artist, Collaborator - Title.mp3`
- Cover images are assigned in a round-robin fashion from your existing cover images

### Database Import

- Songs are imported first
- Albums are created for artists with 3 or more songs
- Songs are associated with their albums

## Notes

- The songs will be referenced directly from the `frontend/public/songs` folder
- The frontend will access these files through URLs like `/songs/filename.mp3`
- This approach saves space compared to uploading to Cloudinary
- All metadata is stored in the database for efficient queries

## Troubleshooting

If you encounter any issues:

1. Check that all song files are in MP3 format
2. Verify that your MongoDB connection is working correctly
3. Ensure the `frontend/public/songs` directory is accessible by the script
4. If you get "out of memory" errors due to the large number of files, try processing the songs in smaller batches
