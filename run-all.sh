#!/bin/bash
# run-all.sh
# Starts Ollama, FastAPI backend, and React frontend in parallel

# 1️⃣ Activate backend virtual environment
echo "Activating backend venv..."
source ./backend/venv/bin/activate

# 2️⃣ Start Ollama server
echo "Starting Ollama server..."
# run Ollama in background
ollama serve &
OLLAMA_PID=$!

# 3️⃣ Start FastAPI backend
echo "Starting FastAPI backend..."
uvicorn backend.main:app --reload --port 8000 &
UVICORN_PID=$!

# 4️⃣ Start React frontend
echo "Starting React frontend..."
cd ./local-chat-frontend
npm run dev &
VITE_PID=$!

# 5️⃣ Wait for all processes
echo "All services started!"
echo "Ollama PID: $OLLAMA_PID"
echo "Backend PID: $UVICORN_PID"
echo "Frontend PID: $VITE_PID"
wait
