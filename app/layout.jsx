import './globals.css';
import Image from 'next/image';

export const metadata = {
  title: 'Berkeley Dogs',
  description: 'A community hub for Berkeley dog owners and advocates.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body>
        <header className="header">
          <a href="/" className="brand" aria-label="Berkeley Dogs home">
            <Image 
              src="/berkdogslogo_curry.png" 
              alt="Berkeley Dogs" 
              width={48}
              height={48}
              priority={true}
              className="brand-logo"
              style={{ height: '48px', width: 'auto' }}
            />
            <span>Berkeley Dogs</span>
          </a>
          <nav className="nav" aria-label="Primary">
            <a href="/guide" className="nav-link">Guide</a>
            <a href="/calendar" className="nav-link">Calendar</a>
            <a href="/downloads" className="nav-link">Downloads</a>
            <a href="https://forum.berkeleydogs.com" className="btn btn-primary">Forum</a>
          </nav>
        </header>
        {children}
        <footer className="footer">
          <div className="container">
            <div className="footer-nav">
              <a href="/guide" className="footer-link">Berkeley Dog Guide</a>
              <a href="/calendar" className="footer-link">Events Calendar</a>
              <a href="/downloads" className="footer-link">Downloads</a>
              <a href="https://forum.berkeleydogs.com" className="footer-link">Community Forum</a>
            </div>
            <p>© {new Date().getFullYear()} Berkeley Dogs. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
