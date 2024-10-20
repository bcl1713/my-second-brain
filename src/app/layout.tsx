import Sidebar from '@/components/Sidebar';
import './globals.css';
import DarkModeToggle from '@/components/DarkModeToggle';

export const metadata = {
  title: 'My Second Brain',
  description: 'A second brain app built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{metadata.title}</title>
      </head>
      <body className="flex h-screen">
        <Sidebar />
        {/* Main Content Area */}
        <div className="flex-1 p-6 bg-gray-100 dark:bg-gray-800 overflow-y-auto">
          <header className='flex justify-between mb-4'>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
              My Notes
            </h1>
            <DarkModeToggle />
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
