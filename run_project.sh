#!/bin/bash
export PATH=$PATH:/usr/local/bin:/opt/homebrew/bin

# Start Backend
cd backend
npm install
npm start &

# Start Frontend
cd ../frontend
npm install
npm run dev

