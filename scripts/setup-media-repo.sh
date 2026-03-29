#!/bin/bash

# Audora Media Repo Setup Script
# This script helps you create the audora-media repository

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Audora Media Repository Setup ===${NC}"
echo ""

# Get the target directory
read -p "Enter path for audora-media repo (default: ../audora-media): " MEDIA_DIR
MEDIA_DIR=${MEDIA_DIR:-../audora-media}

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USER

if [ -z "$GITHUB_USER" ]; then
    echo -e "${RED}Error: GitHub username is required${NC}"
    exit 1
fi

# Check if source directories exist
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SONGS_DIR="$SCRIPT_DIR/frontend/public/songs"
COVERS_DIR="$SCRIPT_DIR/frontend/public/extracted-covers"

if [ ! -d "$SONGS_DIR" ]; then
    echo -e "${RED}Error: Songs directory not found at $SONGS_DIR${NC}"
    exit 1
fi

if [ ! -d "$COVERS_DIR" ]; then
    echo -e "${RED}Error: Covers directory not found at $COVERS_DIR${NC}"
    exit 1
fi

# Create media repo directory
echo -e "${YELLOW}Creating media repository at $MEDIA_DIR...${NC}"
mkdir -p "$MEDIA_DIR"
cd "$MEDIA_DIR"

# Initialize git
git init

# Setup Git LFS
echo -e "${YELLOW}Setting up Git LFS...${NC}"
git lfs install
git lfs track "*.mp3"
git lfs track "*.jpg"
git lfs track "*.jpeg"
git lfs track "*.png"
git add .gitattributes

# Copy media files
echo -e "${YELLOW}Copying songs (this may take a while)...${NC}"
cp -r "$SONGS_DIR" ./songs

echo -e "${YELLOW}Copying cover art...${NC}"
cp -r "$COVERS_DIR" ./extracted-covers

# Remove non-media files
find . -name "*.json" -delete 2>/dev/null || true
find . -name "*.csv" -delete 2>/dev/null || true

# Count files
SONG_COUNT=$(find ./songs -name "*.mp3" | wc -l)
COVER_COUNT=$(find ./extracted-covers -type f | wc -l)

echo -e "${GREEN}Copied $SONG_COUNT songs and $COVER_COUNT covers${NC}"

# Create README
cat > README.md << 'EOF'
# Audora Media

Media files (songs and cover art) for the Audora music streaming app.

Served via GitHub Pages at: https://USERNAME.github.io/audora-media/

## Structure

- `songs/` - Audio files (.mp3)
- `extracted-covers/` - Album cover art (.jpg, .jpeg)

## Usage

This repository is served as a static file CDN for the main Audora application.
Set `VITE_MEDIA_BASE_URL=https://USERNAME.github.io/audora-media` in your production environment.
EOF

sed -i "s/USERNAME/$GITHUB_USER/g" README.md

# Commit
echo -e "${YELLOW}Committing files (this may take a while for large repos)...${NC}"
git add .
git commit -m "Initial media upload"

echo ""
echo -e "${GREEN}=== Setup Complete! ===${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. Create a new repository on GitHub:"
echo "   https://github.com/new"
echo "   Name: audora-media"
echo "   Visibility: Public (for GitHub Pages)"
echo ""
echo "2. Push to GitHub:"
echo "   cd $MEDIA_DIR"
echo "   git remote add origin https://github.com/$GITHUB_USER/audora-media.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Enable GitHub Pages:"
echo "   Go to: https://github.com/$GITHUB_USER/audora-media/settings/pages"
echo "   Source: Deploy from branch"
echo "   Branch: main / (root)"
echo ""
echo "4. Set environment variable in your Audora deployment:"
echo "   VITE_MEDIA_BASE_URL=https://$GITHUB_USER.github.io/audora-media"
echo ""
