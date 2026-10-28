import { Img } from '../ui/Img';
import type { ComponentProps } from 'react';

/** Imagem com parallax vertical controlado pelo scroll (intensidade em %). */
export function ParallaxImage({ amount = 8, ...rest }: Omit<ComponentProps<typeof Img>, 'parallax'> & { amount?: number }) {
  return <Img {...rest} parallax={amount} />;
}
