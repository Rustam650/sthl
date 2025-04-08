import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { url } = req.query;
    
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL parameter is required' });
    }
    
    try {
      const response = await fetch(url);
      const contentType = response.headers.get('content-type');
      
      if (!contentType || !contentType.startsWith('image/')) {
        return res.status(400).json({ 
          error: 'Not a valid image',
          contentType,
          url 
        });
      }
      
      res.status(200).json({ success: true, contentType, url });
    } catch (error) {
      console.error('Error checking image:', error);
      res.status(500).json({ error: 'Failed to check image', url });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
