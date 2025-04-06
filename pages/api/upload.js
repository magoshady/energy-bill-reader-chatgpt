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

    // Handle the file from formidable
    const file = Array.isArray(files.pdf) ? files.pdf[0] : files.pdf;

    try {
      // Step 1: Read and extract text from the PDF
      const dataBuffer = await fs.promises.readFile(file.filepath);
      const pdfData = await pdf(dataBuffer);
      const extractedText = pdfData.text;
      
      // Optional: Log the extracted text for debugging
      console.log("Extracted text:", extractedText.substring(0, 200)); // log first 200 chars

// Step 2: Create a prompt using the extracted text
const prompt = `
Extract the following details from the electricity bill text. Return the results in a clear list format with each variable labeled.
a. Customer Name
b. Address
c. Number of days in the period
d. Average Daily Usage
e. Total Usage
f. Average daily Feed In or Export to the grid. If the bill provides a total export value, compute the average daily export by dividing that total by the number of days in the period.

Electricity Bill Text:
${extractedText}
`;

      // Step 3: Call the OpenAI Chat API with the prompt
      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4', // or 'gpt-4o' if preferred
          messages: [
            { role: 'user', content: prompt }
          ],
          max_tokens: 500,
        }),
      });

      const openaiData = await openaiRes.json();
      return res.status(200).json({ result: openaiData });
    } catch (error) {
      console.error('Processing error:', error);
      return res.status(500).json({ error: 'Failed to process PDF', details: error.message });
    }
  });
}
