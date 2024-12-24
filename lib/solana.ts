import { Keypair, Connection } from '@solana/web3.js'
import { Metaplex, keypairIdentity, irysStorage } from '@metaplex-foundation/js'
import fs from 'fs'
import path from 'path'
// import { uploadJSONToIPFS } from './ipfs' // if you want to store metadata on IPFS

const secretKeyPath = path.join(process.cwd(), 'wallet/dev-wallet.json')
const secretKey = new Uint8Array(JSON.parse(fs.readFileSync(secretKeyPath, 'utf-8')))
const keypair = Keypair.fromSecretKey(secretKey)

const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com')
const metaplex = new Metaplex(connection)
  .use(keypairIdentity(keypair))
  .use(irysStorage())

interface AdoptPetOptions {
  ownerPubkey: string
  petName: string
  species: string
}

export async function adoptPet({ ownerPubkey, petName, species }: AdoptPetOptions): Promise<string> {
  // 1) (Optional) create metadata JSON & upload to IPFS
  // For brevity, just do a placeholder URI
  const metadataURI = 'https://example.com/pet.json'

  // 2) create NFT
  const { nft } = await metaplex.nfts().create({
    uri: metadataURI, // Ensure this is a valid IPFS URI
    name: petName,    // Pet name input by the user
    symbol: 'AIPET',  // NFT symbol
    sellerFeeBasisPoints: 500, // 5% royalties
  });

  console.log('Minted NFT:', nft.address.toBase58())
  return nft.address.toBase58()
}
