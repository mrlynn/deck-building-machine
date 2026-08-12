'use client';

import Image from 'next/image';

export function publicAssetUrl(path: string): string {
  return path
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

type CursorLogoProps = {
  /** Surface behind the logo: light rail → dark mark; dark surface → white mark */
  variant?: 'on-light' | 'on-dark';
  /** lockup = official mark + wordmark; cube = compact icon only */
  mode?: 'lockup' | 'cube';
  height?: number;
  className?: string;
};

/** Official lockup viewBox 2238.7 × 533.32 */
const LOCKUP_ASPECT = 2238.7 / 533.32;

/**
 * Official Cursor marks from /public.
 * - lockup: cursor-lockup-dark-on-light.svg (on-light only today)
 * - cube: cursor-logo-dark.png / cursor-logo-white.png
 */
export function CursorLogo({
  variant = 'on-light',
  mode = 'cube',
  height = 28,
  className,
}: CursorLogoProps) {
  // Official wordmark lockup — only dark-on-light asset shipped; use cube on dark
  if (mode === 'lockup' && variant === 'on-light') {
    const width = Math.round(height * LOCKUP_ASPECT);
    return (
      // SVG via <img>: next/image does not serve local SVG without special config
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={publicAssetUrl('/cursor-lockup-dark-on-light.svg')}
        alt="Cursor"
        width={width}
        height={height}
        className={className}
        style={{ display: 'block', objectFit: 'contain', height, width: 'auto' }}
      />
    );
  }

  const src =
    variant === 'on-dark'
      ? publicAssetUrl('/cursor-logo-white.png')
      : publicAssetUrl('/cursor-logo-dark.png');

  return (
    <Image
      src={src}
      alt="Cursor"
      width={height}
      height={height}
      className={className}
      priority
      style={{ display: 'block', objectFit: 'contain' }}
    />
  );
}

/** @deprecated Prefer CursorLogo — kept so existing imports keep working */
export function CursorMark({ size = 28 }: { size?: number }) {
  return <CursorLogo variant="on-light" mode="cube" height={size} />;
}
