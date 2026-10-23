import type { ElementType } from 'react';
import { docsComponents } from '@hast/docs';

export function useMDXComponents(components: Record<string, ElementType>) {
  return { ...docsComponents, ...components };
}
