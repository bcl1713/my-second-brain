import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>My Second Brain</title>
      </head>
      <body>
        <nav>
          <h1>My Second Brain</h1>
          {/* Add navigation links here */}
        </nav>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
