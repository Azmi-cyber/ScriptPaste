import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ScriptPaste - Share Your Roblox Scripts',
  description: 'Upload, share, and deploy your Roblox scripts with ScriptPaste',
  keywords: ['Roblox', 'Script', 'Lua', 'Game Development', 'ScriptPaste'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <footer className="py-6 text-center text-gray-400 text-sm">
              <p>© 2024 ScriptPaste. Built for Roblox Developers.</p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
