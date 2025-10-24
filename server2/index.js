const express = require('express');
const multer = require('multer');
const dotenv = require('dotenv');
const fs = require('fs');
const pdf = require('pdf-parse');
const { PDFDocument } = require('pdf-lib');
const axios = require('axios');
const cors=require('cors');

// Load environment variables
dotenv.config();



const app = express();
const upload = multer({ dest: 'temp_files/' });

app.use(cors());
app.use(express.json());

let documents = [];

// Function to read the PDF file and extract text
async function readPdf(filePath) {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        return data.text;
    } catch (error) {
        console.error(`Error reading ${filePath}: ${error.message}`);
        return null;
    }
}

app.get("/",(req,res)=>{
    res.send("Nodeserver for docusage is working");
})

// API to upload PDF file
app.post('/upload_pdf', upload.single('file'), async (req, res) => {
    if (!req.file) {
        console.log("No file uploaded");
        return res.status(400).send({ detail: 'No file uploaded' });
    }

    console.log(req.file); // Log the uploaded file details

    const fileLocation = `temp_files/${req.file.filename}`;
    try {
        const fileContent = await readPdf(fileLocation);
        if (!fileContent) {
            return res.status(500).send({ detail: 'Error reading PDF file' });
        }

        documents = [{ title: req.file.originalname, text: fileContent }];
        res.send({ detail: 'PDF uploaded and processed ' });
    } catch (error) {
        return res.status(500).send({ detail: `File upload error: ${error.message}` });
    }
});


// API to handle chat queries
app.post('/chat', async (req, res) => {
    const { query, chat_history = [] } = req.body;

    if (!query) {
        return res.status(400).send({ detail: 'Query is required' });
    }

    if (documents.length === 0) {
        return res.status(400).send({ detail: 'No PDF document uploaded' });
    }

    try {
        const response = await axios.post('https://api.cohere.ai/chat', {
            model: 'command-r-plus',
            message: query,
            documents: documents,
            chat_history: chat_history
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const { text, citations, chat_history: updatedChatHistory } = response.data;
        res.send({
            response_text: text,
            citations: citations,
            chat_history: updatedChatHistory
        });
    } catch (error) {
        console.error(`Error with Cohere API: ${error.message}`);
        return res.status(500).send({ detail: 'Internal Server Error' });
    }
});

// Start the Express server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
