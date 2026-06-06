from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="ADPD Backend API", version="1.0.0")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to ADPD Backend API"}

import os
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from docx_processor import parse_markdown_to_dict, generate_cover_letter, generate_cv
import uvicorn
import uuid

app = FastAPI(title="ADPD Backend API", version="1.0.0")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")
if SUPABASE_URL and SUPABASE_KEY:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    supabase = None

@app.get("/")
def read_root():
    return {"message": "Welcome to ADPD Backend API"}

@app.post("/api/parse-markdown")
async def parse_markdown(file: UploadFile = File(...)):
    content = await file.read()
    md_text = content.decode("utf-8")
    parsed_data = parse_markdown_to_dict(md_text)
    return {"status": "success", "parsed_sections": parsed_data}

@app.post("/api/generate")
async def generate_document(
    doc_type: str = Form(...), 
    user_id: str = Form(...),
    template_name: str = Form(...),
    format: str = Form("docx"),
    file: UploadFile = File(...)
):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured in backend.")
        
    if format.lower() == "pdf":
        raise HTTPException(status_code=501, detail="PDF generation is currently not supported in the serverless environment. Please download as DOCX and convert locally.")

    content = await file.read()
    md_text = content.decode("utf-8")
    
    # Use /tmp for serverless environments (Vercel read-only filesystem workaround)
    temp_dir = "/tmp"
    os.makedirs(temp_dir, exist_ok=True)
    
    unique_id = str(uuid.uuid4())[:8]
    template_path = os.path.join(temp_dir, f"template_{unique_id}_{template_name}")
    storage_path = f"{user_id}/{template_name}"
    
    try:
        res = supabase.storage.from_("user_templates").download(storage_path)
        with open(template_path, "wb") as f:
            f.write(res)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Template not found in storage: {str(e)}")
    
    output_filename = f"Customized_{doc_type.capitalize()}_{unique_id}.docx"
    output_path = os.path.join(temp_dir, output_filename)
    
    if doc_type == "cover_letter":
        generate_cover_letter(md_text, template_path, output_path)
    elif doc_type == "cv":
        generate_cv(md_text, template_path, output_path)
    else:
        raise HTTPException(status_code=400, detail="Invalid document type")
        
    # Return the file directly as a downloadable response
    return FileResponse(
        path=output_path, 
        filename=f"Personalized_{doc_type.capitalize()}.docx",
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
