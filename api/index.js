import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    res.status(400).json({ error: "missing q" });
    return;
  }

  const query = q.toLowerCase().trim();

  // Папка с файлами
  const dataDir = path.join(process.cwd(), "data");

  // Читаем список файлов
  let files;
  try {
    files = fs.readdirSync(dataDir);
  } catch (err) {
    res.status(500).json({ error: "Cannot read data directory", details: err.message });
    return;
  }

  let results = [];

  // Ищем во всех файлах
  for (const file of files) {
    const fullPath = path.join(dataDir, file);

    // Только .txt файлы
    if (!file.endsWith(".txt")) continue;

    const text = fs.readFileSync(fullPath, "utf8");
    const lower = text.toLowerCase();

    if (lower.includes(query)) {
      const index = lower.indexOf(query);
      const start = Math.max(0, index - 300);
      const end = Math.min(text.length, index + 700);

      results.push({
        fileName: file,
        snippet: text.substring(start, end)
      });
    }
  }

  res.json({
    query: q,
    results
  });
}
