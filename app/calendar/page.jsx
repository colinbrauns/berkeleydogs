export const metadata = {
  title: 'Events Calendar | Berkeley Dogs',
  description: 'Stay updated on Berkeley city council meetings and local dog events. Join us in advocating for dog-friendly spaces.'
};

export default function CalendarPage() {
  return (
    <main>
      <section className="section">
        <div className="container">
          <h2>Events Calendar</h2>
          <p className="text-center" style={{marginBottom: '32px', color: 'var(--muted)'}}>
            Stay informed about city council meetings, dog park discussions, and local dog-friendly events. Your participation makes a difference!
          </p>
          
          <div className="calendar-container">
            <div className="calendar-embed">
              <iframe
                src="https://calendar.google.com/calendar/embed?src=berkeleydogs%40gmail.com&ctz=America%2FLos_Angeles"
                style={{ border: 0 }}
                width="100%"
                height="600"
                frameBorder="0"
                scrolling="no"
                title="Berkeley Dogs Events Calendar"
              />
            </div>
          </div>

          <div className="calendar-info">
            <div className="info-grid">
              <div className="info-card">
                <h3>🏛️ City Council Meetings</h3>
                <p>Join us at Berkeley City Council meetings when dog-related issues are discussed. Your voice matters in shaping local policy.</p>
                <ul>
                  <li>Meetings typically held Tuesdays at 6:00 PM</li>
                  <li>Public comment periods available</li>
                  <li>Agenda published 72 hours before meetings</li>
                </ul>
              </div>
              
              <div className="info-card">
                <h3>🐕 Dog Community Events</h3>
                <p>Connect with fellow dog owners at local meetups, adoption events, and dog-friendly community gatherings.</p>
                <ul>
                  <li>Monthly dog park meetups</li>
                  <li>Adoption and rescue events</li>
                  <li>Dog training workshops</li>
                  <li>Community clean-up days</li>
                </ul>
              </div>
              
              <div className="info-card">
                <h3>📅 Advocacy Opportunities</h3>
                <p>Get involved in advocacy efforts and learn how you can help make Berkeley more dog-friendly.</p>
                <ul>
                  <li>Petition signature drives</li>
                  <li>Public hearings and meetings</li>
                  <li>Volunteer opportunities</li>
                  <li>Letter writing campaigns</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="calendar-actions">
            <h3>Want to Add an Event?</h3>
            <p>Know of a dog-related event or city council meeting we should include? Let us know!</p>
            <div className="action-buttons">
              <a href="mailto:BerkeleyDogAdvocates@gmail.com?subject=Calendar%20Event%20Submission" className="btn btn-primary">
                📧 Submit Event
              </a>
              <a href="https://calendar.google.com/calendar/embed?src=berkeleydogs%40gmail.com&ctz=America%2FLos_Angeles" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                📅 Open in Google Calendar
              </a>
            </div>
          </div>

          <div className="calendar-notice">
            <p className="small">
              <strong>Note:</strong> This calendar is maintained by community volunteers. Event details may change, so please verify information directly with event organizers. 
              For official city meetings, check the <a href="https://berkeleyca.gov/your-government/city-council" target="_blank" rel="noopener noreferrer" style={{color: 'var(--california-gold)'}}>Berkeley City Council website</a>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
