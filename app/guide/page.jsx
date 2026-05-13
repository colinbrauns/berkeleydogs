import GuideExplorer from './GuideExplorer';
import { guideCategories, guideListings } from '../../data/guideListings';

export const metadata = {
  title: 'Berkeley Dog Guide | Berkeley Dogs',
  description: 'Search dog-friendly parks, vets, groomers, trainers, pet stores, emergency care, and community-recommended resources around Berkeley.'
};

export default function GuidePage() {
  return (
    <main>
      <section className="guide-hero">
        <div className="container">
          <span className="badge">Community utility</span>
          <h1>Berkeley Dog Guide</h1>
          <p>
            Search local dog parks, vets, groomers, trainers, pet stores, emergency care, and dog-friendly places.
            This is a community-maintained starter guide, so please verify details and suggest updates.
          </p>
          <div className="guide-hero-actions">
            <a href="mailto:BerkeleyDogAdvocates@gmail.com?subject=Berkeley%20Dog%20Guide%20listing" className="btn btn-primary">
              Suggest a listing
            </a>
            <a href="https://forum.berkeleydogs.com" className="btn btn-ghost">
              Discuss in the forum
            </a>
          </div>
        </div>
      </section>

      <section className="section guide-section">
        <div className="container">
          <GuideExplorer categories={guideCategories} listings={guideListings} />
        </div>
      </section>
    </main>
  );
}
