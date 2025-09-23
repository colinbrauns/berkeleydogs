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
          <div className="brand">
            <Image 
              src="/berkdogslogo_curry.png" 
              alt="Berkeley Dogs" 
              width={48}
              height={48}
              priority={true}
              className="brand-logo"
              style={{ height: '48px', width: 'auto' }}
            />
          </div>
          <nav className="nav">
            <a href="https://forum.berkeleydogs.com" className="btn btn-primary">Join the forum</a>
          </nav>
        </header>
        {children}
        <footer className="footer">
          <div className="container">
            <div className="footer-nav">
              <a href="/calendar" className="footer-link">Events Calendar</a>
              <a href="/places" className="footer-link">Dog-friendly places map</a>
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
