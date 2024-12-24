interface PetData {
    name: string
    species: string
    ownerPubkey: string
    hunger: number
    happiness: number
    level: number
  }
  
  const PET_DB: Record<string, PetData> = {}
  
  export function getOrCreatePet(mintAddress: string, initial?: Partial<PetData>): PetData {
    if (!PET_DB[mintAddress]) {
      PET_DB[mintAddress] = {
        name: initial?.name || 'Pet',
        species: initial?.species || 'Cat',
        ownerPubkey: initial?.ownerPubkey || '',
        hunger: 5,
        happiness: 5,
        level: 1,
      }
    }
    return PET_DB[mintAddress]
  }
  
  export function updatePetStats(mintAddress: string, updates: Partial<PetData>) {
    if (PET_DB[mintAddress]) {
      PET_DB[mintAddress] = { ...PET_DB[mintAddress], ...updates }
    }
  }
  
  export function listAllPets(): Array<{ mintAddress: string } & PetData> {
    return Object.entries(PET_DB).map(([mintAddress, data]) => ({
      mintAddress,
      ...data
    }))
  }
  