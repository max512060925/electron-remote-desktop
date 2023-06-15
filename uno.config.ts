import {
  defineConfig,
  transformerVariantGroup,
  transformerDirectives,
} from 'unocss'
import color from './color.json'
export default defineConfig({
  theme: {
    colors: {
      ...color,
    },
  },
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
