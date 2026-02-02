export default function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    res.status(400).json({ error: "missing q" });
    return;
  }

  res.json({
    query: q,
    result: "API работает! Сейчас подключим Google Drive."
  });
}
