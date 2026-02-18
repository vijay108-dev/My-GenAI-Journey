import readlineSync from 'readline-sync';

// ===== Gemini embeddings + Gemini chat model =====
import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from '@langchain/google-genai';

// ===== Pinecone client (vector database) =====
import { Pinecone } from '@pinecone-database/pinecone';

// ===== .env file load karne ke liye =====
import * as dotenv from 'dotenv';
dotenv.config(); // .env memory me load

// ===== Prompt template banane ke liye =====
import { PromptTemplate } from '@langchain/core/prompts';

// ===== LLM output ko string me convert karne ke liye =====
import { StringOutputParser } from '@langchain/core/output_parsers';

// ===== Chain banane ke liye (LangChain pipeline) =====
import { RunnableSequence } from '@langchain/core/runnables';


// ================= CONFIGURATION =================

// Embedding model configure
const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,      // Gemini API key
    model: 'text-embedding-004',             // embedding model
});

// Gemini Chat LLM configure
const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,      // Gemini API key
    model: 'gemini-2.5-flash',               // fast chat model
    temperature: 0.3,                        // creativity low (factual answers)
});

// Pinecone client create
const pinecone = new Pinecone();

// Pinecone index connect
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);


// ================= MAIN CHAT FUNCTION =================
async function chatting(question) {
    
    // ===== User question ko embedding me convert =====
    const queryVector = await embeddings.embedQuery(question);
    // question -> numbers (vector)

    // ===== Pinecone me similarity search =====
    const searchResults = await pineconeIndex.query({
        topK: 10,                // top 10 similar chunks
        vector: queryVector,     // user question vector
        includeMetadata: true,   // chunk ka text lana
    });

    // ===== Context banana (top 10 chunks ka text) =====
    const context = searchResults.matches
                   .map(match => match.metadata.text) // har chunk ka text
                   .join("\n\n---\n\n");                // separator

    // console.log(searchResults); // debug ke liye


    // ===== Prompt Template (LLM ko instructions) =====
    const promptTemplate = PromptTemplate.fromTemplate(`
You are a helpful assistant answering questions based on the provided documentation.

Context from the documentation:
{context}

Question: {question}

Instructions:
- Answer the question using ONLY the information from the context above
- If the answer is not in the context, say "I don't have enough information to answer that question."
- Be concise and clear
- Use code examples from the context if relevant

Answer:
    `);

    // ===== Chain create (Prompt → Gemini → Output Parser) =====
    const chain = RunnableSequence.from([
        promptTemplate,      // prompt inject
        model,               // Gemini LLM call
        new StringOutputParser(), // response ko string me convert
    ]);

    // ===== Chain run (LLM se answer lena) =====
    const answer = await chain.invoke({
        context: context,    // Pinecone chunks
        question: question,  // user question
    }); 
       
    // ===== Print Answer =====
    console.log(answer);
}


// ================= CLI LOOP =================
async function main(){

   // Terminal se question input
   const userProblem = readlineSync.question("Ask me anything--> ");

   // RAG pipeline call
   await chatting(userProblem);

   // Infinite chat loop (recursive)
   main();
}

// Start program
main();

// User Question
//       ↓
// Embedding (Gemini)
//       ↓
// Pinecone Search (top 10 chunks)
//       ↓
// Context + Question → Gemini Chat
//       ↓
// Final Answer
