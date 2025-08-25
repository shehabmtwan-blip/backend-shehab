import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENAI_API_KEY;

app.use(cors());
app.use(bodyParser.json());

// Idea2Website endpoint
app.post('/api/idea2website', async (req, res) => {
  const { description } = req.body;
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `ولد لي موقع HTML/CSS/JS كامل للوصف التالي: ${description}`
          }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0].message) {
      return res.status(500).json({ error: "رد غير متوقع من OpenAI" });
    }

    const code = data.choices[0].message.content;
    res.json({ code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطأ في التوليد" });
  }
});

// Idea2SQL endpoint
app.post('/api/idea2sql', async (req, res) => {
  const { description, dbType } = req.body;
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `ولد لي قاعدة بيانات ${dbType} للوصف التالي: ${description}`
          }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0].message) {
      return res.status(500).json({ error: "رد غير متوقع من OpenAI" });
    }

    const schema = data.choices[0].message.content;
    res.json({ schema });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطأ في التوليد" });
  }
});

// مسار رئيسي للتأكد أن السيرفر شغال
app.get("/", (req, res) => {
  res.send("🚀 السيرفر شغال بنجاح، جرّب /api/idea2website أو /api/idea2sql");
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
