import { extractTextFromFile } from '@/lib/fileParser';
import { countTokens } from '@/lib/tokenizer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await extractTextFromFile(buffer, file.type);
    const tokens = countTokens(text);

    return NextResponse.json({
      name: file.name,
      tokens,
      text: text.substring(0, 1000), // Return snippet
      charCount: text.length
    });
  } catch (error) {
    console.error('File Parse API Error:', error);
    return NextResponse.json({ error: 'Failed to parse file' }, { status: 500 });
  }
}
