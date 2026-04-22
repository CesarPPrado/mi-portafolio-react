export function hexToHsl(hex) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin,
      h = 0, s = 0, l = 0;

  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return { h, s: +(s * 100).toFixed(1), l: +(l * 100).toFixed(1) };
}

export function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c / 2,
      r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

  r = Math.round((r + m) * 255).toString(16).padStart(2, '0');
  g = Math.round((g + m) * 255).toString(16).padStart(2, '0');
  b = Math.round((b + m) * 255).toString(16).padStart(2, '0');

  return `#${r}${g}${b}`.toUpperCase();
}

export function generatePalette(baseHex, mode, count) {
  const { h, s, l } = hexToHsl(baseHex);
  const palette = [];
  
  for (let i = 0; i < count; i++) {
    let newH = h, newS = s, newL = l;
    
    if (i === 0) {
      // We always keep the base color as the first color
      palette.push(baseHex.toUpperCase());
      continue;
    }

    if (mode === 'Degradado') {
      newL = (l + i * (100 / count)) % 100;
    } 
    else if (mode === 'Vibrante') {
      newH = (h + i * 40) % 360;
      newS = Math.max(s, 80);
      newL = 55;
    }
    else if (mode === 'Pastel') {
      newH = (h + i * 35) % 360;
      newS = 70;
      newL = 85;
    }
    else if (mode === 'Minimalista') {
      newH = h;
      newS = 15;
      newL = (l + i * (100 / count)) % 100;
    }
    else if (mode === 'Complementario') {
      newH = (h + (i % 2 === 1 ? 180 : 0)) % 360;
      newL = (l + Math.floor(i / 2) * (100 / (count / 2))) % 100;
    }

    palette.push(hslToHex(newH, newS, newL));
  }
  
  return palette;
}
