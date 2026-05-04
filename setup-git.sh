#!/bin/bash
# Setup script for GitHub repository

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Painter Style Studio"

# Set main branch (if needed)
git branch -M main

echo "✅ Git repository initialized!"
echo ""
echo "Next steps:"
echo "1. Create a new repository on GitHub (https://github.com/new)"
echo "2. Copy the repository URL"
echo "3. Run these commands:"
echo "   git remote add origin <your-github-repo-url>"
echo "   git push -u origin main"
echo ""
echo "Or run: ./push-to-github.sh <your-github-repo-url>"


