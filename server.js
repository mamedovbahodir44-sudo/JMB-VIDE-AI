const express = require("express");
const cors = require("cors");
const { fal } = require("@fal-ai/client");

const app = express();

app.use(cors());
app.use(express.json());

fal.config({
  credentials: process.env.FAL_KEY
});

app.get("/", (req, res) => {
  res.json({
    status: "online",
    name: "JMB VIDEO AI"
  });
});

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim().length < 3) {
      return res.status(400).json({
        error: "Prompt juda qisqa"
      });
    }

    const result = await fal.subscribe(
      "fal-ai/wan/v2.7/text-to-video",
      {
        input: {
          prompt: prompt.trim(),
          resolution: "720p",
          duration: 5,
          aspect_ratio: "16:9"
        },
        logs: true
      }
    );

    res.json({
      success: true,
      video: result.data?.video || null
    });

  } catch (error) {
    console.error("Generation error:", error.message);

    res.status(500).json({
      success: false,
      error: "Video yaratishda xatolik yuz berdi"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`JMB VIDEO AI server running on port ${PORT}`);
});
