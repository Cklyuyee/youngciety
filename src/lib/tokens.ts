/**
 * Youngciety — Design Tokens (JS)
 * Single source of truth — mirrors index.css @theme
 * Visual language inspired by The Knot
 */

export const colors = {
  // Brand
  brandPink:          '#FF44CB',   // Primary CTA — magenta
  brandBlack:         '#000000',   // Pure black — primary text
  brandCream:         '#FFF5ED',   // Warm cream — hero bg
  brandWhite:         '#FFFFFF',

  // Accents
  accentOceanBlue:    '#0073E6',   // Secondary CTA
  accentSoftMagenta:  '#FEBBF7',   // Focus ring / hover tint
  accentGold:         '#FBBB03',   // Warning
  accentOrange:       '#F47820',
  accentYellow:       '#F5B731',
  accentBlue:         '#A8CDEF',
  accentTaupe:        '#B5A89A',
  accentAmber:        '#F5A623',
  accentSky:          '#A1CDF5',
  accentPurple:       '#C47FD5',
  accentVividPink:    '#FF47A3',

  // Neutrals (The Knot scale)
  neutral900: '#000000',   // Pure black — heading & body
  neutral700: '#333333',   // Charcoal
  neutral600: '#51545C',   // Link gray / secondary text
  neutral300: '#CACCD0',   // Borders / dividers
  neutral200: '#E8E8E8',
  neutral100: '#F1F2F4',   // Off-white surface
  neutral50:  '#FAFAFA',

  // Semantic
  link:    '#51545C',
  error:   '#FF6F00',
  success: '#2E7D32',
  warning: '#FBBB03',
} as const

export const spacing = {
  1:  '4px',
  2:  '8px',
  3:  '12px',
  4:  '16px',
  5:  '20px',
  6:  '24px',
  7:  '28px',
  8:  '32px',
  9:  '36px',
  10: '40px',
  12: '48px',
  13: '52px',
} as const

export const radius = {
  xs:   '4px',
  sm:   '16px',
  md:   '18px',
  lg:   '25px',
  xl:   '50px',
  full: '9999px',
} as const

export const fontFamily = {
  display: "'Playfair Display', Georgia, 'Times New Roman', serif",
  script:  "'Caveat', cursive",
  sans:    "'Inter', system-ui, sans-serif",
} as const

export const shadows = {
  sm:    '0px 2px 8px rgba(0, 0, 0, 0.08)',
  md:    '0px 4px 16px rgba(0, 0, 0, 0.12)',
  lg:    '0px 8px 24px rgba(0, 0, 0, 0.15)',
  focus: '0px 0px 0px 2px #FEBBF7',
} as const

export type ColorKey = keyof typeof colors
export type SpacingKey = keyof typeof spacing
