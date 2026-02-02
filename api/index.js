import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    res.status(400).json({ error: "missing q" });
    return;
  }

  const query = q.toLowerCase();

  const dataDir = path.join(process.cwd(), "data");
  let results = [];

  try {
    const files = fs.readdirSync(dataDir);

    for (const file of files) {
      const filePath = path.join(dataDir, file);
      const content = fs.readFileSync(filePath, "utf8");

      const lower = content.toLowerCase();
      const idx = lower.indexOf(query);

      if (idx !== -1) {
        const snippet = content.substring(
          Math.max(0, idx - 400),
          Math.min(content.length, idx + 400)
        );

        results.push({
          fileName: file,
          snippet,
        });
      }
    }
  } catch (e) {
    res.status(500).json({ error: "read error", detail: e.toString() });
    return;
  }

  res.json({
    query,
    results
  });
}
