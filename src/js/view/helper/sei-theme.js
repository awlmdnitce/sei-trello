const parseRGB = (colorStr) => {
  const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return null;
  return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]) };
};

const mixWithWhite = (rgb, factor) => {
  const r = Math.round(rgb.r + (255 - rgb.r) * factor);
  const g = Math.round(rgb.g + (255 - rgb.g) * factor);
  const b = Math.round(rgb.b + (255 - rgb.b) * factor);
  return `rgb(${r}, ${g}, ${b})`;
};

/* Luminance — tells us if the theme color is dark or light */
const relativeLuminance = ({ r, g, b }) => {
  const toLinear = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
};

export const injectSEITheme = () => {
  /* SEI uses .infraCorBarraSistema on the top navigation bar */
  const themeEl =
    document.querySelector('.infraCorBarraSistema') ||
    document.querySelector('#divInfraBarraSuperior') ||
    document.querySelector('#divInfraBarraNavegacao');

  if (!themeEl) return;

  const computed = window.getComputedStyle(themeEl);
  const bgColor = computed.backgroundColor;
  const rgb = parseRGB(bgColor);

  if (!rgb) return;

  const lum = relativeLuminance(rgb);
  const textOnTheme = lum > 0.179 ? '#212121' : '#ffffff';

  /* Tints for card surfaces */
  const cardBg = mixWithWhite(rgb, 0.93);   /* very light tint */
  const cardBorder = mixWithWhite(rgb, 0.6); /* medium tint */

  const root = document.documentElement;
  root.style.setProperty('--sei-theme', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
  root.style.setProperty('--sei-theme-text', textOnTheme);
  root.style.setProperty('--sei-card-bg', cardBg);
  root.style.setProperty('--sei-card-border', cardBorder);
};
