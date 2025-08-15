import './globals.css';

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
            <img src="/berkdogslogo_curry.png" alt="Berkeley Dogs" className="brand-logo" />
          </div>
          <nav className="nav">
            <a href="https://forum.berkeleydogs.com" className="btn btn-primary">Join the forum</a>
          </nav>
        </header>
        {children}
        <footer className="footer">© {new Date().getFullYear()} Berkeley Dogs. All rights reserved.</footer>
      </body>
    </html>
  );
}
