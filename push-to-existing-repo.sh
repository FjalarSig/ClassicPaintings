#!/bin/bash
# Push to existing GitHub repository: https://github.com/FjalarSig/ClassicPaintings

REPO_URL="https://github.com/FjalarSig/ClassicPaintings.git"

echo "🚀 Setting up git and pushing to GitHub..."
echo "Repository: $REPO_URL"
echo ""

# Initialize git if not already done
if [ ! -d .git ]; then
  echo "Initializing git repository..."
  git init
fi

# Add remote (or update if exists)
if git remote | grep -q origin; then
  echo "Updating remote origin..."
  git remote set-url origin $REPO_URL
else
  echo "Adding remote origin..."
  git remote add origin $REPO_URL
fi

# Add all files
echo "Adding files..."
git add .

# Commit
echo "Creating commit..."
git commit -m "Initial commit: Painter Style Studio"

# Set main branch
echo "Setting main branch..."
git branch -M main

# Push to GitHub
echo "Pushing to GitHub..."
echo ""
git push -u origin main

echo ""
echo "✅ Successfully pushed to https://github.com/FjalarSig/ClassicPaintings"
echo ""
echo "If you get an error about the remote having content you don't have locally,"
echo "you may need to pull first: git pull origin main --allow-unrelated-histories"


