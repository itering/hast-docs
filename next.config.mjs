import createMDX from '@next/mdx';
import { docsMdxOptions } from './src/mdx-options.mjs';
export default createMDX({ options: docsMdxOptions })({
  output: 'export', pageExtensions: ['js','jsx','ts','tsx','mdx'],
  images: { unoptimized: true }, devIndicators: false,
});
