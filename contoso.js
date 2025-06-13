import 'dotenv/config';

import OpenAI from "openai";
import fs from "fs";

const token = process.env.OPENAI_API_KEY;
const endpoint = "https://models.github.ai/inference";
const modelName = "openai/gpt-4o";

// export async function main() {

//   const client = new OpenAI({ baseURL: endpoint, apiKey: token });

//   const response = await client.chat.completions.create({
//     messages: [
//         { role:"system", content: "You are a helpful assistant." },
//         { role:"user", content: "What is the capital of France?" }
//       ],
//       temperature: 1.0,
//       top_p: 1.0,
//       max_tokens: 1000,
//       model: modelName
//     });

//   console.log(response.choices[0].message.content);
// }

// main().catch((err) => {
//   console.error("The sample encountered an error:", err);
// });

/**
 * Example usage:
 * node contoso.js "What is in this image?" ./contoso_layout_sketch.jpg
 */

export async function mainWithImage() {
    const question = process.argv[2] || "Describe the image.";
    const imagePath = process.argv[3] || "./contoso_layout_sketch.jpg";

    const client = new OpenAI({ baseURL: endpoint, apiKey: token });

    const imageData = fs.readFileSync(imagePath, { encoding: "base64" });

    const response = await client.chat.completions.create({
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            {
                role: "user",
                content: [
                    { type: "text", text: question },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:image/jpeg;base64,${imageData}`
                        }
                    }
                ]
            }
        ],
        temperature: 1.0,
        top_p: 1.0,
        max_tokens: 1000,
        model: modelName
    });

    console.log(response.choices[0].message.content);
}

// Uncomment to use image input
mainWithImage().catch((err) => {
  console.error("The sample encountered an error:", err);
});

/**
 * Example usage:
 * node contoso.js "Generate HTML and CSS code for this layout." ./contoso_layout_sketch.jpg
 */

export async function generateHtmlCssFromSketch() {
    const question = process.argv[2] || "Generate HTML and CSS code for this layout.";
    const imagePath = process.argv[3] || "./contoso_layout_sketch.jpg";

    const client = new OpenAI({ baseURL: endpoint, apiKey: token });

    const imageData = fs.readFileSync(imagePath, { encoding: "base64" });

    const response = await client.chat.completions.create({
        messages: [
            { role: "system", content: "You are a helpful assistant that writes HTML and CSS code based on layout sketches." },
            {
                role: "user",
                content: [
                    { type: "text", text: question },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:image/jpeg;base64,${imageData}`
                        }
                    }
                ]
            }
        ],
        temperature: 0.7,
        top_p: 1.0,
        max_tokens: 1500,
        model: modelName
    });

    console.log(response.choices[0].message.content);
}

// Uncomment to use HTML/CSS generation from sketch
generateHtmlCssFromSketch().catch((err) => {
  console.error("The sample encountered an error:", err);
});

export async function generateHtmlCssFilesFromSketch() {
    const question = process.argv[2] || "Generate HTML and CSS code for this layout.";
    const imagePath = process.argv[3] || "./contoso_layout_sketch.jpg";

    const client = new OpenAI({ baseURL: endpoint, apiKey: token });

    const imageData = fs.readFileSync(imagePath, { encoding: "base64" });

    const response = await client.chat.completions.create({
        messages: [
            { role: "system", content: "You are a helpful assistant that writes HTML and CSS code based on layout sketches. Output only the HTML and CSS code blocks, nothing else." },
            {
                role: "user",
                content: [
                    { type: "text", text: question },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:image/jpeg;base64,${imageData}`
                        }
                    }
                ]
            }
        ],
        temperature: 0.7,
        top_p: 1.0,
        max_tokens: 2000,
        model: modelName
    });

    const content = response.choices[0].message.content;

    // Extract HTML and CSS code blocks
    const htmlMatch = content.match(/```html\s*([\s\S]*?)```/i);
    const cssMatch = content.match(/```css\s*([\s\S]*?)```/i);

    if (!htmlMatch || !cssMatch) {
        console.error("Could not find both HTML and CSS code blocks in the response.");
        return;
    }

    let htmlCode = htmlMatch[1].trim();
    const cssCode = cssMatch[1].trim();

    // Ensure HTML links to CSS file
    if (!htmlCode.includes('<link') && htmlCode.includes('<head>')) {
        htmlCode = htmlCode.replace(
            /<head>/i,
            `<head>\n    <link rel="stylesheet" href="style.css">`
        );
    } else if (!htmlCode.includes('<link')) {
        // If no <head>, add link at the top
        htmlCode = `<head>\n    <link rel="stylesheet" href="style.css">\n</head>\n` + htmlCode;
    }

    fs.writeFileSync("index.html", htmlCode, "utf8");
    fs.writeFileSync("style.css", cssCode, "utf8");

    console.log("HTML and CSS have been written to index.html and style.css");
}

// Uncomment to use HTML/CSS file generation from sketch
generateHtmlCssFilesFromSketch().catch((err) => {
  console.error("The sample encountered an error:", err);
});

export async function generateContosoHtmlCssFilesFromSketch() {
    const question = process.argv[2] || "Generate HTML and CSS code for this layout.";
    const imagePath = process.argv[3] || "./contoso_layout_sketch.jpg";

    const client = new OpenAI({ baseURL: endpoint, apiKey: token });

    const imageData = fs.readFileSync(imagePath, { encoding: "base64" });

    const response = await client.chat.completions.create({
        messages: [
            { role: "system", content: "You are a helpful assistant that writes HTML and CSS code based on layout sketches. Output only the HTML and CSS code blocks, nothing else." },
            {
                role: "user",
                content: [
                    { type: "text", text: question },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:image/jpeg;base64,${imageData}`
                        }
                    }
                ]
            }
        ],
        temperature: 0.7,
        top_p: 1.0,
        max_tokens: 2000,
        model: modelName
    });

    const content = response.choices[0].message.content;

    // Extract HTML and CSS code blocks
    const htmlMatch = content.match(/```html\s*([\s\S]*?)```/i);
    const cssMatch = content.match(/```css\s*([\s\S]*?)```/i);

    if (!htmlMatch || !cssMatch) {
        console.error("Could not find both HTML and CSS code blocks in the response.");
        return;
    }

    let htmlCode = htmlMatch[1].trim();
    const cssCode = cssMatch[1].trim();

    // Ensure HTML links to contoso.css
    if (!htmlCode.includes('<link') && htmlCode.includes('<head>')) {
        htmlCode = htmlCode.replace(
            /<head>/i,
            `<head>\n    <link rel="stylesheet" href="contoso.css">`
        );
    } else if (!htmlCode.includes('<link')) {
        // If no <head>, add link at the top
        htmlCode = `<head>\n    <link rel="stylesheet" href="contoso.css">\n</head>\n` + htmlCode;
    }

    fs.writeFileSync("contoso.html", htmlCode, "utf8");
    fs.writeFileSync("contoso.css", cssCode, "utf8");

    console.log("HTML and CSS have been written to contoso.html and contoso.css");
}

// Uncomment to use contoso.html/contoso.css file generation from sketch
generateContosoHtmlCssFilesFromSketch().catch((err) => {
  console.error("The sample encountered an error:", err);
});