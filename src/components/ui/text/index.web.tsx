import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import React from 'react';
import { textStyle } from './styles';

type ITextProps = React.ComponentProps<'span'> & VariantProps<typeof textStyle>;

const Text = React.forwardRef<React.ComponentRef<'span'>, ITextProps>(
  function Text(
    {
      className,
      isTruncated,
      bold,
      underline,
      strikeThrough,
      size = 'md',
      sub,
      italic,
      highlight,
      ...props
    }: { className?: string } & ITextProps,
    ref
  ) {
    // Props React Native uniquement : on les retire pour ne pas les propager
    // au <span> DOM (évite les warnings "React does not recognize ...").
    const {
      numberOfLines: _numberOfLines,
      ellipsizeMode: _ellipsizeMode,
      ...domProps
    } = props as Record<string, unknown>;
    return (
      <span
        className={textStyle({
          isTruncated: isTruncated as boolean,
          bold: bold as boolean,
          underline: underline as boolean,
          strikeThrough: strikeThrough as boolean,
          size,
          sub: sub as boolean,
          italic: italic as boolean,
          highlight: highlight as boolean,
          class: className,
        })}
        {...domProps}
        ref={ref}
      />
    );
  }
);

Text.displayName = 'Text';

export { Text };

