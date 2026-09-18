import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const model = process.env.OPENAI_MODEL || "gpt-5.6-luna";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "12mb" }));
app.use(express.static(path.join(__dirname, "public")));

function getClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing. Add it to the .env file.");
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const baseInstructions = `
You are Krishan AI Photo Analyzer. Reply in simple Hindi unless the user asks for another language.

You can analyze uploaded images such as normal photos, screenshots, documents, charts and candlestick trading charts.

IMPORTANT PRIVACY RULES:
- Describe visible people, objects, text and scenes.
- Do not identify a private person from their face or claim a face matches a specific real person.
- Do not provide or infer private/sensitive personal information such as a person's home address, phone number, private social accounts, passwords, financial account details, exact live location, or hidden identity.
- If the user asks to identify a private person, explain that you can instead describe visible features or help read visible public text.
- Do not infer sensitive traits from appearance.

TRADING:
- If the image is a trading chart, explain visible trend, support/resistance, candlestick patterns, indicators and possible scenarios.
- Never promise profit or certainty.
- Do not present an outcome as guaranteed.
- Clearly say that chart analysis is educational and not financial advice.
- If the chart is too unclear, say what is unreadable rather than guessing.

OCR:
- Extract visible text as accurately as possible.
- Preserve numbers and symbols carefully.
- If something is uncertain, mark it as uncertain.

GENERAL:
- Explain what you can actually see.
- Do not invent information outside the image.
- When useful, give a short "क्या दिख रहा है", "विश्लेषण", and "अगला कदम" structure.
`;

app.post("/api/analyze", async (req, res) => {
  try {
    const { image, question = "" } = req.body || {};

    if (!image || typeof image !== "string" || !image.startsWith("data:image/")) {
      return res.status(400).json({ error: "Valid image data is required." });
    }

    const client = getClient();

    const response = await client.responses.create({
      model,
      instructions: baseInstructions,
      input: [{
        role: "user",
        content: [
          {
            type: "input_text",
            text: question.trim()
              ? question.trim()
              : "इस फोटो/इमेज को ध्यान से देखकर बताइए कि इसमें क्या है और जरूरी जानकारी सरल हिंदी में समझाइए।"
          },
          {
            type: "input_image",
            image_url: image,
            detail: "high"
          }
        ]
      }]
    });

    res.json({ answer: response.output_text || "कोई उत्तर नहीं मिला।" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error?.message || "Analysis failed."
    });
  }
});

app.post("/api/public-info", async (req, res) => {
  try {
    const { query } = req.body || {};
    if (!query?.trim()) {
      return res.status(400).json({ error: "Search query is required." });
    }

    const client = getClient();

    const response = await client.responses.create({
      model,
      instructions: `
You are the public-information assistant inside Krishan AI.
Answer in simple Hindi. Use web search for current public information.
Only provide lawful, publicly available, non-sensitive information.
Do not help locate private individuals, expose private contact details, home addresses,
private accounts, passwords, or other sensitive personal data.
Clearly separate verified facts from uncertainty.
`,
      tools: [{ type: "web_search" }],
      input: query.trim()
    });

    res.json({ answer: response.output_text || "कोई जानकारी नहीं मिली।" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error?.message || "Public information search failed."
    });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, model });
});

app.listen(port, () => {
  console.log(`Krishan AI running at http://localhost:${port}`);
});