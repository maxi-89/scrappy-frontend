import Link from 'next/link';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const NAV_LINKS = [
  { href: '/admin/offers', label: 'Offers' },
  { href: '/admin/pricing', label: 'Pricing' },
  { href: '/admin/scraping-jobs', label: 'Scraping Jobs' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-900">
      <aside className="w-64 shrink-0 border-r border-gray-700 bg-gray-900">
        <div className="p-6">
          <Link href="/admin" className="text-xl font-bold text-white">
            Scrappy Admin
          </Link>
        </div>
        <nav className="mt-2 px-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-md px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  );
}
