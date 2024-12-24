import { NextRequest, NextResponse } from 'next/server'
import { adoptPet } from '@/lib/solana'
import { getOrCreatePet } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { ownerPubkey, petName, species } = await req.json()

    // Call your Solana NFT mint logic
    const mintAddress = await adoptPet({ ownerPubkey, petName, species })

    // Store the pet in memory or DB
    const petData = getOrCreatePet(mintAddress, {
      name: petName,
      species,
      ownerPubkey
    })

    return NextResponse.json({ success: true, mintAddress, petData })
  } catch (error: any) {
    console.error('Adopt error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
