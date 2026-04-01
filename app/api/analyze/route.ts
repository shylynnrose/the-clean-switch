import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '@/lib/supabase'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { barcode } = await request.json()

    if (!barcode) {
      return NextResponse.json({ error: 'No barcode provided' }, { status: 400 })
    }

    // Try Open Food Facts first, then Open Beauty Facts
    let productData = null
    let productName = 'Unknown Product'
    let ingredients = ''
    let imageUrl = ''
    let price = ''

    const foodRes = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`,
      { next: { revalidate: 3600 } }
    )
    const foodData = await foodRes.json()

    if (foodData.status === 1 && foodData.product) {
      productData = foodData.product
      productName = productData.product_name || productData.abbreviated_product_name || 'Unknown Product'
      ingredients = productData.ingredients_text || ''
      imageUrl = productData.image_url || ''
    } else {
      // Try Open Beauty Facts for personal care products
      const beautyRes = await fetch(
        `https://world.openbeautyfacts.org/api/v2/product/${barcode}.json`,
        { next: { revalidate: 3600 } }
      )
      const beautyData = await beautyRes.json()

      if (beautyData.status === 1 && beautyData.product) {
        productData = beautyData.product
        productName = productData.product_name || 'Unknown Product'
        ingredients = productData.ingredients_text || ''
        imageUrl = productData.image_url || ''
      }
    }

    if (!productData) {
      return NextResponse.json({
        error: 'Product not found',
        message: "We couldn't find this product in our database. Try scanning another product!"
      }, { status: 404 })
    }

    if (!ingredients) {
      return NextResponse.json({
        productName,
        imageUrl,
        error: 'No ingredients found',
        message: "We found this product but couldn't find its ingredient list."
      }, { status: 200 })
    }

    // Analyse ingredients with Claude
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are an expert in product safety and clean living. Analyse these ingredients from "${productName}" and rate each one.

Ingredients: ${ingredients}

Return a JSON object with this exact structure:
{
  "overallRating": "safe" | "caution" | "avoid",
  "overallSummary": "one sentence plain English summary",
  "ingredients": [
    {
      "name": "ingredient name",
      "rating": "safe" | "caution" | "avoid",
      "reason": "brief plain English explanation (max 15 words)"
    }
  ]
}

Rules:
- safe = no known concerns
- caution = some studies show potential concerns, or common allergen
- avoid = linked to hormone disruption, carcinogens, or harmful chemicals
- Keep reasons simple and jargon-free
- Only list the top 8 most important ingredients
- Return ONLY the JSON, no other text`
        }
      ]
    })

    const analysisText = message.content[0].type === 'text' ? message.content[0].text : ''
    // Extract JSON from response (Claude sometimes adds extra text)
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Invalid analysis response')
    const analysis = JSON.parse(jsonMatch[0])

    // Map Open Food Facts category tags to our DB categories
    const categoryTags: string[] = productData.categories_tags || []
    const categoryMap: Record<string, string> = {
      'personal-care': 'Bathroom',
      'beauty': 'Bathroom',
      'cosmetics': 'Bathroom',
      'hair-care': 'Bathroom',
      'skin-care': 'Bathroom',
      'oral-care': 'Bathroom',
      'deodorants': 'Bathroom',
      'cleaning': 'Cleaning',
      'household-cleaning': 'Cleaning',
      'cleaning-products': 'Cleaning',
      'laundry': 'Laundry',
      'laundry-detergents': 'Laundry',
      'baby': 'Baby',
      'baby-care': 'Baby',
      'baby-food': 'Baby',
      'kitchen': 'Kitchen',
      'beverages': 'Kitchen',
      'food': 'Kitchen',
      'snacks': 'Kitchen',
    }
    let dbCategory: string | null = null
    for (const tag of categoryTags) {
      const key = tag.replace('en:', '').toLowerCase()
      if (categoryMap[key]) { dbCategory = categoryMap[key]; break }
    }

    // Find clean alternatives — filter by category, fall back to top-rated if none found
    let alternatives = null
    if (dbCategory) {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('category', dbCategory)
        .order('rating', { ascending: false })
        .limit(3)
      alternatives = data
    }
    if (!alternatives || alternatives.length === 0) {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('rating', { ascending: false })
        .limit(3)
      alternatives = data
    }

    return NextResponse.json({
      productName,
      imageUrl,
      ingredients: ingredients.substring(0, 200),
      analysis,
      alternatives: alternatives || [],
    })

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json({ error: 'Failed to analyse product' }, { status: 500 })
  }
}
