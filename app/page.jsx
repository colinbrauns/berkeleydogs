export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="container">
          <h1>Building a stronger community for Berkeley dogs and their people.</h1>
          <p>Join fellow dog owners in advocating for our four-legged friends. Together, we can make Berkeley a better place for dogs through community collaboration and collective action.</p>
          <div style={{display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap', marginBottom:'-24px'}}>
            <a href="https://forum.berkeleydogs.com" className="btn btn-primary btn-large">Join our community forum</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid">
          <div className="card">
            <h3>Community advocacy</h3>
            <p className="small">When dog owners unite, we can advocate effectively for policies that benefit our pets and neighborhoods.</p>
          </div>
          <div className="card">
            <h3>Shared knowledge</h3>
            <p className="small">Learn from experienced dog owners, share resources, and stay informed about local dog-related issues.</p>
          </div>
          <div className="card">
            <h3>Collective action</h3>
            <p className="small">Our community decides together what causes to support and actions to take through forum discussions.</p>
          </div>
        </div>
      </section>

      <section className="section flyer-section">
        <div className="container">
          <h2>Share Our Flyer</h2>
          <p className="text-center">Help spread the word about making Berkeley more dog-friendly! Download and share our flyer with your community.</p>
          
          <div className="flyer-container">
            <div className="flyer-image">
              <img src="/flyer.png" alt="Berkeley Dogs Need You - Flyer promoting dog-friendly spaces in Berkeley" />
            </div>
            
            <div className="flyer-actions">
              <h3>How to Share:</h3>
              <div className="action-grid">
                <div className="action-card">
                  <h4>📱 Group Chats</h4>
                  <p>Share the flyer in your neighborhood groups, dog owner chats, and community forums to reach fellow Berkeley residents.</p>
                </div>
                <div className="action-card">
                  <h4>👥 Friends & Family</h4>
                  <p>Send the flyer to friends, family, and neighbors who care about making Berkeley more dog-friendly.</p>
                </div>
                <div className="action-card">
                  <h4>🏘️ Neighborhood</h4>
                  <p>Print the flyer and post it in local coffee shops, community centers, and neighborhood bulletin boards.</p>
                </div>
              </div>
              
              <div className="flyer-download">
                <a href="/flyer.png" download className="btn btn-primary btn-large">
                  📄 Download Flyer
                </a>
                <p className="note">Right-click and "Save As" to download the image</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>The Benefits of Dog Ownership</h2>
          <div className="grid">
            <div className="card">
              <h3>Physical Health</h3>
              <p className="small">Dog owners walk an average of 22 minutes more per day, leading to better cardiovascular health, lower blood pressure, and reduced risk of obesity.</p>
            </div>
            <div className="card">
              <h3>Mental Wellbeing</h3>
              <p className="small">Pets reduce stress, anxiety, and depression while increasing oxytocin and serotonin levels. They provide companionship and emotional support.</p>
            </div>
            <div className="card">
              <h3>Social Connection</h3>
              <p className="small">Dogs are natural conversation starters, helping owners meet neighbors, build community relationships, and reduce social isolation.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Why Neighborhood Dog Parks Matter</h2>
          <div className="grid">
            <div className="card">
              <h3>Safe Socialization</h3>
              <p className="small">Dedicated off-leash areas allow dogs to interact safely, reducing aggressive behaviors and helping them develop better social skills.</p>
            </div>
            <div className="card">
              <h3>Community Building</h3>
              <p className="small">Dog parks create natural gathering spaces where neighbors meet, form friendships, and strengthen community bonds across all demographics.</p>
            </div>
            <div className="card">
              <h3>Exercise & Health</h3>
              <p className="small">Dogs need vigorous exercise to stay healthy. Off-leash areas provide space for running, playing, and activities that leashed walks can't offer.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section volunteer-section">
        <div className="container">
          <h2>Interested in Volunteering?</h2>
          <p className="text-center">We're looking for copywriters, designers, community mods and software engineers to help build and maintain the site.</p>
          
          <div className="contact-info">
            <h3>Contact:</h3>
            <a href="mailto:BerkeleyDogAdvocates@gmail.com" className="contact-email">
              BerkeleyDogAdvocates@gmail.com
            </a>
          </div>
          
          <div className="donation-info">
            <h3>☕ Buy Me a Coffee</h3>
            <p>Want to help cover server expenses and flyer printing costs? Contact us to support our advocacy efforts.</p>
            <a href="mailto:BerkeleyDogAdvocates@gmail.com?subject=Donation%20Inquiry" className="btn btn-primary">
              Contact Us About Donations
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to make a difference?</h2>
            <p>Join our forum to connect with fellow Berkeley dog owners, discuss local issues, and coordinate community advocacy efforts. Together, we're stronger.</p>
            <a href="https://forum.berkeleydogs.com" className="btn btn-primary btn-large">Join the conversation</a>
          </div>
        </div>
      </section>
    </main>
  );
}
