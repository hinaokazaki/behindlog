import { ColorThemeType } from "@prisma/client";

export const colorThemeVariables = {
  [ColorThemeType.ORIGINAL]: {
    "--color-background": "#FFF6E3",
    "--color-foreground": "#887A6D",
    "--color-primary": "#55CEBA",
    "--color-primary-hover": "#3EBDA9",
    "--color-secondary": "#FF917D",
    "--color-secondary-hover": "#FF7C6F",
  },

  [ColorThemeType.COOL]: {
    "--color-background": "#EAF5FF",
    "--color-foreground": "#5F7EA3",
    "--color-primary": "#4F8FEA",
    "--color-primary-hover": "#3B78D1",
    "--color-secondary": "#B6C5FF",
    "--color-secondary-hover": "#9DAFFF",
  },

  [ColorThemeType.WARM]: {
    "--color-background": "#FFEDEA",
    "--color-foreground": "#9A5A50",
    "--color-primary": "#E86F61",
    "--color-primary-hover": "#D85D50",
    "--color-secondary": "#FFB5A8",
    "--color-secondary-hover": "#FFA092",
  },

  [ColorThemeType.NATURE]: {
    "--color-background": "#E8FFF7",
    "--color-foreground": "#4E8C7C",
    "--color-primary": "#2AB89D",
    "--color-primary-hover": "#209E86",
    "--color-secondary": "#AEEBDD",
    "--color-secondary-hover": "#91E0CE",
  },

  [ColorThemeType.SUNSHINE]: {
    "--color-background": "#FFF7D8",
    "--color-foreground": "#A17C1A",
    "--color-primary": "#E3B11D",
    "--color-primary-hover": "#C99C18",
    "--color-secondary": "#FFE17A",
    "--color-secondary-hover": "#FFD95A",
  },
} as const;
