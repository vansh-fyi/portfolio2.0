export default function handler(req: any, res: any) {
    res.status(200).json({
        status: 'OK',
        message: 'Simple test endpoint works',
        method: req.method,
        url: req.url,
        timestamp: new Date().toISOString(),
    });
}
