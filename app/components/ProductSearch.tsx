'use client'

import { useState } from 'react'
import type { Product } from '@/lib/supabase'

const CATEGORIES = ['All', 'Kitchen', 'Bathroom', 'Laundry', 'Bedroom', 'Baby', 'Cleaning']

const C = {
  bg: '#f8f7f4',
  white: '#ffffff',
  olive: '#3d4a35',
  oliveMid: '#5a6b50',
  sagePale: '#eef2eb',
  stone: '#7a7060',
  stonePale: '#f0ede8',
  border: '#e8e5df',
  text: '#1c1917',
  muted: '#a09880',
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div style={{
      background: C.white,
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Image area */}
      <div style={{
        width: '100%',
        height: 220,
        background: C.stonePale,
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 4,
          }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 700, color: C.oliveMid }}>
              {product.brand?.charAt(0) || product.name.charAt(0)}
            </span>
            <span style={{ fontSize: 11, color: C.muted }}>{product.brand}</span>
          </div>
        )}
        <div style={{
          position: 'absolute', top: 12, left: 12,
          background: 'rgba(255,255,255,0.92)',
          borderRadius: 99, padding: '3px 10px',
          fontSize: 10, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: C.olive,
        }}>
          {product.category}
        </div>
      </div>

      {/* Content */}
      <div style={{
        padding: '16px 20px 20px',
        display: 'flex', flexDirection: 'column', flex: 1,
      }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 700, color: C.text, lineHeight: 1.3, marginBottom: 2 }}>
          {product.name}
        </div>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>
          {product.brand}
        </div>

        {product.why_its_clean && (
          <div style={{
            background: C.sagePale, borderRadius: 10,
            padding: '10px 12px', marginBottom: 14,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.oliveMid, marginBottom: 3 }}>
              Why it&apos;s clean
            </div>
            <div style={{ fontSize: 12, color: C.oliveMid, lineHeight: 1.5 }}>
              {product.why_its_clean}
            </div>
          </div>
        )}

        <div style={{ marginTop: 'auto' }}>
          {product.affiliate_link ? (
            <a
              href={product.affiliate_link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block', width: '100%', textAlign: 'center',
                background: C.olive, color: '#fff',
                padding: '11px 0', borderRadius: 10,
                fontSize: 13, fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Shop This Swap
            </a>
          ) : (
            <div style={{
              display: 'block', width: '100%', textAlign: 'center',
              background: C.stonePale, color: C.stone,
              padding: '11px 0', borderRadius: 10,
              fontSize: 13, fontWeight: 500,
            }}>
              Coming Soon
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProductSearch({ products }: { products: Product[] }) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = products.filter((p) => {
    const matchesSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8a9e7a', marginBottom: 16 }}>
            Researched · Vetted · Clean
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 80, flexWrap: 'wrap' }}>
            <h1 style={{
              fontFamily: 'Georgia, serif', fontSize: 56, fontWeight: 700,
              color: C.text, lineHeight: 1.1, margin: 0, flex: '0 0 auto',
            }}>
              Your clean<br />home starts<br />here.
            </h1>
            <div style={{ flex: 1, minWidth: 280 }}>
              <p style={{ fontSize: 15, color: C.stone, lineHeight: 1.7, marginBottom: 20 }}>
                Every product has been researched and vetted. No greenwashing, no guesswork — just honest swaps for every room.
              </p>
              <input
                type="text"
                placeholder="Search by product, brand, or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%', padding: '14px 18px', borderRadius: 10,
                  border: `1px solid ${C.border}`, background: C.bg,
                  color: C.text, fontSize: 14, outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 0' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 18px', borderRadius: 99, fontSize: 13, fontWeight: 500,
                cursor: 'pointer', border: 'none',
                background: activeCategory === cat ? C.olive : C.white,
                color: activeCategory === cat ? '#fff' : C.stone,
                outline: activeCategory === cat ? 'none' : `1px solid ${C.border}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px 60px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: C.stone }}>No swaps found.</p>
            <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Try a different search or category.</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>
              {filtered.length} swap{filtered.length !== 1 ? 's' : ''} found
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 20,
            }}>
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
