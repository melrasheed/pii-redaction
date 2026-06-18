import { BrandVariants, createLightTheme, createDarkTheme, Theme } from '@fluentui/react-components';

/**
 * Microsoft Communication Blue ramp — the brand colour the demo uses to feel
 * "real Microsoft" rather than generic Material/Bootstrap. Generated from
 * the official #0078D4 hex via the Fluent UI theme designer.
 */
const msBlue: BrandVariants = {
  10: '#020305',
  20: '#111723',
  30: '#16263D',
  40: '#193353',
  50: '#1B406B',
  60: '#1B4E83',
  70: '#1A5C9D',
  80: '#176BB7',
  90: '#0F7AD2',
  100: '#0089EA',
  110: '#3E96EE',
  120: '#5BA4F1',
  130: '#75B2F4',
  140: '#8DC0F6',
  150: '#A4CEF8',
  160: '#BBDCFB',
};

export const lightTheme: Theme = createLightTheme(msBlue);
export const darkTheme: Theme = createDarkTheme(msBlue);
