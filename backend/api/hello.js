export default function handler(req, res) {
  res.status(200).json({ status: 'Hello', timestamp: Date.now() });
}
