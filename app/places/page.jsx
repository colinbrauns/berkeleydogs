export const metadata = {
  title: 'Dog-friendly places map | Berkeley Dogs',
  description: 'Explore dog-friendly places around Berkeley on our shared map.'
};

export default function PlacesPage() {
  const embedUrl = 'https://www.google.com/maps?q=dog+friendly+berkeley&output=embed';
  return (
    <main>
      <section className="section">
        <div className="container">
          <h2>Dog-friendly places map</h2>
          <p className="small" style={{marginTop: '-8px'}}>Find and share parks, cafes, and areas that welcome dogs. Share this page link with friends.</p>
          <div className="map-embed" style={{marginTop: '16px'}}>
            <iframe
              src={embedUrl}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Dog-friendly places in Berkeley"
            />
          </div>
        </div>
      </section>
    </main>
  );
}




