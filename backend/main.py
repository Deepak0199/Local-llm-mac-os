# main.py
import os
import io
import base64
import logging
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

# optional imports
try:
    import fitz  # PyMuPDF
except Exception:
    fitz = None

try:
    from PIL import Image
except Exception:
    Image = None

try:
    import pytesseract
except Exception:
    pytesseract = None

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Local Chat Assistant - Backend")

# Allow React frontend to talk to FastAPI
origins = [
    "http://localhost:5173",  # Vite dev server
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    # allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# configure via env or fallback to defaults
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "deepseek-coder:6.7b")
CHAT_ENDPOINT = f"{OLLAMA_HOST}/api/chat"
GENERATE_ENDPOINT = f"{OLLAMA_HOST}/api/generate"


@app.get("/health")
def health():
    return {"ok": True}


class ChatRequest(BaseModel):
    prompt: str


@app.post("/chat")
def chat(req: ChatRequest):
    """
    Accepts a prompt and forwards to Ollama /api/chat (stream=false).
    Returns {"reply": "<text>"} or helpful HTTP 500 if Ollama call fails.
    """
    payload = {
        "model": OLLAMA_MODEL,
        "messages": [{"role": "user", "content": req.prompt}],
        "stream": False,
    }
    try:
        resp = requests.post(CHAT_ENDPOINT, json=payload, timeout=120)
        resp.raise_for_status()
    except requests.exceptions.RequestException as e:
        logger.exception("Error calling Ollama /api/chat")
        raise HTTPException(status_code=500, detail=f"Failed to contact Ollama: {e}")

    data = resp.json()
    # /api/chat returns {"message": {"role":"assistant","content":"..."}}
    content = None
    if isinstance(data, dict):
        msg = data.get("message")
        if isinstance(msg, dict):
            content = msg.get("content")
        # fallback: some endpoints return 'response'
        if content is None:
            content = data.get("response")
    return {"reply": content or ""}


@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    """
    Accepts a file upload.
    - PDF -> extract text via PyMuPDF (fitz)
    - Image -> try pytesseract OCR if available, otherwise return base64 preview
    Returns {"text": "..."}
    """
    content = await file.read()
    filename = file.filename or "upload"

    if filename.lower().endswith(".pdf"):
        if not fitz:
            raise HTTPException(status_code=500, detail="PyMuPDF not installed. Run: pip install PyMuPDF")
        text = extract_text_from_pdf(content)
        return {"text": text}

    # assume image
    if Image is None:
        raise HTTPException(status_code=500, detail="Pillow not installed. Run: pip install Pillow")

    if pytesseract:
        try:
            text = ocr_image(content)
            return {"text": text}
        except Exception as e:
            logger.exception("OCR failed, returning preview")
            # fall through to preview on OCR failure

    # fallback: return a small base64 preview and metadata so frontend can show image
    img = Image.open(io.BytesIO(content))
    img.thumbnail((1024, 1024))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
    preview = f"data:image/png;base64,{b64}"
    return {"text": None, "preview": preview, "note": "install pytesseract + tesseract for OCR to get plain text"}


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    out_pages = []
    for page in doc:
        out_pages.append(page.get_text("text"))
    return "\n\n".join(out_pages)


def ocr_image(image_bytes: bytes) -> str:
    img = Image.open(io.BytesIO(image_bytes))
    return pytesseract.image_to_string(img)
