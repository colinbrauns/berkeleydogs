export const metadata = {
  title: 'Downloads | Berkeley Dogs',
  description: 'Download flyers, resources, and materials to help advocate for dog-friendly spaces in Berkeley.'
};

export default function DownloadsPage() {
  return (
    <main>
      <section className="section">
        <div className="container">
          <h2>Downloads & Resources</h2>
          <p className="text-center" style={{marginBottom: '32px', color: 'var(--muted)'}}>
            Help spread the word about making Berkeley more dog-friendly! Download and share these materials with your community.
          </p>
          
          <div className="downloads-grid">
            <div className="download-card">
              <div className="download-icon">📄</div>
              <h3>Berkeley Dogs Flyer</h3>
              <p className="small">High-resolution flyer promoting dog-friendly spaces in Berkeley. Perfect for printing and sharing.</p>
              <div className="download-options">
                <a href="/flyer.png" download className="btn btn-primary">
                  📱 Web Version (PNG)
                </a>
                <a href="/flyer.pdf" download className="btn btn-ghost">
                  🖨️ Print Version (PDF)
                </a>
              </div>
              <p className="download-note">Web version: 1200x1600px • Print version: 300 DPI</p>
            </div>

            <div className="download-card">
              <div className="download-icon">📋</div>
              <h3>Talking Points</h3>
              <p className="small">Key points to discuss when advocating for dog-friendly spaces with neighbors and city officials.</p>
              <div className="download-options">
                <a href="/talking-points.pdf" download className="btn btn-primary">
                  📄 Download PDF
                </a>
              </div>
              <p className="download-note">Coming soon • Contact us to contribute</p>
            </div>

            <div className="download-card">
              <div className="download-icon">📊</div>
              <h3>Proposed Solutions Brief</h3>
              <p className="small">Detailed proposals for creating more dog-friendly spaces throughout Berkeley neighborhoods.</p>
              <div className="download-options">
                <a href="/solutions-brief.pdf" download className="btn btn-primary">
                  📄 Download PDF
                </a>
              </div>
              <p className="download-note">Coming soon • Contact us to contribute</p>
            </div>
          </div>

          <div className="sharing-tips">
            <h3>How to Share</h3>
            <div className="tips-grid">
              <div className="tip-card">
                <h4>📱 Digital Sharing</h4>
                <ul>
                  <li>Share in neighborhood Facebook groups</li>
                  <li>Post in Nextdoor communities</li>
                  <li>Send to dog owner group chats</li>
                  <li>Email to friends and neighbors</li>
                </ul>
              </div>
              <div className="tip-card">
                <h4>🏘️ Physical Distribution</h4>
                <ul>
                  <li>Print and post in coffee shops</li>
                  <li>Leave at community centers</li>
                  <li>Distribute at dog parks</li>
                  <li>Share at neighborhood events</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="contact-section">
            <h3>Need Help or Want to Contribute?</h3>
            <p>Contact us if you need materials in different formats, want to contribute content, or have ideas for new resources.</p>
            <a href="mailto:BerkeleyDogAdvocates@gmail.com" className="btn btn-primary btn-large">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
