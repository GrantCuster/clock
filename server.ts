import express from 'express';
import ViteExpress from 'vite-express';
import axios from 'axios';

const app = express();

app.get("/example", async (_, res) => {
  const response = await axios.get("https://jsonplaceholder.typicode.com/todos/1");
  res.json(response.data);
})


const port = process.env.NODE_ENV === 'production' ? 8080 : 3000;

ViteExpress.listen(app, port, () => {
  console.log(`Server running at http://localhost:${port}`);
})
