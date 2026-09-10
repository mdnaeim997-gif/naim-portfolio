import {
  Camera,
  Video,
  Wand2,
  ExternalLink,
} from 'lucide-react';

// Official brand-color social icons

export function BehanceIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect width="24" height="24" rx="4" fill="#1769FF" />
      <path d="M22 7h-7V5.5h7V7zm1.726 10c-.442 1.297-1.635 3-4.726 3-3.1 0-5.2-1.8-5.2-5.1 0-3.1 1.9-5.3 5-5.3 3.3 0 4.9 2.3 4.9 5.4v.7h-7.3c.1 1.3.7 2 2 2 1.1 0 1.6-.4 2-1.2l2.4.5zM9 5c2 0 3.5.7 4.2 1.8.7 1.1.8 2.4.8 3.7 0 1.5-.2 2.8-1.1 3.8-.9 1-2 1.4-3.5 1.4H2V5h7zm-.2 7c1.2 0 2.2-.5 2.2-2.4 0-1.9-1-2.3-2.3-2.3H4.5V12h4.3zM4.5 14.3V17h4.4c1.4 0 2.6-.4 2.6-2.4 0-1.9-1-2.3-2.4-2.3H4.5z" fill="#fff" />
    </svg>
  );
}

export function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect width="24" height="24" rx="4" fill="#1877F2" />
      <path d="M15.5 12h-2.5v8h-3v-8h-2v-3h2v-2c0-2 1.2-3.5 3.5-3.5h2.5v3h-1.5c-.8 0-1 .5-1 1V9h2.5l-.5 3z" fill="#fff" />
    </svg>
  );
}

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="url(#ig-grad)" />
      <defs>
        <radialGradient id="ig-grad" r="1.2" cx="0.3" cy="1.1">
          <stop offset="0%" stopColor="#FFDD55" />
          <stop offset="10%" stopColor="#FFDD55" />
          <stop offset="50%" stopColor="#FF543E" />
          <stop offset="100%" stopColor="#C837AB" />
        </radialGradient>
      </defs>
      <rect x="5" y="5" width="14" height="14" rx="4" fill="none" stroke="#fff" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3.2" fill="none" stroke="#fff" strokeWidth="1.5" />
      <circle cx="16.8" cy="7.2" r="1.1" fill="#fff" />
    </svg>
  );
}

export function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect width="24" height="24" rx="4" fill="#FF0000" />
      <path d="M10 8.5v7l6-3.5-6-3.5z" fill="#fff" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect width="24" height="24" rx="4" fill="#25D366" />
      <path d="M12 6a5.5 5.5 0 0 0-4.7 8.3L6.5 17l2.8-.7A5.5 5.5 0 1 0 12 6zm0 1a4.5 4.5 0 0 1 3.8 6.9l-.2.3.3 1.2-1.2-.3-.3.2A4.5 4.5 0 1 1 12 7zm-1.5 2c-.2 0-.5.1-.7.3-.2.2-.5.5-.5 1s.4 1.3.4 1.3c.3.5.8 1.2 1.5 1.8.7.6 1.2.8 1.5.9.3.1.5.1.7 0 .2-.1.5-.3.7-.5.2-.2.3-.4.3-.5 0-.2 0-.3-.1-.4l-.6-.3c-.2-.1-.4-.2-.5-.1-.1 0-.2.1-.3.2l-.2.2c-.1 0-.2 0-.4-.1-.3-.1-.6-.4-.9-.7-.2-.2-.4-.5-.4-.6 0-.1 0-.2.1-.3l.2-.2c.1-.1.1-.2.1-.3 0-.1-.1-.3-.2-.5l-.2-.4c-.1-.2-.2-.2-.3-.2h-.3z" fill="#fff" />
    </svg>
  );
}

export function FacebookPageIcon({ className }: { className?: string }) {
  return <FacebookIcon className={className} />;
}

// Social icon resolver
export function getSocialIcon(key: string): (props: { className?: string }) => JSX.Element {
  switch (key) {
    case 'behance': return BehanceIcon;
    case 'facebook': return FacebookIcon;
    case 'facebook-page': return FacebookPageIcon;
    case 'instagram': return InstagramIcon;
    case 'youtube': return YouTubeIcon;
    case 'whatsapp': return WhatsAppIcon;
    default: return WhatsAppIcon;
  }
}

// Adobe / app icons for orbit ring

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

export { Camera, Video, Wand2, ExternalLink };
