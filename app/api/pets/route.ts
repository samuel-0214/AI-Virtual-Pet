import { NextRequest, NextResponse } from 'next/server'
import { listAllPets } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const pets = listAllPets()
    return NextResponse.json({ success: true, pets })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
