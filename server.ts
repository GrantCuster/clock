import express from "express";
import ViteExpress from "vite-express";
import axios from "axios";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
app.use(bodyParser.json({ limit: "10mb" })); // Increase limit if large images are expected

// Serve static files from the 'public' directory
app.use(express.static("uploads"));

app.get("/example", async (_, res) => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/todos/1",
  );
  res.json(response.data);
});

// Endpoint to upload canvas data URL
app.post("/api/upload", (req, res) => {
  const { dataUrl, filename } = req.body;

  if (!dataUrl || !filename) {
    return res
      .status(400)
      .json({ error: "Missing dataUrl or filename in request" });
  }

  // Extract base64 data from the Data URL
  const matches = dataUrl.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!matches) {
    return res.status(400).json({ error: "Invalid data URL" });
  }

  const fileType = matches[1]; // e.g., 'png'
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, "base64");

  // Save the file
  const filePath = `uploads/${filename}.${fileType}`;
  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      console.error("Error saving file:", err);
      return res.status(500).json({ error: "Failed to save file" });
    }

    console.log(`File saved: ${filePath}`);
    res.json({ message: "File uploaded successfully", path: filePath });
  });
});

const port = process.env.NODE_ENV === "production" ? 8080 : 3000;

ViteExpress.listen(app, port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
