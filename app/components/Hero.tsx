'use client'

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

const steps = [
  {
    number: '01',
    title: 'Browse vetted swaps',
    desc: 'Every product in our database has been researched for toxic ingredients, certifications, and clean alternatives.',
  },
  {
    number: '02',
    title: 'Scan what you own',
    desc: 'Point your camera at any barcode and get an instant ingredient breakdown — safe, caution, or avoid.',
  },
  {
    number: '03',
    title: 'Make the switch',
    desc: 'Shop our curated picks with confidence. No greenwashing, no guesswork.',
  },
]

const stats = [
  { value: '12+', label: 'Vetted products' },
  { value: '6', label: 'Home categories' },
  { value: '0', label: 'Greenwashing' },
]

export default function Hero() {
  return (
    <div>
      {/* Main hero */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: '100px 24px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.olivePale, marginBottom: 20 }}>
            Researched · Vetted · Clean
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 80, flexWrap: 'wrap' }}>
            <div style={{ flex: '0 0 auto', maxWidth: 480 }}>
              <h1 style={{
                fontFamily: 'Georgia, serif', fontSize: 60, fontWeight: 700,
                color: C.text, lineHeight: 1.05, margin: '0 0 28px',
              }}>
                Your home,<br />without the<br />toxins.
              </h1>
              <p style={{ fontSize: 17, color: C.stone, lineHeight: 1.7, marginBottom: 36, maxWidth: 400 }}>
                The Clean Switch makes it easy to replace harmful everyday products with honest, researched alternatives — for every room in your home.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a
                  href="#swaps"
                  style={{
                    background: C.olive, color: '#fff',
                    padding: '14px 28px', borderRadius: 99,
                    fontSize: 15, fontWeight: 600, textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Browse Swaps
                </a>
                <a
                  href="/scan"
                  style={{
                    background: C.sagePale, color: C.olive,
                    padding: '14px 28px', borderRadius: 99,
                    fontSize: 15, fontWeight: 600, textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Scan a Product
                </a>
              </div>
            </div>

            {/* Stats */}
            <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center', paddingTop: 8 }}>
              {stats.map((s) => (
                <div key={s.label} style={{
                  background: C.bg, borderRadius: 14, padding: '20px 24px',
                  display: 'flex', alignItems: 'center', gap: 20,
                  border: `1px solid ${C.border}`,
                }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 700, color: C.olive, minWidth: 64 }}>
                    {s.value}
                  </span>
                  <span style={{ fontSize: 14, color: C.stone, fontWeight: 500 }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ background: C.bg, padding: '72px 24px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.olivePale, marginBottom: 10 }}>
              How it works
            </p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 700, color: C.text, margin: 0 }}>
              Three steps to a cleaner home
            </h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 24,
          }}>
            {steps.map((step) => (
              <div key={step.number} style={{
                background: C.white, borderRadius: 16,
                border: `1px solid ${C.border}`, padding: '32px 28px',
              }}>
                <div style={{
                  fontFamily: 'Georgia, serif', fontSize: 13, fontWeight: 700,
                  color: C.olivePale, letterSpacing: '0.08em', marginBottom: 14,
                }}>
                  {step.number}
                </div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, color: C.text, margin: '0 0 10px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 14, color: C.stone, lineHeight: 1.65, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Anchor for scroll */}
      <div id="swaps" />
    </div>
  )
}
