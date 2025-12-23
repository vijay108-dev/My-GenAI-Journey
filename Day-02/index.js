import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey:""});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "What is Linked List in DSA",
  });
  console.log(response.text);
}

await main();

//Use your own API Key 

//ask question what is my name so question is Is my LLM store the information
//1.Ai or LLM does not store anything about you bcz when you use gemni ai you will provide information but here things are different 
//In geminiAi you will send prev chat also so that they will give you context of the message
//Tokens also matter jyda token kharch na hojaye mera
//Gemini server or chatgpt will store your info in theri own server or own db.
//More data require to train LLM and it will take high cost also
//Youtube also store video
//You can do manually also here 

// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({apiKey:""});

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: [
//         {
//             role:"user",
//             parts:[{text:"What is current date"}]
//         }
//         // {
//         //     role:'user',
//         //     parts: [{text:"What is my name"}]
//         // },
//         // {
//         //     role:'model',
//         //     parts:[{text:"As an AI, I don't have access to personal information"}]
//         // },
//         // {
//         //     role:'user',
//         //     parts:[{text:"My name is Rohit Negi"}]
//         // },
//         // {
//         //     role:'model',
//         //     parts: [{text:"Thank you, Rohit. It's nice to meet you!"}]
//         // },
//         // {
//         //     role:'user',
//         //     parts: [{text:"What is my name"}]
//         // },
//     ]
//   });
//   console.log(response.text);
// }

// await main();