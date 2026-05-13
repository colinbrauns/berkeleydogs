'use client';

import { useMemo, useRef, useState } from 'react';

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

function hasMapCoordinates(listing) {
  return Number.isFinite(listing.lat) && Number.isFinite(listing.lng);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getMapBounds(listings) {
  if (listings.length === 0) {
    return {
      minLat: 37.7,
      maxLat: 37.89,
      minLng: -122.32,
      maxLng: -122.13
    };
  }

  const lats = listings.map((listing) => listing.lat);
  const lngs = listings.map((listing) => listing.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latPadding = Math.max((maxLat - minLat) * 0.16, 0.012);
  const lngPadding = Math.max((maxLng - minLng) * 0.16, 0.012);

  return {
    minLat: minLat - latPadding,
    maxLat: maxLat + latPadding,
    minLng: minLng - lngPadding,
    maxLng: maxLng + lngPadding
  };
}

function getMapPosition(listing, bounds) {
  const x = ((listing.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
  const y = ((bounds.maxLat - listing.lat) / (bounds.maxLat - bounds.minLat)) * 100;

  return {
    x: `${clamp(x, 6, 94)}%`,
    y: `${clamp(y, 8, 92)}%`
  };
}

export default function GuideExplorer({ categories, listings }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [activeQuickFilters, setActiveQuickFilters] = useState([]);
  const [selectedId, setSelectedId] = useState(listings[0]?.id);
  const mapPanelRef = useRef(null);

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

  const selectedListing = filteredListings.find((listing) => listing.id === selectedId) || filteredListings[0] || null;
  const mappableListings = filteredListings.filter(hasMapCoordinates);
  const mapBounds = getMapBounds(mappableListings);

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

  function selectListing(listingId) {
    setSelectedId(listingId);

    if (window.matchMedia('(max-width: 900px)').matches) {
      window.requestAnimationFrame(() => {
        mapPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
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
                    onClick={() => selectListing(listing.id)}
                    aria-pressed={isSelected}
                    aria-controls="guide-map-frame"
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

        <aside ref={mapPanelRef} className="guide-map-panel" aria-label="Map preview" tabIndex="-1">
          <div
            className="guide-map"
            aria-label={selectedListing ? `Map focused on ${selectedListing.name}` : 'Map of Berkeley Dog Guide listings'}
          >
            <div className="guide-map-art" aria-hidden="true">
              <span className="guide-map-water" />
              <span className="guide-map-park guide-map-park-north" />
              <span className="guide-map-park guide-map-park-south" />
              <span className="guide-map-road guide-map-road-main" />
              <span className="guide-map-road guide-map-road-cross" />
            </div>
            <span className="guide-map-label">{selectedListing ? 'Now showing' : 'Map preview'}</span>
            <div className="guide-map-pins" id="guide-map-frame" aria-label="Guide map locations">
              {mappableListings.map((listing) => {
                const isSelected = selectedListing?.id === listing.id;
                const position = getMapPosition(listing, mapBounds);

                return (
                  <button
                    key={listing.id}
                    type="button"
                    className={`guide-map-pin ${isSelected ? 'is-selected' : ''}`}
                    style={{ '--pin-x': position.x, '--pin-y': position.y }}
                    onClick={() => selectListing(listing.id)}
                    aria-label={`Show ${listing.name} on the map`}
                    aria-pressed={isSelected}
                  >
                    <span className="guide-pin-label">{listing.name}</span>
                  </button>
                );
              })}
            </div>
            {mappableListings.length === 0 ? (
              <div className="guide-map-empty">No mappable results</div>
            ) : null}
            {selectedListing ? (
              <div className="guide-map-focus" aria-live="polite">
                <span className="guide-card-kicker">{selectedListing.categoryLabel} · {selectedListing.neighborhood}</span>
                <h3>{selectedListing.name}</h3>
                <p>{selectedListing.address}</p>
                <p className="small">{selectedListing.status}</p>
                <a href={directionsUrl(selectedListing)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Directions
                </a>
              </div>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
