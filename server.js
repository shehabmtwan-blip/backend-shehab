import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENAI_API_KEY;

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
            content: `ولد لي موقع HTML/CSS/JS كامل للوصف التالي فقط ككود، بدون شرح إضافي:\n${description}`
          }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("❌ API Error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    const code = data.choices?.[0]?.message?.content || "";
    res.json({ code });

  } catch (err) {
    console.error("❌ Server Error:", err);
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
            content: `ولد لي قاعدة بيانات ${dbType} للوصف التالي على شكل أكواد SQL منظمة داخل كود بلوك فقط، بدون شرح:\n${description}`
          }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("❌ API Error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    const schema = data.choices?.[0]?.message?.content || "";
    res.json({ schema });

  } catch (err) {
    console.error("❌ Server Error:", err);
    res.status(500).json({ error: "خطأ في التوليد" });
  }
});

// مسار رئيسي للتأكد أن السيرفر شغال
app.get("/", (req, res) => {
  res.send("🚀 السيرفر شغال بنجاح، جرّب /api/idea2website أو /api/idea2sql");
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
