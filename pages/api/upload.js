import formidable from 'formidable';
import fs from 'fs';
import pdf from 'pdf-parse';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const form = formidable({ keepExtensions: true });
  
  form.parse(req, async (err, fields, files) => {
    if (err || !files.pdf) {
      return res.status(400).json({ error: 'Failed to upload file' });
    }
    
    const file = Array.isArray(files.pdf) ? files.pdf[0] : files.pdf;
    
    try {
      // Extract PDF text
      const dataBuffer = await fs.promises.readFile(file.filepath);
      const pdfData = await pdf(dataBuffer);
      const extractedText = pdfData.text;
      
      // Build prompt to extract variables
      const prompt = `
Extract only the average daily usage and average daily export values from this electricity bill.
Format your response exactly as follows:
Average Daily Usage: X kWh
Average Daily Export: Y kWh

Pay atention to the period of the bill (how many days it covers) because sometimes the bill shows the total exported to the grid and we need the average daily. If you find the total exported to the grid, divide it by the number of days of the bill period.

Electricity Bill Text:
${extractedText}
      `;
      
      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500,
        }),
      });
      
      const openaiData = await openaiRes.json();
      
      if (!openaiData.choices?.[0]?.message?.content) {
        throw new Error('No response from OpenAI');
      }

      // Extract values from the response
      const responseText = openaiData.choices[0].message.content;
      const usageMatch = responseText.match(/Average Daily Usage:\s*([\d.]+)/i);
      const exportMatch = responseText.match(/Average Daily Export:\s*([\d.]+)/i);

      const dailyUsage = usageMatch ? parseFloat(usageMatch[1]) : null;
      const dailyExport = exportMatch ? parseFloat(exportMatch[1]) : null;

      const response = {
        dailyUsage,
        dailyExport,
        rawResponse: responseText
      };
      
      return res.status(200).json({ result: response });
      
    } catch (error) {
      console.error('Processing error:', error);
      return res.status(500).json({ 
        error: 'Failed to process PDF', 
        details: error.message 
      });
    }
  });
}
