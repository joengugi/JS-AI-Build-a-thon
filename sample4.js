import 'dotenv/config';
import OpenAI from "openai";

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.github.ai/inference";
const modelName = "openai/gpt-4o";

function getFlightInfo({originCity, destinationCity}){
  if (originCity === "Seattle" && destinationCity === "Miami"){
    return JSON.stringify({
      airline: "Delta",
      flight_number: "DL123",
      flight_date: "May 7th, 2024",
      flight_time: "10:00AM"
    });
  }
  return JSON.stringify({error: "No flights found between the cities"});
}

const namesToFunctions = {
  getFlightInfo: (data) =>
  getFlightInfo(data),
};

export async function main() {
  
  const tool = {
    "type": "function",
    "function": {
      name: "getFlightInfo",
      description: "Returns information about the next flight between two cities." +
               "This includes the name of the airline, flight number and the date and time" +
               "of the next flight",
      parameters: {
        "type": "object",
        "properties": {
          "originCity": {
            "type": "string",
            "description": "The name of the city where the flight originates",
          },
          "destinationCity": {
            "type": "string", 
            "description": "The flight destination city",
          },
        },
        "required": [
          "originCity",
          "destinationCity"
        ],
      }
    }
  };
  
  const client = new OpenAI({ baseURL: endpoint, apiKey: token });
  
  let messages=[
      {role: "system", content: "You an assistant that helps users find flight information."},
      {role: "user", content: "I'm interested in going to Miami. What is the next flight there from Seattle?"},
  ];
  
  let response = await client.chat.completions.create({
    messages: messages,
    tools: [tool],
    model: modelName
  });
  
  // We expect the model to ask for a tool call
  if (response.choices[0].finish_reason === "tool_calls"){
  
    // Append the model response to the chat history
    messages.push(response.choices[0].message);

    // We expect a single tool call
    if (response.choices[0].message && response.choices[0].message.tool_calls.length === 1){

      const toolCall = response.choices[0].message.tool_calls[0];
      // We expect the tool to be a function call
      if (toolCall.type === "function"){
        const toolCall = response.choices[0].message.tool_calls[0];
        // Parse the function call arguments and call the function
        const functionArgs = JSON.parse(toolCall.function.arguments);
        console.log(`Calling function \`${toolCall.function.name}\` with arguments ${toolCall.function.arguments}`);
        const callableFunc = namesToFunctions[toolCall.function.name];
        const functionReturn = callableFunc(functionArgs);
        console.log(`Function returned = ${functionReturn}`);
      
        // Append the function call result fo the chat history
        messages.push(
          {
             "tool_call_id": toolCall.id,
             "role": "tool",
             "name": toolCall.function.name,
             "content": functionReturn,
          }
        )

        response = await client.chat.completions.create({
          messages: messages,
          tools: [tool],
          model: modelName
        });
      console.log(`Model response = ${response.choices[0].message.content}`);
      }
    }
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});