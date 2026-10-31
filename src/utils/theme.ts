// Helper to convert HEX to RGB and generate complete dynamic accent palette

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (clean.length > 6) {
    clean = clean.slice(0, 6);
  }
  const num = parseInt(clean || '5d3ee8', 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function getDynamicThemeVariables(
  accentHex: string,
  isDark: boolean
): Record<string, string> {
  const { r, g, b } = hexToRgb(accentHex);
  const rgb = `${r}, ${g}, ${b}`;

  if (isDark) {
    // Night theme dynamically atmospheric to the accent color
    const textR = Math.min(255, Math.floor(r * 0.4 + 180));
    const textG = Math.min(255, Math.floor(g * 0.4 + 180));
    const textB = Math.min(255, Math.floor(b * 0.4 + 180));
    const accentText = `rgb(${textR}, ${textG}, ${textB})`;

    return {
      '--glance-accent': accentHex,
      '--glance-accent-rgb': rgb,
      '--glance-accent-glow': `rgba(${rgb}, 0.38)`,
      '--glance-accent-light': `rgba(${rgb}, 0.18)`,
      '--glance-accent-subtle': `rgba(${rgb}, 0.14)`,
      '--glance-accent-subtle-hover': `rgba(${rgb}, 0.24)`,
      '--glance-accent-border': `rgba(${rgb}, 0.38)`,
      '--glance-accent-border-subtle': `rgba(${rgb}, 0.22)`,
      '--glance-accent-text': accentText,
      // Dynamic night atmosphere: glowing top halo in accent color, fading into deep obsidian
      '--glance-bg-atmosphere': `radial-gradient(ellipse 95% 55% at 50% -15%, rgba(${rgb}, 0.32) 0%, rgba(13, 11, 22, 0.97) 65%)`,
      '--glance-card-bg': `rgba(22, 19, 34, 0.88)`,
      '--glance-card-border': `rgba(${rgb}, 0.24)`,
      '--glance-card-hover-border': `rgba(${rgb}, 0.65)`,
      '--glance-text-main': '#f4f2ff',
      '--glance-text-muted': '#9691b8',
    };
  } else {
    // Light theme: clean frosted milk with gentle ambient halo in accent color
    return {
      '--glance-accent': accentHex,
      '--glance-accent-rgb': rgb,
      '--glance-accent-glow': `rgba(${rgb}, 0.22)`,
      '--glance-accent-light': `rgba(${rgb}, 0.12)`,
      '--glance-accent-subtle': `rgba(${rgb}, 0.08)`,
      '--glance-accent-subtle-hover': `rgba(${rgb}, 0.16)`,
      '--glance-accent-border': `rgba(${rgb}, 0.3)`,
      '--glance-accent-border-subtle': `rgba(${rgb}, 0.16)`,
      '--glance-accent-text': accentHex,
      // Light atmosphere: soft ambient tint from top
      '--glance-bg-atmosphere': `radial-gradient(ellipse 95% 55% at 50% -15%, rgba(${rgb}, 0.14) 0%, rgba(253, 252, 255, 0.96) 65%)`,
      '--glance-card-bg': `rgba(255, 255, 255, 0.94)`,
      '--glance-card-border': `rgba(${rgb}, 0.2)`,
      '--glance-card-hover-border': `rgba(${rgb}, 0.55)`,
      '--glance-text-main': '#16122d',
      '--glance-text-muted': '#6b668d',
    };
  }
}
