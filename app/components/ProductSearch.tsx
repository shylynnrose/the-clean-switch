'use client'

import { useState } from 'react'
import type { Product } from '@/lib/supabase'

const CATEGORIES = ['All', 'Kitchen', 'Bathroom', 'Laundry', 'Bedroom', 'Baby', 'Cleaning']

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? 'text-amber-400' : 'text-stone-200'}>
          ★
        </span>
      ))}
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-shadow">
      {product.image_url && (
        <div className="h-44 bg-stone-50 overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide">{product.category}</p>
            <h3 className="font-semibold text-stone-800 text-lg leading-tight">{product.name}</h3>
            {product.brand && <p className="text-sm text-stone-400">{product.brand}</p>}
          </div>
          <StarRating rating={product.rating} />
        </div>

        {product.description && (
          <p className="text-stone-600 text-sm mt-2 mb-3">{product.description}</p>
        )}

        {product.why_its_clean && (
          <div className="bg-emerald-50 rounded-xl px-3 py-2 mb-4">
            <p className="text-xs font-medium text-emerald-700 mb-0.5">Why it&apos;s clean</p>
            <p className="text-xs text-emerald-600">{product.why_its_clean}</p>
          </div>
        )}

        {product.affiliate_link && (
          <a
            href={product.affiliate_link}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
          >
            Shop This Swap →
          </a>
        )}
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
      p.category.toLowerCase().includes(search.toLowerCase())

    const matchesCategory = activeCategory === 'All' || p.category === activeCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div style={{backgroundColor: '#fafaf9', minHeight: '100vh'}}>
      {/* Hero */}
      <div className="bg-white border-b border-stone-100 py-10 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-3">
            Find your clean swap
          </h1>
          <p className="text-stone-500 mb-6 max-w-lg mx-auto">
            Every product here has been researched and vetted. No greenwashing, no guesswork.
          </p>
          <input
            type="text"
            placeholder="Search swaps... e.g. shampoo, laundry, deodorant"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xl mx-auto block px-5 py-3.5 rounded-2xl border border-stone-200 shadow-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-emerald-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-5xl mx-auto px-6 pb-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🌿</p>
            <p className="text-stone-500">No swaps found. Try a different search!</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-stone-400 mb-4">{filtered.length} swap{filtered.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
