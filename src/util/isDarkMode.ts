import { hexToRgb } from 'colors-convert';
import { useThemeVars } from 'naive-ui';
import { computed } from 'vue';

export default function isDarkMode() {
  return computed(() => {
    const baseColor = hexToRgb(useThemeVars().value.baseColor);
    return baseColor.r < 128;
  });
}