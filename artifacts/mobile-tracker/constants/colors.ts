/**
 * Design tokens derived from the Move Freight Fast web app (artifacts/move-freight-fast/src/index.css).
 * Dark navy theme with cyan accent — mirrors the web app's visual identity.
 *
 * HSL source values:
 *   background:        223 53%  7%  → #080e1b
 *   card:              223 50% 10%  → #0d1627
 *   primary/accent:    188 100% 42% → #00b8d4
 *   muted:             223 50% 15%  → #141e38
 *   mutedForeground:   215 20%  65% → #94a3b8
 *   border:            223 50% 15%  → #1a2742
 */

const colors = {
  light: {
    // Legacy aliases
    text: '#ffffff',
    tint: '#00b8d4',

    // Core surfaces
    background: '#080e1b',
    foreground: '#ffffff',

    // Cards / elevated surfaces
    card: '#0d1627',
    cardForeground: '#ffffff',
    cardElevated: '#111c33',

    // Primary action color — cyan
    primary: '#00b8d4',
    primaryForeground: '#ffffff',
    primaryDim: '#00a0bb',

    // Secondary surfaces
    secondary: '#141e38',
    secondaryForeground: '#ffffff',

    // Muted / subdued elements
    muted: '#141e38',
    mutedForeground: '#94a3b8',

    // Accent highlights
    accent: '#00b8d4',
    accentForeground: '#ffffff',

    // Status colours
    success: '#22c55e',
    warning: '#f59e0b',

    // Destructive actions
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',

    // Borders and input outlines
    border: '#1a2742',
    input: '#1a2742',
  },

  // Border radius in px — matches web app's --radius: 0.5rem (8px)
  radius: 8,
};

export type ColorTheme = typeof colors.light;
export default colors;
