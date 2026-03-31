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

const ratingConfig = {
  safe: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: '✅', label: 'Safe' },
  caution: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: '⚠️', label: 'Caution' },
  avoid: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: '❌', label: 'Avoid' },
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
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">Ingredient Scanner</h1>
        <p className="text-stone-500">Scan any product barcode to see what&apos;s really inside</p>
      </div>

      {/* Scanner */}
      {!loading && !result && (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 mb-6">
          <div id={scannerDivId} className={scanning ? 'rounded-xl overflow-hidden mb-4' : 'hidden'} />

          {!scanning ? (
            <button
              onClick={startScanner}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-4 rounded-2xl transition-colors flex items-center justify-center gap-2 text-lg"
            >
              <span>📷</span> Scan Barcode
            </button>
          ) : (
            <button
              onClick={stopScanner}
              className="w-full bg-stone-200 hover:bg-stone-300 text-stone-700 font-medium py-3 rounded-2xl transition-colors"
            >
              Cancel
            </button>
          )}

          <div className="mt-4">
            <p className="text-center text-sm text-stone-400 mb-3">or enter barcode manually</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. 012345678901"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => manualBarcode && analyzeBarcode(manualBarcode)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl transition-colors font-medium"
              >
                Check
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-10 text-center">
          <div className="text-4xl mb-3 animate-spin inline-block">🌿</div>
          <p className="text-stone-600 font-medium">Analysing ingredients...</p>
          <p className="text-stone-400 text-sm mt-1">This takes a few seconds</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-4 text-center">
          <p className="text-red-600">{error}</p>
          <button onClick={() => { setError(''); setResult(null) }} className="mt-3 text-sm text-red-500 underline">Try again</button>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-4">
          {/* Product header */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 flex items-center gap-4">
            {result.imageUrl && (
              <img src={result.imageUrl} alt={result.productName} className="w-16 h-16 object-contain rounded-xl bg-stone-50" />
            )}
            <div className="flex-1">
              <h2 className="font-semibold text-stone-800 text-lg">{result.productName}</h2>
              {result.analysis && (
                <div className={`inline-flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full text-sm font-medium ${ratingConfig[result.analysis.overallRating].bg} ${ratingConfig[result.analysis.overallRating].color}`}>
                  <span>{ratingConfig[result.analysis.overallRating].icon}</span>
                  <span>{ratingConfig[result.analysis.overallRating].label}</span>
                </div>
              )}
            </div>
          </div>

          {/* Overall summary */}
          {result.analysis && (
            <div className={`rounded-2xl border p-4 ${ratingConfig[result.analysis.overallRating].bg} ${ratingConfig[result.analysis.overallRating].border}`}>
              <p className={`font-medium ${ratingConfig[result.analysis.overallRating].color}`}>{result.analysis.overallSummary}</p>
            </div>
          )}

          {/* Ingredient breakdown */}
          {result.analysis?.ingredients && (
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-stone-100">
                <h3 className="font-semibold text-stone-700">Ingredient Breakdown</h3>
              </div>
              <div className="divide-y divide-stone-50">
                {result.analysis.ingredients.map((ing, i) => (
                  <div key={i} className="px-5 py-3 flex items-start gap-3">
                    <span className="text-lg mt-0.5">{ratingConfig[ing.rating].icon}</span>
                    <div>
                      <p className="font-medium text-stone-800 text-sm">{ing.name}</p>
                      <p className="text-stone-500 text-xs mt-0.5">{ing.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clean alternatives */}
          {result.alternatives && result.alternatives.length > 0 && (
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-stone-100">
                <h3 className="font-semibold text-stone-700">🌿 Clean Alternatives</h3>
                <p className="text-xs text-stone-400 mt-0.5">Vetted swaps from our database</p>
              </div>
              <div className="divide-y divide-stone-50">
                {result.alternatives.map((alt) => (
                  <div key={alt.id} className="px-5 py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-stone-800 text-sm">{alt.name}</p>
                      {alt.brand && <p className="text-stone-400 text-xs">{alt.brand}</p>}
                      {alt.why_its_clean && <p className="text-emerald-600 text-xs mt-0.5">{alt.why_its_clean}</p>}
                    </div>
                    {alt.affiliate_link && (
                      <a href={alt.affiliate_link} target="_blank" rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors">
                        Shop →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scan again */}
          <button
            onClick={() => { setResult(null); setError(''); setManualBarcode('') }}
            className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium py-3 rounded-2xl transition-colors"
          >
            Scan Another Product
          </button>
        </div>
      )}
    </div>
  )
}
