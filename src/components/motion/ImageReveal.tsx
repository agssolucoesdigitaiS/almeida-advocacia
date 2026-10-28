import { Img } from '../ui/Img';
import type { ComponentProps } from 'react';

/** Imagem com máscara de entrada (clip-path) ao entrar na viewport. */
export function ImageReveal(props: Omit<ComponentProps<typeof Img>, 'reveal'> & { direction?: 'up' | 'side' }) {
  const { direction = 'up', ...rest } = props;
  return <Img {...rest} reveal={direction === 'side' ? 'clip-side' : 'clip'} />;
}
