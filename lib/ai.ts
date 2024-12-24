import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

export async function generateAIResponse(prompt: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a playful AI pet.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.9,
    })
    return response.choices[0].message?.content.trim() || ''
  } catch (err) {
    console.error('OpenAI error:', err)
    return 'I got confused...'
  }
}
