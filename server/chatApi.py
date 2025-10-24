from fastapi import FastAPI, HTTPException, File, UploadFile
from pydantic import BaseModel
import os
import cohere
from dotenv import load_dotenv
import fitz
import shutil

# Load environment variables from .env file
load_dotenv()

# Initialize Cohere API client
api_key = os.getenv('COHERE_API_KEY')
co = cohere.Client(api_key)

app = FastAPI()

# Function to read the PDF file and extract text
def read_pdf(filename):
    try:
        pdf_document = fitz.open(filename)
        content = ""
        for page in pdf_document:
            content += page.get_text()
        pdf_document.close()
        return content
    except Exception as e:
        print(f"Error reading {filename}: {str(e)}")
        return None

# Request model for chat input
class ChatRequest(BaseModel):
    query: str
    chat_history: list = []

# Variable to store documents in memory after file upload
documents = []

def ensure_directory_exists(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)
# API to upload PDF file
@app.post("/upload_pdf/")
async def upload_pdf(file: UploadFile = File(...)):
   # Define the directory where files will be saved
    temp_directory = "temp_files/"
    
    # Ensure the directory exists
    ensure_directory_exists(temp_directory)
    
    # Save the uploaded file temporarily
    file_location = os.path.join(temp_directory, file.filename)
    
    try:
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Read the content of the PDF
        file_content = read_pdf(file_location)
        if not file_content:
            raise HTTPException(status_code=500, detail="Error reading PDF file")

        # Store the PDF content in the documents variable
        global documents
        documents = [{"title": file.filename, "text": file_content}]
        
        return {"detail": "PDF uploaded and processed successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload error: {str(e)}")

# API to handle chat queries
@app.post("/chat")
async def chat(request: ChatRequest):
    if not request.query:
        raise HTTPException(status_code=400, detail="Query is required")

    if not documents:
        raise HTTPException(status_code=400, detail="No PDF document uploaded")

    try:
        # Call Cohere API for chat response
        response = co.chat(
            model="command-r-plus",
            message=request.query,
            documents=documents,
            chat_history=request.chat_history
        )

        # Return the response text and updated chat history
        return {
            "response_text": response.text,
            "citations": response.citations,
            "chat_history": response.chat_history
        }

    except Exception as e:
        print(f"Error with Cohere API: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Start the FastAPI server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
