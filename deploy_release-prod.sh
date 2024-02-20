#!/bin/bash

BRANCH_NAME="release/prod"

# Abort on errors
set -e

# Prepare the private key from an environment variable
PRIVATE_KEY_PATH="$(mktemp)"
# Extract the header
HEADER=$(echo "$SSH_PRIVATE_KEY" | grep -o -e "-----BEGIN [^-]* PRIVATE KEY-----")
# Extract the footer
FOOTER=$(echo "$SSH_PRIVATE_KEY" | grep -o -e "-----END [^-]* PRIVATE KEY-----")
# Remove the header and footer to isolate the body
BODY=$(echo "$SSH_PRIVATE_KEY" | sed -e "s/$HEADER//" | sed -e "s/$FOOTER//")
# Format the body of the key: Insert a newline every 64 characters
FORMATTED_BODY=$(echo "$BODY" | fold -w 64)
# Combine the formatted parts into one key, adding newlines after header and before footer
FORMATTED_KEY="$HEADER\n$FORMATTED_BODY\n$FOOTER"
# Print the key to key file
echo -e "$FORMATTED_KEY" > "$PRIVATE_KEY_PATH"
# Set 600 permission to private key file
chmod 600 "$PRIVATE_KEY_PATH"

# SSH into the EC2 instance
ssh -o StrictHostKeyChecking=no -i "$PRIVATE_KEY_PATH" "$HOST_ADDRESS" << ENDSSH
  set -e
  cd ~/workspace/paxintrade/frontend-built
  source ~/.nvm/nvm.sh || exit 1
  nvm use node || nvm install node
  pm2 stop ecosystem.config.js || true
  pm2 delete ecosystem.config.js || true
  rm -rf ./*
ENDSSH

# Copy the build artifacts to the server's deployment directory
rsync -avz -e "ssh -i $PRIVATE_KEY_PATH" --exclude '.git' .next/standalone/ "$HOST_ADDRESS":~/workspace/paxintrade/frontend-built

# SSH into the EC2 instance
ssh -o StrictHostKeyChecking=no -i "$PRIVATE_KEY_PATH" "$HOST_ADDRESS" << ENDSSH
  set -e
  cd ~/workspace/paxintrade/frontend-built
  source ~/.nvm/nvm.sh || exit 1
  nvm use node || nvm install node
  pm2 start ecosystem.config.js || true
  pm2 save || true
ENDSSH

# Clean up the private key
rm "$PRIVATE_KEY_PATH"