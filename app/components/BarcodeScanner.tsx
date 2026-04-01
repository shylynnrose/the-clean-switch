'use client'

import { useEffect, useRef, useState } from 'react'

type IngredientRating = {
  name: string
  rating: 'safe' | 'caution' | 'avoid'
  reason: string
}

type Analysis = {
  overallRating: 'safe' | 'caution' | 'avoid'
  overallSummary: string
  ingredients: IngredientRating[]
}

type Product = {
  id: number
  name: string
  brand: string
  category: string
  why_its_clean: string
  affiliate_link: string
  rating: number
}

type ScanResult = {
  productName: string
  imageUrl: string
  analysis: Analysis
  alternatives: Product[]
  error?: string
  message?: string
}

const C = {
  olive: '#3d4a35',
  oliveMid: '#5a6b50',
  sagePale: '#eef2eb',
  stonePale: '#f0ede8',
  border: '#e8e5df',
  bg: '#f8f7f4',
  white: '#ffffff',
  text: '#1c1917',
  muted: '#a09880',
}

const ratingConfig = {
  safe:    { color: '#3a5840', bg: '#f4f7f4', border: '#ccdece', dot: '#5b8660', label: 'Safe' },
  caution: { color: '#78450a', bg: '#fffbeb', border: '#fde68a', dot: '#d97706', label: 'Caution' },
  avoid:   { color: '#7f1d1d', bg: '#fef2f2', border: '#fecaca', dot: '#dc2626', label: 'Avoid' },
}

export default function BarcodeScanner() {
  const [scanning, setScanning] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState('')
  const [manualBarcode, setManualBarcode] = useState('')
  const scannerRef = useRef<any>(null)
  const scannerDivId = 'barcode-scanner'

  const analyzeBarcode = async (barcode: string) => {
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode }),
      })
      const data = await res.json()
      if (res.status === 404) {
        setError(data.message || 'Product not found')
      } else if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
      } else {
        setResult(data)
      }
    } catch (err) {
      console.error('Scan error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const startScanner = async () => {
    setScanning(true)
    setResult(null)
    setError('')
    const { Html5Qrcode } = await import('html5-qrcode')
    const html5QrCode = new Html5Qrcode(scannerDivId)
    scannerRef.current = html5QrCode
    try {
      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        async (decodedText: string) => {
          await html5QrCode.stop()
          setScanning(false)
          analyzeBarcode(decodedText)
        },
        () => {}
      )
    } catch {
      setScanning(false)
      setError('Could not access camera. Try entering the barcode manually below.')
    }
  }

  const stopScanner = async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop() } catch {}
    }
    setScanning(false)
  }

  useEffect(() => {
    return () => { if (scannerRef.current) { try { scannerRef.current.stop() } catch {} } }
  }, [])

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.oliveMid, marginBottom: 8 }}>
          Ingredient Scanner
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 700, color: C.text, margin: '0 0 8px' }}>
          What&apos;s really inside?
        </h1>
        <p style={{ fontSize: 14, color: C.muted }}>Scan any barcode for an instant ingredient breakdown</p>
      </div>

      {/* Scanner card */}
      {!loading && !result && (
        <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, padding: 24, marginBottom: 16 }}>
          <div id={scannerDivId} style={{ display: scanning ? 'block' : 'none', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }} />

          {!scanning ? (
            <button
              onClick={startScanner}
              style={{
                width: '100%', background: C.olive, color: '#fff',
                border: 'none', borderRadius: 12, padding: '14px 0',
                fontSize: 15, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Scan a Barcode
            </button>
          ) : (
            <button
              onClick={stopScanner}
              style={{
                width: '100%', background: C.stonePale, color: C.muted,
                border: 'none', borderRadius: 12, padding: '12px 0',
                fontSize: 14, fontWeight: 500, cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 16px' }}>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            <span style={{ fontSize: 12, color: C.muted }}>or enter manually</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              placeholder="e.g. 012345678901"
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && manualBarcode && analyzeBarcode(manualBarcode)}
              style={{
                flex: 1, padding: '12px 16px', borderRadius: 10,
                border: `1px solid ${C.border}`, background: C.bg,
                color: C.text, fontSize: 14, outline: 'none',
              }}
            />
            <button
              onClick={() => manualBarcode && analyzeBarcode(manualBarcode)}
              style={{
                background: C.olive, color: '#fff', border: 'none',
                borderRadius: 10, padding: '12px 20px',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Check
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', border: `3px solid ${C.border}`, borderTopColor: C.olive, margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 600, color: C.text, margin: '0 0 4px' }}>Analysing ingredients...</p>
          <p style={{ fontSize: 13, color: C.muted }}>This takes just a few seconds</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 16, padding: 24, textAlign: 'center', marginBottom: 16 }}>
          <p style={{ color: '#991b1b', fontWeight: 500, margin: '0 0 8px' }}>{error}</p>
          <button onClick={() => { setError(''); setResult(null) }} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 13, textDecoration: 'underline', cursor: 'pointer' }}>
            Try again
          </button>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Product header */}
          <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
            {result.imageUrl ? (
              <img src={result.imageUrl} alt={result.productName} style={{ width: 64, height: 64, objectFit: 'contain', borderRadius: 10, background: C.bg, flexShrink: 0 }} />
            ) : (
              <div style={{ width: 64, height: 64, borderRadius: 10, background: C.stonePale, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, color: C.oliveMid }}>?</span>
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 700, color: C.text, margin: '0 0 6px', lineHeight: 1.3 }}>{result.productName}</h2>
              {result.analysis && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 99, background: ratingConfig[result.analysis.overallRating].bg }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: ratingConfig[result.analysis.overallRating].dot, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: ratingConfig[result.analysis.overallRating].color }}>
                    {ratingConfig[result.analysis.overallRating].label}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          {result.analysis && (
            <div style={{ borderRadius: 16, border: `1px solid ${ratingConfig[result.analysis.overallRating].border}`, padding: 16, background: ratingConfig[result.analysis.overallRating].bg }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: ratingConfig[result.analysis.overallRating].color, margin: 0, lineHeight: 1.6 }}>
                {result.analysis.overallSummary}
              </p>
            </div>
          )}

          {/* Ingredient breakdown */}
          {result.analysis?.ingredients && (
            <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>Ingredient Breakdown</h3>
              </div>
              {result.analysis.ingredients.map((ing, i) => (
                <div key={i} style={{ padding: '12px 20px', borderBottom: i < result.analysis.ingredients.length - 1 ? `1px solid ${C.border}` : 'none', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: ratingConfig[ing.rating].dot, marginTop: 5, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: '0 0 2px' }}>{ing.name}</p>
                    <p style={{ fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.5 }}>{ing.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Clean alternatives */}
          {result.alternatives && result.alternatives.length > 0 && (
            <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 700, color: C.text, margin: '0 0 2px' }}>Clean Alternatives</h3>
                <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Vetted swaps from our database</p>
              </div>
              {result.alternatives.map((alt, i) => (
                <div key={alt.id} style={{ padding: '14px 20px', borderBottom: i < result.alternatives.length - 1 ? `1px solid ${C.border}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: '0 0 2px' }}>{alt.name}</p>
                    {alt.brand && <p style={{ fontSize: 12, color: C.muted, margin: '0 0 2px' }}>{alt.brand}</p>}
                    {alt.why_its_clean && <p style={{ fontSize: 12, color: C.oliveMid, margin: 0, lineHeight: 1.5 }}>{alt.why_its_clean}</p>}
                  </div>
                  {alt.affiliate_link && (
                    <a href={alt.affiliate_link} target="_blank" rel="noopener noreferrer"
                      style={{ background: C.olive, color: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: 'none', flexShrink: 0 }}>
                      Shop
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Scan again */}
          <button
            onClick={() => { setResult(null); setError(''); setManualBarcode('') }}
            style={{ background: C.stonePale, color: C.muted, border: 'none', borderRadius: 12, padding: '14px 0', fontSize: 14, fontWeight: 500, cursor: 'pointer', width: '100%' }}
          >
            Scan Another Product
          </button>
        </div>
      )}
    </div>
  )
}
