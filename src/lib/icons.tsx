import {
  Facebook,
  MessageCircle,
  Camera,
  Video,
  Wand2,
  ExternalLink,
} from 'lucide-react';

export function BehanceIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-1.635 3-4.726 3-3.1 0-5.2-1.8-5.2-5.1 0-3.1 1.9-5.3 5-5.3 3.3 0 4.9 2.3 4.9 5.4v.7h-7.3c.1 1.3.7 2 2 2 1.1 0 1.6-.4 2-1.2l2.4.5zM9 5c2 0 3.5.7 4.2 1.8.7 1.1.8 2.4.8 3.7 0 1.5-.2 2.8-1.1 3.8-.9 1-2 1.4-3.5 1.4H2V5h7zm-.2 7c1.2 0 2.2-.5 2.2-2.4 0-1.9-1-2.3-2.3-2.3H4.5V12h4.3zM4.5 14.3V17h4.4c1.4 0 2.6-.4 2.6-2.4 0-1.9-1-2.3-2.4-2.3H4.5z" />
    </svg>
  );
}

export { Facebook, MessageCircle, Camera, Video, Wand2, ExternalLink };

export function PremiereProIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#2A0E58" />
      <text x="12" y="16" textAnchor="middle" fill="#E89AFF" fontSize="8" fontWeight="700" fontFamily="Arial">Pr</text>
    </svg>
  );
}

export function PhotoshopIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#001A33" />
      <text x="12" y="16" textAnchor="middle" fill="#31C5F0" fontSize="8" fontWeight="700" fontFamily="Arial">Ps</text>
    </svg>
  );
}

export function IllustratorIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#330000" />
      <text x="12" y="16" textAnchor="middle" fill="#FF9A00" fontSize="8" fontWeight="700" fontFamily="Arial">Ai</text>
    </svg>
  );
}

export function AfterEffectsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#1A0A2E" />
      <text x="12" y="16" textAnchor="middle" fill="#D29AFF" fontSize="8" fontWeight="700" fontFamily="Arial">Ae</text>
    </svg>
  );
}

export function MetaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#0668E1" />
      <path d="M6 15c1.5-4 3-6 5.5-6 2 0 3 1.5 4.5 4 1 1.7 1.5 2 2.5 2 1.2 0 2-1 3-3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
      <path d="M6 9c1.5 4 3 6 5.5 6 2 0 3-1.5 4.5-4 1-1.7 1.5-2 2.5-2 1.2 0 2 1 3 3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.7"/>
    </svg>
  );
}
