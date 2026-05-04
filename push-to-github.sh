#!/bin/bash
# Push to GitHub script

if [ -z "$1" ]; then
  echo "Usage: ./push-to-github.sh <github-repo-url>"
  echo "Example: ./push-to-github.sh https://github.com/username/painting-style-studio.git"
  exit 1
fi

REPO_URL=$1

# Add remote if it doesn't exist
if ! git remote | grep -q origin; then
  git remote add origin $REPO_URL
else
  git remote set-url origin $REPO_URL
fi

# Push to GitHub
git push -u origin main

echo "✅ Successfully pushed to GitHub!"


