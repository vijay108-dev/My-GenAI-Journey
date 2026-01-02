// import { GoogleGenAI } from "@google/geni";
// import 'dotenv/config'
// const ai = new GoogleGenAI({});

// //429 error limit will exahusted
// //gemni api , busy
// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     config: {
//       systemInstruction: 'Current user name is Vijay Singh. His name is Vijay Singh. Today date is ${new Date()}',
//     },
//     contents: "What is current time in India",
//   });
//   console.log(response.text);
// }

// await main();


//it will store your chat also 

import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import readlineSync from "readline-sync";
//All three mean that I am bringing code into my system, and it is stored inside the node_modules folder.

const ai = new GoogleGenAI({});

async function main() {
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    //everthing will go automatically in my history
    history: [],
    config: {
      systemInstruction: `Always respond in simple and clear English.
  Explain concepts in a step-by-step, traditional way.
  Use real-life examples when possible.
  Keep answers short and accurate.`
    },
});

while(true)
{
  const question = readlineSync.question("Ask me Question");

  if(question=='exit'){
    break;
  }

  const response = await chat.sendMessage({
    message: question
  })

  console.log("Response: ", response.text);

  }
}
await main();
