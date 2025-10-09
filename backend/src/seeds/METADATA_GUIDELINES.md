# Song Metadata Management Guidelines

## Metadata Verification System

This document provides guidelines for maintaining proper song metadata in the Audora music application. These guidelines ensure that song data in `generatedSongs.js` correctly matches with audio files and cover images.

## How to Use the Verification Tool

1. Navigate to the seeds directory:

```
cd backend/src/seeds
```

2. Run the verification script:

```
node verifyMetadata.js
```

3. Review the console output for any issues and check the generated `verification_results.json` file for detailed reports.

## Naming Conventions

### Cover Image Files

- Located in: `/frontend/public/extracted-covers/`
- Format: `artist_name__featured_artist___song_title_cover.jpeg`
- Rules:
  - All lowercase
  - Artist names separated by double underscore (`__`)
  - Words within names separated by single underscore (`_`)
  - Song title follows triple underscore (`___`)
  - Special characters removed or replaced
  - Always ends with `_cover.jpeg`

### Audio Files

- Located in: `/frontend/public/songs/`
- Format: `Artist Name - Song Title.mp3` or `Artist Name, Featured Artist - Song Title.mp3`
- Rules:
  - Proper case (capitalization)
  - Primary artist first, followed by hyphen, then song title
  - For collaborations, artists separated by commas
  - Special characters preserved
  - Always ends with `.mp3`

### Metadata in `generatedSongs.js`

- Each song entry must include:
  - `title`: Exact song title as it appears in the audio filename
  - `artist`: Primary artist name as it appears in the audio filename
  - `imageUrl`: Path to cover image using the proper naming convention
  - `audioUrl`: Path to audio file using the proper naming convention
  - `duration`: Song duration in seconds

## Common Patterns to Follow

### Movie Soundtracks

- For songs from movies, include "(From 'Movie Name')" in both the title and filenames
- Example:
  ```javascript
  {
    "title": "Chaleya (From 'Jawan')",
    "artist": "Anirudh Ravichander",
    "imageUrl": "/extracted-covers/anirudh_ravichander__arijit_singh__shilpa_rao__kumaar___chaleya__from__jawan___cover.jpeg",
    "audioUrl": "/songs/Anirudh Ravichander, Arijit Singh, Shilpa Rao, Kumaar - Chaleya (From 'Jawan').mp3",
    "duration": 210
  }
  ```

### Remixes and Versions

- Include version information consistently in both title and filenames
- Example:
  ```javascript
  {
    "title": "Timeless (feat. Playboi Carti & Doechii) - Remix",
    "artist": "The Weeknd",
    "imageUrl": "/extracted-covers/the_weeknd__doechii__playboi_carti___timeless__feat__playboi_carti___doechii____remix_cover.jpeg",
    "audioUrl": "/songs/The Weeknd, Doechii, Playboi Carti - Timeless (feat. Playboi Carti & Doechii) - Remix.mp3",
    "duration": 228
  }
  ```

### Featured Artists

- List primary artist in the `artist` field
- Include featured artists in the filenames, not in the `artist` field
- Example:
  ```javascript
  {
    "title": "Confident",
    "artist": "Justin Bieber",
    "imageUrl": "/extracted-covers/justin_bieber__chance_the_rapper___confident_cover.jpeg",
    "audioUrl": "/songs/Justin Bieber, Chance the Rapper - Confident.mp3",
    "duration": 255
  }
  ```

## Adding New Songs

When adding new songs to the application:

1. Ensure the audio file is properly named and placed in `/frontend/public/songs/`
2. Create a cover image with the proper naming convention and place it in `/frontend/public/extracted-covers/`
3. Add a new entry to the `songs` array in `generatedSongs.js` with all required fields
4. Run the verification script to ensure everything matches correctly
5. Seed the database with the updated song list

## Troubleshooting Common Issues

### Missing Cover Images

- Verify the cover image exists in the correct location
- Check for typos in the filename
- Ensure the naming convention is followed exactly

### Artist Name Mismatches

- Check for inconsistencies in capitalization or spacing
- Verify artist order is the same between metadata and filenames
- Make sure featured artists are handled consistently

### Special Characters

- For cover images, replace special characters with underscores
- For audio files and metadata, preserve special characters as they appear

By following these guidelines, you can ensure that song metadata remains consistent and accurate throughout the Audora application.
