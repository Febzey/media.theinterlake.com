import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";

const app = express();
const PORT = 4000;

// Allow requests from frontend
app.use(cors({
  origin: ["http://localhost:3000", "https://media.theinterlake.com"]
}));

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Serve static files
app.use("/uploads", express.static(uploadDir));

// Upload route
app.post("/upload", upload.single("image"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  return res.json({ url: fileUrl });
});

// Health check
app.get("/", (_req: Request, res: Response) => {
  res.send("File server running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
