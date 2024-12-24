import { NextRequest, NextResponse } from 'next/server'
import { getOrCreatePet, updatePetStats } from '@/lib/db'
import { generateAIResponse } from '@/lib/ai'

export async function POST(req: NextRequest) {
  try {
    const { mintAddress, userMessage } = await req.json()

    const pet = getOrCreatePet(mintAddress)
    // Build prompt
    const prompt = `
      You are a ${pet.species} named ${pet.name}.
      Stats: hunger=${pet.hunger}, happiness=${pet.happiness}, level=${pet.level}.
      The user says: "${userMessage}"
      Respond in 1-3 sentences from the pet's perspective.
    `
    const petReply = await generateAIResponse(prompt)

    // Simple logic
    let { hunger, happiness, level } = pet
    if (/feed/i.test(userMessage)) {
      hunger = Math.max(0, hunger - 2)
      happiness += 1
    } else if (/play/i.test(userMessage)) {
      happiness += 2
      hunger += 1
    } else {
      happiness += 1
    }

    if (happiness > 10) {
      level++
      happiness = 5
    }

    updatePetStats(mintAddress, { hunger, happiness, level })

    return NextResponse.json({ success: true, petReply, hunger, happiness, level })
  } catch (error: any) {
    console.error('Interact error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
