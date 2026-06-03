import { ColorThemeType } from "@prisma/client";

export const colorThemeVariables = {
  [ColorThemeType.ORIGINAL]: {
    "--color-background": "#FFF6E3",
    "--color-foreground": "#887A6D",
    "--color-primary": "#55CEBA",
    "--color-primary-hover": "#3EBDA9",
    "--color-secondary": "#FF917D",
    "--color-secondary-hover": "#FF7C6F",
    "--color-button-main": "#FF917D",
    "--color-button-main-hover": "#FF7C6F",
    "--color-chart-base": "#ffdd93",
  },

  [ColorThemeType.COOL]: {
    "--color-background": "#EAF5FF",
    "--color-foreground": "#5F7EA3",
    "--color-primary": "#4F8FEA",
    "--color-primary-hover": "#3B78D1",
    "--color-secondary": "#B6C5FF",
    "--color-secondary-hover": "#BBD4FE",
    "--color-button-main": "#4F8FEA",
    "--color-button-main-hover": "#3B78D1",
    "--color-chart-base": "#B6C5FF",
  },

  [ColorThemeType.WARM]: {
    "--color-background": "#FFEDEA",
    "--color-foreground": "#9A5A50",
    "--color-primary": "#E86F61",
    "--color-primary-hover": "#D85D50",
    "--color-secondary": "#FFB5A8",
    "--color-secondary-hover": "#FFA092",
    "--color-button-main": "#E86F61",
    "--color-button-main-hover": "#D85D50",
    "--color-chart-base": "#FFB5A8",
  },

  [ColorThemeType.NATURE]: {
    "--color-background": "#E8FFF7",
    "--color-foreground": "#4E8C7C",
    "--color-primary": "#2AB89D",
    "--color-primary-hover": "#209E86",
    "--color-secondary": "#AEEBDD",
    "--color-secondary-hover": "#91E0CE",
    "--color-button-main": "#2AB89D",
    "--color-button-main-hover": "#209E86",
    "--color-chart-base": "#AEEBDD",
  },

  [ColorThemeType.SUNSHINE]: {
    "--color-background": "#FFF7D8",
    "--color-foreground": "#A17C1A",
    "--color-primary": "#E3B11D",
    "--color-primary-hover": "#C99C18",
    "--color-secondary": "#FFE17A",
    "--color-secondary-hover": "#FFD95A",
    "--color-button-main": "#E3B11D",
    "--color-button-main-hover": "#C99C18",
    "--color-chart-base": "#FFE17A",
  },
} as const;
