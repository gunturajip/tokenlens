import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import { parse } from 'csv-parse/sync';

/**
 * Extracts text from a buffer based on its file type.
 */
export async function extractTextFromFile(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  switch (mimeType) {
    case 'application/pdf':
      const pdfData = await pdf(buffer);
      return pdfData.text || '';
      
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      const docxData = await mammoth.extractRawText({ buffer });
      return docxData.value || '';
      
    case 'text/csv':
      const csvData = parse(buffer, {
        skip_empty_lines: true,
        trim: true,
      });
      return csvData.map((row: any[]) => row.join(' ')).join('\n');
      
    case 'text/plain':
    case 'text/markdown':
    case 'application/x-javascript':
    case 'text/html':
    case 'text/css':
      return buffer.toString('utf-8');
      
    default:
      throw new Error(`Unsupported file type: ${mimeType}`);
  }
}
