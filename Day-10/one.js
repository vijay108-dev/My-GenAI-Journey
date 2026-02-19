//The stage at which response by LLM is tool call json
//crypto currency tool
async function cryptoCurrency({coin, curr})
{
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${coin}`)
   const data = await response.json();
   return data;
}

//cryptoCurrency({coin: "bitcoin"}).then(data => console.log(data));

//weather tool
async function getWeather({city})
{
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=0ebfd4a3d7c74b878b3100506252012&q=${city}&aqi=no`);
    const data = await response.json();
    return data;
}
//getWeather({city: "London"}).then(data => console.log(data));

const tools = [
  {
    type: "function",
    function: {
      name: "cryptoCurrency",
      description: "We can give you the current price or other information about a cypto currency.",
      parameters: {
        type: "object",
        properties: {
          coin: { type: "string", description: "The coin name, e.g. bitcoin,ethereum etc." },
          curr: { type: "string", description: "The currency to get the value in, e.g. inr, usd etc, if nothing mentioned then default currency for answer should be inr" } 
        },
        required: ["coin"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getWeather",
      description: "Get the current weather for a specific city.",
      parameters: {
        type: "object",
        properties: {
          city: { type: "string", description: "The city name, e.g. San Francisco, Mumbai etc." }
        },
        required: ["city"],
      },
    },
  },
];

//const History = [];

async function main() {
   const response =  await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
        {
            role: "system",
            content: "You are a helpful assistant that helps users to get information about crypto currency prices and weather information by using the appropriate tools.",
        },
      {
        role: "user",
        content: "What is crypto currency bitcoin price now?",
      },
    ],
    tools: tools,        // Pass the whole array here
    tool_choice: "auto" , // This tells the AI to choose the right tools automatically
    
  });
  console.log(JSON.stringify(response, null, 2));
//  console.log(response.choices[0]?.message?.content);
}

main();

// {
// "id": "chatcmpl-6b578ec6-8778-4007-8626-257d7bf74f07",
// "object": "chat.completion",
// "created": 1766260448,
// "model": "llama-3.3-70b-versatile",
// "choices": [
// {
// "index": 0,
// "message": {
// "role": "assistant",
// "tool_calls": [
// {
// "id": "zhpjtgvkk",
// "type": "function",
// "function": {
// "name": "cryptoCurrency",
// "arguments": "{\"coin\":\"bitcoin\"}"
// }
// }
// ]
// },
// "logprobs": null,
// "finish_reason": "tool_calls"
// }
// ],
// "usage": {
// "queue_time": 0.052773684,
// "prompt_tokens": 385,
// "prompt_time": 0.037225466,
// "completion_tokens": 15,
// "completion_time": 0.050305731,
// "total_tokens": 400,
// "system_fingerprint": "fp_c06d5113ec",
// "x_groq": {
// "id": "req_01kcyn772vfk0txg3xrjtjmq1m",
// "seed": 1483682069
// },
// "service_tier": "on_demand"
// }