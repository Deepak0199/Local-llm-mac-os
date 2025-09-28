

# 1️⃣ Activate backend virtual environment
echo "Activating backend venv..."
source ./backend/venv/bin/activate

# 2️⃣ Set Ollama environment variables for performance
export OLLAMA_CONTEXT_LENGTH=2048       # smaller context for faster inference
export OLLAMA_NOHISTORY=false           # enable KV cache reuse
export OLLAMA_MAX_QUEUE=1               # handle 1 request at a time
export OLLAMA_FLASH_ATTENTION=false     # optional
export OLLAMA_GPU_OVERHEAD=0
export OLLAMA_DEBUG=ERROR               # reduce verbose logs

# 3️⃣ Start Ollama server in background
echo "Starting Ollama server..."
ollama serve &
OLLAMA_PID=$!

# 4️⃣ Wait until Ollama is ready
echo "Waiting for Ollama to start..."
until nc -z localhost 11434; do
    sleep 0.5
done
echo "Ollama is ready!"

# 5️⃣ Start FastAPI backend
echo "Starting FastAPI backend..."
uvicorn backend.main:app --reload --port 8000 &
UVICORN_PID=$!

# 6️⃣ Start React frontend
echo "Starting React frontend..."
cd ./local-chat-frontend
npm run dev &
VITE_PID=$!

# 7️⃣ Print PIDs and wait
echo "All services started!"
echo "Ollama PID: $OLLAMA_PID"
echo "Backend PID: $UVICORN_PID"
echo "Frontend PID: $VITE_PID"
wait
