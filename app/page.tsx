import { supabase } from '@/lib/supabase'
import type { Product } from '@/lib/supabase'
import ProductSearch from './components/ProductSearch'
import Hero from './components/Hero'

export default async function Home() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
  }

  return (
    <main>
      <Hero />
      <ProductSearch products={(products as Product[]) ?? []} />
    </main>
  )
}
