'use client';

import { useMemo, useState } from 'react';

const quickFilters = [
  { id: 'off-leash', label: 'Off-leash' },
  { id: 'emergency', label: 'Emergency' },
  { id: 'community', label: 'Community' },
  { id: 'verify', label: 'Needs verification' }
];

function normalize(value) {
  return value.toLowerCase().trim();
}

function listingMatchesQuickFilter(listing, filterId) {
  const haystack = normalize([
    listing.name,
    listing.categoryLabel,
    listing.neighborhood,
    listing.description,
    listing.status,
    ...listing.tags
  ].join(' '));

  if (filterId === 'off-leash') return haystack.includes('off-leash');
  if (filterId === 'emergency') return listing.category === 'emergency' || haystack.includes('emergency');
  if (filterId === 'community') return haystack.includes('community');
  if (filterId === 'verify') return haystack.includes('verify') || haystack.includes('verification');
  return true;
}

function directionsUrl(listing) {
  const query = encodeURIComponent(`${listing.name} ${listing.address}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function suggestUrl(listing) {
  const subject = encodeURIComponent(`Berkeley Dog Guide update: ${listing.name}`);
  const body = encodeURIComponent(`Suggested update for ${listing.name}:\n\n`);
  return `mailto:BerkeleyDogAdvocates@gmail.com?subject=${subject}&body=${body}`;
}

export default function GuideExplorer({ categories, listings }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [activeQuickFilters, setActiveQuickFilters] = useState([]);
  const [selectedId, setSelectedId] = useState(listings[0]?.id);

  const filteredListings = useMemo(() => {
    const normalizedQuery = normalize(query);

    return listings.filter((listing) => {
      const categoryMatch = category === 'all' || listing.category === category;
      const quickMatch = activeQuickFilters.every((filterId) => listingMatchesQuickFilter(listing, filterId));
      const searchText = normalize([
        listing.name,
        listing.categoryLabel,
        listing.neighborhood,
        listing.address,
        listing.description,
        listing.status,
        ...listing.tags
      ].join(' '));

      return categoryMatch && quickMatch && searchText.includes(normalizedQuery);
    });
  }, [activeQuickFilters, category, listings, query]);

  const selectedListing = filteredListings.find((listing) => listing.id === selectedId) || filteredListings[0] || listings[0];
  const mapQuery = selectedListing ? `${selectedListing.name} ${selectedListing.address}` : 'dog friendly Berkeley CA';
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;

  function toggleQuickFilter(filterId) {
    setActiveQuickFilters((current) => (
      current.includes(filterId)
        ? current.filter((id) => id !== filterId)
        : [...current, filterId]
    ));
  }

  function chooseCategory(nextCategory) {
    setCategory(nextCategory);
    setSelectedId(undefined);
  }

  function resetFilters() {
    setQuery('');
    setCategory('all');
    setActiveQuickFilters([]);
    setSelectedId(listings[0]?.id);
  }

  return (
    <div className="guide-shell">
      <div className="guide-toolbar" aria-label="Guide filters">
        <label className="guide-search">
          <span>Search the guide</span>
          <input
            type="search"
            value={query}
            placeholder="Search by name, service, neighborhood..."
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <div className="guide-filter-group" aria-label="Categories">
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`guide-chip ${category === item.id ? 'is-active' : ''}`}
              aria-pressed={category === item.id}
              onClick={() => chooseCategory(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="guide-filter-group guide-filter-group-secondary" aria-label="Quick filters">
          {quickFilters.map((item) => {
            const isActive = activeQuickFilters.includes(item.id);

            return (
              <button
                key={item.id}
                type="button"
                className={`guide-chip guide-chip-muted ${isActive ? 'is-active' : ''}`}
                aria-pressed={isActive}
                onClick={() => toggleQuickFilter(item.id)}
              >
                {item.label}
              </button>
            );
          })}
          <button type="button" className="guide-reset" onClick={resetFilters}>
            Reset
          </button>
        </div>
      </div>

      <div className="guide-results-meta">
        <strong>{filteredListings.length}</strong> places and providers found
      </div>

      <div className="guide-content">
        <section className="guide-list" aria-label="Guide results">
          {filteredListings.length > 0 ? (
            filteredListings.map((listing) => {
              const isSelected = selectedListing?.id === listing.id;

              return (
                <article
                  key={listing.id}
                  className={`guide-card ${isSelected ? 'is-selected' : ''}`}
                >
                  <button
                    type="button"
                    className="guide-card-main"
                    onClick={() => setSelectedId(listing.id)}
                    aria-pressed={isSelected}
                  >
                    <span className="guide-card-kicker">{listing.categoryLabel} · {listing.neighborhood}</span>
                    <span className="guide-card-title">{listing.name}</span>
                    <span className="guide-card-address">{listing.address}</span>
                    <span className="guide-card-description">{listing.description}</span>
                  </button>

                  <div className="guide-tags" aria-label={`${listing.name} tags`}>
                    {listing.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>

                  <div className="guide-card-actions">
                    {listing.phone ? <a href={`tel:${listing.phone.replace(/[^+\d]/g, '')}`}>Call</a> : null}
                    {listing.website ? <a href={listing.website} target="_blank" rel="noopener noreferrer">Website</a> : null}
                    <a href={directionsUrl(listing)} target="_blank" rel="noopener noreferrer">Directions</a>
                    <a href={suggestUrl(listing)}>Suggest update</a>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="guide-empty">
              <h3>No matches yet</h3>
              <p>Try clearing a filter, or send us a suggestion so the guide gets smarter over time.</p>
              <a href="mailto:BerkeleyDogAdvocates@gmail.com?subject=Berkeley%20Dog%20Guide%20suggestion" className="btn btn-primary">Suggest a listing</a>
            </div>
          )}
        </section>

        <aside className="guide-map-panel" aria-label="Map preview">
          {selectedListing ? (
            <div className="guide-selected">
              <span className="guide-card-kicker">Map focus</span>
              <h3>{selectedListing.name}</h3>
              <p>{selectedListing.address}</p>
              <p className="small">{selectedListing.status}</p>
              <a href={directionsUrl(selectedListing)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Open directions
              </a>
            </div>
          ) : null}

          <div className="guide-map">
            <span className="guide-map-label">Map preview</span>
            <iframe
              key={mapSrc}
              src={mapSrc}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title={selectedListing ? `Map for ${selectedListing.name}` : 'Berkeley Dog Guide map'}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
