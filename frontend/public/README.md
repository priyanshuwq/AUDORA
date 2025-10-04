Metadata extractor
==================

A small Python script to extract MP3 metadata (title, artist, duration, cover art) and use MusicBrainz to help decide which text is the artist vs the song title.

Quick start
-----------

1. Create and activate a Python environment (recommended).
2. Install requirements:

```powershell
# from workspace 'p:\Web Development\Audora\frontend\public'
python -m pip install -r requirements.txt
```

3. Run the script on your songs folder (example below uses the workspace songs folder):

```powershell
python .\extract_metadata.py --folder "p:\Web Development\Audora\frontend\public\songs" --limit 5
```

Outputs
-------

- `results.json` and `results.csv` in the current working directory.
- `covers/` directory containing saved cover image files (if present in tags).

Notes
-----

- The script queries MusicBrainz to score candidate (artist, title) pairs. It uses a polite User-Agent and a small sleep.
- If you have a large collection, avoid hitting rate limits; consider increasing sleep or running in batches.