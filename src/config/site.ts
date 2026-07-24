// Base and site are provided by Astro at build time from astro.config (which reads process.env for conditional GH Pages subpath).
export const base = import.meta.env.BASE_URL || '/';

export function withBase(path: string): string {
  if (!path) return base;
  // Leave fully-qualified and special-scheme URLs untouched
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//') || path.startsWith('mailto:') || path.startsWith('tel:')) {
    return path;
  }
  const b = base.endsWith('/') ? base : base + '/';
  if (path === '/' || path === '') {
    return b;  // e.g. /defy/ or /
  }
  const p = path.startsWith('/') ? path.slice(1) : path;
  return (b + p).replace(/\/$/, '');
}

export const site = {
  name: 'DEFY PRS',
  tagline: 'Plastic, Reconstructive & Aesthetic Surgery Practice',
  url: import.meta.env.SITE || 'https://www.defyprs.com',
  phone: '(619) 222-3339',
  phoneTel: '+16192223339',
  email: 'info@defyprs.com',
  fax: '(619) 223-3339',
  address: '1322 Scott Street Suite 102 San Diego, CA 92106',
  hours: 'Monday — Friday | 9am — 5pm',
  mapUrl: 'https://goo.gl/maps/un61iZX8xUG2',
} as const;

export const externalLinks = {
  patientPortal:
    'https://mycw56.eclinicalweb.com/portal6829/jsp/100mp/login.jsp',
  careCredit:
    'https://www.carecredit.com/apply/confirm.html?encm=XTwFPFQ2AWQAPFYyWm8OZlVnAGAEYVhrB2sCMlA_ATU&?gemid1=B3CALAdToolkitANCard',
  patientFi: 'https://app.patientfi.com/defyrprs',
} as const;

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
  external?: boolean;
};

export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us' },
  {
    label: 'Team',
    href: '/meet-john',
    children: [{ label: 'Meet John', href: '/meet-john' }],
  },
  {
    label: 'Expertise',
    href: '/aging',
    children: [
      { label: 'Aging', href: '/aging' },
      { label: 'Cancer', href: '/cancer' },
      { label: 'Gravity', href: '/gravity' },
    ],
  },
  { label: 'Services', href: '/services' },
  { label: 'Contact Us', href: '/contact-us' },
  {
    label: 'Patient Portal',
    href: externalLinks.patientPortal,
    external: true,
  },
];

export const footerGuideLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Meet John', href: '/meet-john' },
  { label: 'Aging', href: '/aging' },
  { label: 'Cancer', href: '/cancer' },
  { label: 'Contact Us', href: '/contact-us' },
  { label: 'Gravity', href: '/gravity' },
  { label: 'Patient Portal', href: externalLinks.patientPortal, external: true },
  { label: 'Services', href: '/services' },
  { label: 'CareCredit', href: externalLinks.careCredit, external: true },
  { label: 'PatientFi', href: externalLinks.patientFi, external: true },
] as const;