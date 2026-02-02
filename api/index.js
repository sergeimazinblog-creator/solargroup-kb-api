import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "missing q" });
  }

  const search = q.toLowerCase();
  const dataDir = path.join(process.cwd(), "data");

  let results = [];

  try {
    const files = fs.readdirSync(dataDir);

    files.forEach((fileName) => {
      if (!fileName.endsWith(".txt")) return;

      const fullPath = path.join(dataDir, fileName);
      const text = fs.readFileSync(fullPath, "utf8");

      const blocks = text.split("=====").map((b) => b.trim());

      const matchedBlocks = blocks.filter((b) =>
        b.toLowerCase().includes(search)
      );

      if (matchedBlocks.length > 0) {
        results.push({
          fileName,
          matchedBlocks,
        });
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error", details: err.message });
  }

  res.json({
    query: q,
    results,
  });
}
