'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface PetData {
  name: string
  species: string
  ownerPubkey: string
  hunger: number
  happiness: number
  level: number
}

interface PetResponse extends PetData {
  mintAddress: string
}

export default function HomePage() {
  const [connectedPubkey, setConnectedPubkey] = useState('')
  const [petName, setPetName] = useState('')
  const [species, setSpecies] = useState('Cat')
  const [mintAddress, setMintAddress] = useState('')
  const [petData, setPetData] = useState<PetData | null>(null)
  const [userMessage, setUserMessage] = useState('')
  const [petReply, setPetReply] = useState('')
  const [allPets, setAllPets] = useState<PetResponse[]>([])

  // On mount, fetch all pets
  useEffect(() => {
    fetchPets()
  }, [])

  async function fetchPets() {
    try {
      const res = await axios.get('/api/pets')
      if (res.data.success) {
        setAllPets(res.data.pets)
      }
    } catch (err) {
      console.error('Error fetching pets:', err)
    }
  }

  // Faked wallet connect. For real usage, integrate @solana/wallet-adapter
  function fakeConnectWallet() {
    setConnectedPubkey('GFNAzGNwaHsXJZCXZRuYVidrj9JANw8c92oiZFnmkxTR')
  }

  async function adoptPet() {
    if (!connectedPubkey) {
      alert('Connect wallet first!')
      return
    }
    if (!petName) {
      alert('Enter a pet name')
      return
    }
    try {
      const res = await axios.post('/api/adopt', {
        ownerPubkey: connectedPubkey,
        petName,
        species
      })
      if (res.data.success) {
        setMintAddress(res.data.mintAddress)
        setPetData(res.data.petData)
        fetchPets()
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function interactWithPet() {
    if (!mintAddress || !userMessage) return
    try {
      const res = await axios.post('/api/interact', {
        mintAddress,
        userMessage
      })
      if (res.data.success) {
        setPetReply(res.data.petReply)
        setPetData((old) => old
          ? {
              ...old,
              hunger: res.data.hunger,
              happiness: res.data.happiness,
              level: res.data.level
            }
          : null
        )
        setUserMessage('')
        fetchPets()
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Quick style objects for a consistent look
  const containerStyle: React.CSSProperties = {
    margin: '0 auto',
    maxWidth: '600px',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#1e1e1e',
    color: '#f4f4f4',
    minHeight: '100vh',
  }

  const headingStyle: React.CSSProperties = {
    fontSize: '1.8rem',
    marginBottom: '1rem',
    borderBottom: '2px solid #444',
    paddingBottom: '0.5rem',
  }

  const labelStyle: React.CSSProperties = {
    display: 'inline-block',
    width: '80px',
    marginRight: '0.5rem',
  }

  const inputStyle: React.CSSProperties = {
    padding: '0.4rem',
    marginRight: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #555',
    backgroundColor: '#2b2b2b',
    color: '#f4f4f4',
    outline: 'none',
  }

  const buttonStyle: React.CSSProperties = {
    padding: '0.4rem 0.8rem',
    marginLeft: '0.5rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#e91e63',
    color: '#fff',
    cursor: 'pointer',
  }

  const sectionStyle: React.CSSProperties = {
    marginTop: '1.5rem',
    padding: '1rem',
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
  }

  const petSectionStyle: React.CSSProperties = {
    marginTop: '1rem',
    border: '1px solid #444',
    borderRadius: '6px',
    padding: '1rem',
    backgroundColor: '#292929',
  }

  const listItemStyle: React.CSSProperties = {
    marginBottom: '0.5rem',
    borderBottom: '1px solid #444',
    paddingBottom: '0.3rem',
  }

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>AI Virtual Pet Sanctuary</h1>

      {!connectedPubkey ? (
        <button style={buttonStyle} onClick={fakeConnectWallet}>Connect Wallet</button>
      ) : (
        <p>Wallet: <strong>{connectedPubkey}</strong></p>
      )}

      <div style={sectionStyle}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Pet Name:</label>
          <input
            style={inputStyle}
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            placeholder="Fluffy"
          />
          <select style={inputStyle} value={species} onChange={(e) => setSpecies(e.target.value)}>
            <option>Cat</option>
            <option>Dog</option>
            <option>Dragon</option>
            <option>Alien</option>
          </select>
          <button style={buttonStyle} onClick={adoptPet}>Adopt Pet</button>
        </div>

        {mintAddress && petData && (
          <div style={petSectionStyle}>
            <h3>{petData.name} the {petData.species}</h3>
            <p>Mint: {mintAddress}</p>
            <p>
              Hunger: {petData.hunger}, Happiness: {petData.happiness}, Level: {petData.level}
            </p>

            <div style={{ marginTop: '0.5rem' }}>
              <input
                style={inputStyle}
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Feed apples, play ball, etc."
              />
              <button style={buttonStyle} onClick={interactWithPet}>Interact</button>
            </div>
            {petReply && (
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Pet says:</strong> {petReply}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={sectionStyle}>
        <h2>All Pets in Sanctuary</h2>
        {allPets.length === 0 ? (
          <p>No pets yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {allPets.map((p) => (
              <li key={p.mintAddress} style={listItemStyle}>
                <strong>{p.name}</strong> ({p.species}) – 
                Hunger: {p.hunger}, Happiness: {p.happiness}, Level: {p.level}
                <br />
                <small>Mint: {p.mintAddress}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
