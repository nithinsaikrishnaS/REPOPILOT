#!/bin/bash

# Kill any existing processes on ports 3001 and 5173
echo "Cleaning up ports..."
lsof -ti:3001 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null

# Start Agent
echo "Starting Repopilot Agent..."
cd agent
# Using node directly to avoid npm script issues
node src/app.js &
AGENT_PID=$!

# Start Frontend
echo "Starting Repopilot Web App..."
cd ../web
npm run dev -- --port 5173 --strictPort &
WEB_PID=$!

# Handle shutdown
trap "kill $AGENT_PID $WEB_PID" EXIT

echo "Repopilot is running!"
echo "Agent: http://localhost:3001"
echo "Web: http://localhost:5173"
echo "Press Ctrl+C to stop both."

wait
