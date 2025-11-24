export default function handler(req, res) {
  res.status(200).json({
    status: 'Pong',
    message: 'If you see this, Vercel is finding the api folder correctly.',
    version: 'v2',
    timestamp: Date.now()
  });
}
