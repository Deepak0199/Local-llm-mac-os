Local LLM Chat Assistant – Run Guide
1️⃣ Activate Backend
# Go to backend folder
cd ~/Documents/Projects/backend

# Activate virtual environment
source venv/bin/activate

2️⃣ Start Ollama LLM Server
# Start Ollama service (keep terminal open)
ollama serve

# Optional: verify models
ollama list


Make sure your model (e.g., deepseek-coder:6.7b) is pulled.

ollama pull deepseek-coder:6.7b

3️⃣ Start FastAPI Backend
# Backend folder should be activated (venv)
uvicorn main:app --reload --port 8000

✅ Test backend endpoints
# Health check
curl http://localhost:8000/health

# Chat test
curl -X POST http://localhost:8000/chat \
-H "Content-Type: application/json" \
-d '{"prompt":"Hello"}'

4️⃣ Start React Frontend
# Go to frontend folder
cd ~/Documents/Projects/local-chat-frontend

# Install dependencies (only first time)
npm install

# Start development server
npm run dev


Open the URL displayed in terminal (usually http://localhost:5173)

Frontend will communicate with backend → Ollama

5️⃣ Notes

Keep Ollama running while using the app.

Keep backend running for API endpoints.

Frontend handles chat messages and optional file uploads.

If you encounter "Error connecting to backend", make sure:

Backend is running on http://localhost:8000

Frontend URL is allowed in backend CORS

Virtual environment is activated



# single terminal with tmux or multiple terminals, one-liner script to start everything in parallel
1. Make the script executable:

chmod +x run-all.sh


2. Run it:

./run-all.sh