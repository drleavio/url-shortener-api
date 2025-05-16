const express = require("express");
const { neon } = require("@neondatabase/serverless");
const { shortenUrl } = require("./src/short");
require("dotenv").config();

const app = express();
app.use(express.json());

const sql = neon(process.env.DATABASE_URL);

app.post("/", async (req, res) => {
  try {
    const { original_url } = req.body;
    if (!original_url) return res.status(400).json({ error: "original_url is required" });

    const shortUrl = shortenUrl(original_url);

    // Save original_url and shortKey in DB
    await sql`
      INSERT INTO url_shortener (original_url, shortend_url)
      VALUES (${original_url}, ${shortUrl});
    `;

    res.json({ message: "added successfully", shortUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Lookup original url by short key
app.get("/original/:key", async (req, res) => {
  const key = req.params.key;
  try {
    const result = await sql`
      SELECT original_url FROM url_shortener WHERE shortend_url = ${key} LIMIT 1;
    `;

    if (result.length === 0) return res.status(404).json({ error: "Not found" });

    res.json({ original_url: result[0].original_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/:key", async (req, res) => {
    const key = req.params.key;
  
    try {
      const result = await sql`
        SELECT original_url FROM url_shortener WHERE shortend_url = ${key} LIMIT 1;
      `;
  
      if (result.length === 0) {
        return res.status(404).send("URL not found");
      }
  
      const originalUrl = result[0].original_url;
  
      // Redirect to the original URL
      return res.redirect(originalUrl);
  
    } catch (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
  });
  

app.listen(3000, () => {
  console.log("server up on port 3000");
});
