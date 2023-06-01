import * as dotenv from 'dotenv';

dotenv.config();
/* s3.getBucketCors({Bucket: process.env.S3_BUCKET}, function(err, data) {}) */
import express from "express";
import cors from "cors";
import { addPost, getPost, getPosts } from "./db/query.js";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor listo en http://localhost:" + PORT);
});

app.get("/posts", async (req, res) => {
  try {
    const result = await getPosts();
    return res.json({
      ok: true,
      message: "Lista de Posts",
      result,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(code)
      .json({ ok: false, code: 404, message: "No se encuentra", result });
  }
});

app.post("/posts", async (req, res) => {
  try {
    const { titulo, url, descripcion } = req.body;
    const result = await addPost({ titulo, url, descripcion });
    return res.json({
      ok: true,
      message: "Nuevo Post añadido",
      result,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(code)
      .json({ ok: false, code: 404, message: "No se encuentra", result });
  }
});

app.get("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getPost(id);
    return res.json({
      ok: true,
      message: "Post encontrado",
      result,
    });
  } catch (error) {
    console.log(error);
    if (error.code === "22P02") {
      return res
        .status(400)
        .json({ ok: false, message: "Formato no válido en el parámetro" });
    }
    if (error.code === "404") {
      return res
        .status(404)
        .json({ ok: false, message: "No existe ese registro" });
    }
    return res.status(500).json({ ok: false, message: "Error de Servidor" });
  }
});
