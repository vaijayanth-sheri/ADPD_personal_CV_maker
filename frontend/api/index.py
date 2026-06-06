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
from docx_processor import parse_markdown_to_dict, generate_cover_letter, generate_cv

@app.post("/api/parse-markdown")
async def parse_markdown(file: UploadFile = File(...)):
    content = await file.read()
    md_text = content.decode("utf-8")
    parsed_data = parse_markdown_to_dict(md_text)
    return {"status": "success", "parsed_sections": parsed_data}

@app.post("/api/generate")
async def generate_document(doc_type: str, file: UploadFile = File(...)):
    content = await file.read()
    md_text = content.decode("utf-8")
    
    os.makedirs("outputs", exist_ok=True)
    
    if doc_type == "cover_letter":
        template_path = "../templates/CoverLetter_Template.docx"
        output_path = f"outputs/Customized_CoverLetter.docx"
        generate_cover_letter(md_text, template_path, output_path)
    elif doc_type == "cv":
        template_path = "../templates/CV_Vaijayanth_Sheri_V1.docx"
        output_path = f"outputs/Customized_CV.docx"
        generate_cv(md_text, template_path, output_path)
    else:
        return {"status": "error", "message": "Invalid document type"}
        
    return {"status": "success", "message": f"{doc_type} generated successfully", "download_url": f"/outputs/{os.path.basename(output_path)}"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
