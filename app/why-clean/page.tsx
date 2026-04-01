const C = {
  olive: '#3d4a35',
  oliveMid: '#5a6b50',
  olivePale: '#8a9e7a',
  sagePale: '#eef2eb',
  border: '#e8e5df',
  bg: '#f8f7f4',
  white: '#ffffff',
  text: '#1c1917',
  muted: '#a09880',
  stone: '#7a7060',
}

const concerns = [
  {
    title: 'Endocrine disruptors',
    body: 'Chemicals like phthalates, parabens, and BPA mimic hormones in your body. They\'re found in plastics, fragrances, and personal care products — and they\'ve been linked to fertility issues, early puberty, and thyroid disruption.',
    found: 'Plastic food containers, scented candles, shampoo, lotion',
  },
  {
    title: 'PFAS ("forever chemicals")',
    body: 'Per- and polyfluoroalkyl substances don\'t break down — ever. They accumulate in your body over time and have been linked to cancer, immune dysfunction, and developmental issues in children.',
    found: 'Non-stick cookware, water-resistant clothing, stain-resistant carpet, some food packaging',
  },
  {
    title: 'Volatile organic compounds (VOCs)',
    body: 'VOCs off-gas into your home\'s air from paints, cleaning products, and synthetic materials. Indoor air can be 2–5x more polluted than outdoor air, according to the EPA.',
    found: 'Conventional cleaning sprays, air fresheners, new furniture, carpeting',
  },
  {
    title: 'Synthetic fragrance',
    body: '"Fragrance" on an ingredient list can mean hundreds of undisclosed chemicals. Manufacturers aren\'t required to list them individually. Many contain allergens, hormone disruptors, and neurotoxins.',
    found: 'Laundry detergent, dryer sheets, candles, dish soap, personal care products',
  },
  {
    title: 'Formaldehyde releasers',
    body: 'Preservatives like DMDM hydantoin and quaternium-15 slowly release formaldehyde — a known carcinogen — over time. They\'re extremely common in conventional shampoos and baby products.',
    found: 'Shampoo, conditioner, baby wash, some cleaning products',
  },
  {
    title: 'Optical brighteners',
    body: 'These synthetic chemicals coat your laundry to make it appear whiter under UV light. They don\'t rinse out fully — they stay on your skin all day, and they don\'t biodegrade in waterways.',
    found: 'Conventional laundry detergent',
  },
]

const faqs = [
  {
    q: 'Isn\'t the dose what makes the poison?',
    a: 'For some toxins, yes. But endocrine disruptors work differently — even tiny amounts can have significant hormonal effects, especially during fetal development and early childhood. And the cumulative effect of exposure across dozens of products every day adds up.',
  },
  {
    q: 'If these products were truly dangerous, wouldn\'t they be banned?',
    a: 'Not necessarily. The US has some of the weakest cosmetic and household product regulations in the world. The EU has banned over 1,400 chemicals from personal care products. The US has banned 11. Companies are largely allowed to self-regulate.',
  },
  {
    q: 'Does switching really make a difference?',
    a: 'Yes — research shows measurable reductions in hormone-disrupting chemicals in the body within just a few days of switching to cleaner personal care products. Your home is one of the most controllable environments in your life.',
  },
  {
    q: 'Do clean products actually work as well?',
    a: 'Mostly yes, and sometimes better. This is the whole point of The Clean Switch — we only recommend products that actually perform. We\'re not here to make you sacrifice clean dishes for a clean conscience.',
  },
]

export default function WhyClean() {
  return (
    <main style={{ background: C.bg }}>

      {/* Hero */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: '80px 24px 72px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.olivePale, marginBottom: 16 }}>
            Why it matters
          </p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 52, fontWeight: 700, color: C.text, lineHeight: 1.1, margin: '0 0 24px' }}>
            What&apos;s actually in your home — and why it matters.
          </h1>
          <p style={{ fontSize: 17, color: C.stone, lineHeight: 1.75, margin: 0, maxWidth: 600 }}>
            Most people assume that if a product is on a shelf at Target, it&apos;s been tested and proven safe.
            In the US, that&apos;s largely not true. Here&apos;s what the research actually shows.
          </p>
        </div>
      </div>

      {/* Intro pull quote */}
      <div style={{ background: C.olive, padding: '56px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <blockquote style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 400, color: '#fff', lineHeight: 1.5, margin: 0, borderLeft: '3px solid rgba(255,255,255,0.3)', paddingLeft: 28 }}>
            &ldquo;The average American uses 10+ personal care products per day, exposing themselves to over 100 unique chemicals before leaving the house.&rdquo;
          </blockquote>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 16, paddingLeft: 28 }}>
            Environmental Working Group
          </p>
        </div>
      </div>

      {/* Concerns grid */}
      <div style={{ padding: '72px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.olivePale, marginBottom: 10 }}>
              The ingredients to know
            </p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 700, color: C.text, margin: 0 }}>
              Six things we look out for
            </h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
          }}>
            {concerns.map((item) => (
              <div key={item.title} style={{
                background: C.white, borderRadius: 16,
                border: `1px solid ${C.border}`, padding: '28px 24px',
              }}>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 19, fontWeight: 700, color: C.text, margin: '0 0 12px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 14, color: C.stone, lineHeight: 1.7, margin: '0 0 16px' }}>
                  {item.body}
                </p>
                <div style={{ background: C.sagePale, borderRadius: 8, padding: '10px 14px' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.oliveMid }}>Found in: </span>
                  <span style={{ fontSize: 12, color: C.stone }}>{item.found}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ background: C.white, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '72px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.olivePale, marginBottom: 10 }}>
              Common questions
            </p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 700, color: C.text, margin: 0 }}>
              Fair questions, honest answers
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {faqs.map((item) => (
              <div key={item.q} style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 28 }}>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 19, fontWeight: 700, color: C.text, margin: '0 0 10px' }}>
                  {item.q}
                </h3>
                <p style={{ fontSize: 15, color: C.stone, lineHeight: 1.75, margin: 0 }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '72px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 34, fontWeight: 700, color: C.text, margin: '0 0 16px' }}>
            Ready to make the switch?
          </h2>
          <p style={{ fontSize: 15, color: C.stone, lineHeight: 1.7, marginBottom: 28 }}>
            Browse our curated swaps — every product has been vetted so you don&apos;t have to do the research yourself.
          </p>
          <a href="/" style={{
            background: C.olive, color: '#fff',
            padding: '15px 32px', borderRadius: 99,
            fontSize: 15, fontWeight: 600, textDecoration: 'none',
            display: 'inline-block',
          }}>
            Browse Swaps
          </a>
        </div>
      </div>

    </main>
  )
}
