import colors, { type ColorTheme } from '@/constants/colors';

/**
 * Returns the current color theme.
 * The app uses a fixed dark theme matching the web app — no light mode variant.
 */
export function useColors(): ColorTheme {
  return colors.light;
}
