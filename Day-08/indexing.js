// dotenv import → .env file se API keys load karne ke liye
import * as dotenv from 'dotenv';
dotenv.config(); // .env file ko memory me load kar diya

// PDF loader → PDF file ko LangChain Document format me convert karega
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';

// Text splitter → large text ko chhote chunks me todne ke liye
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

// Gemini embeddings → text ko numbers (vectors) me convert karega
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';

// Pinecone client → Pinecone vector database connect karega
import { Pinecone } from '@pinecone-database/pinecone';

// LangChain Pinecone store → embeddings ko Pinecone me store karne ke liye
import { PineconeStore } from '@langchain/pinecone';


// Async function because PDF load, embeddings, DB calls async hoti hain
async function indexing() {
    
    // ===== PDF FILE LOAD KARNA =====

    // PDF ka path
    const PDF_PATH = './Node.pdf';

    // PDFLoader object banaya
    const pdfLoader = new PDFLoader(PDF_PATH);

    // PDF ko load karke raw documents me convert kar diya
    const rawDocs = await pdfLoader.load();


    // ===== CHUNKING (TEXT SPLITTING) =====

    // RecursiveCharacterTextSplitter → smart way se text todta hai
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,   // ek chunk max 1000 characters
        chunkOverlap: 200, // previous chunk ka 200 char overlap
    });

    // Raw docs ko chunks me tod diya
    const chunkedDocs = await textSplitter.splitDocuments(rawDocs);

    // console.log(chunkedDocs.length); // kitne chunks bane


    // ===== EMBEDDINGS CREATE KARNA =====

    // Gemini embeddings model configure
    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY,  // Gemini API key from .env
        model: 'text-embedding-004',         // embedding model
    });


    // ===== PINECONE CONFIGURATION =====

    // Pinecone client create
    const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY, // Pinecone API key
    });

    // Pinecone index connect
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);


    // ===== STORE INTO VECTOR DATABASE (RAG INDEXING STEP) =====

    // Direct pipeline:
    // ChunkedDocs → Embeddings → Pinecone Vector Store
    await PineconeStore.fromDocuments(chunkedDocs, embeddings, {
        pineconeIndex,      // index name
        maxConcurrency: 5,  // parallel embedding requests
    });
}

// Function call
indexing();

//PDF → chunks → embeddings (numbers) → Pinecone database
