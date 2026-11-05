import { logoUrl } from '../../utils/brand';

/** The team's approved artwork, without cropping, recolouring or stretching. */
export function AppLogo({ className = '', size = 32 }: { className?: string; size?: number }) {
  return <img src={logoUrl} alt="KoraMAP" width={size} height={size}
    className={`shrink-0 rounded-xl bg-white object-contain ${className}`} />;
}
