export interface GalleryArtwork {
  id: string;
  title: string;
  artistName: string;
  artistId: string;
  category: string;
  price: number;
  image: string;
  description: string;
}

/**
 * Temporary gallery data for landing pages.
 * Replace with API data after backend integration.
 */
export const galleryArtworks: GalleryArtwork[] = [
  {
    id: "art-1",
    title: "Nature in Colors",
    artistName: "Maya Chen",
    artistId: "static-artist-1",
    category: "Painting",
    price: 12000,
    image: "/images/artworks/nature-in-colors.jpg",
    description: "A vibrant study of monsoon greens and soft light.",
  },
  {
    id: "art-2",
    title: "Quiet Still Life",
    artistName: "Maya Chen",
    artistId: "static-artist-1",
    category: "Still Life",
    price: 8500,
    image: "/images/artworks/quiet-still-life.jpg",
    description: "Everyday objects arranged with calm, careful balance.",
  },
  {
    id: "art-3",
    title: "Golden Horizon",
    artistName: "Rohan Mehta",
    artistId: "static-artist-2",
    category: "Landscape",
    price: 15000,
    image: "/images/artworks/golden-horizon.jpg",
    description: "Warm dusk tones across an open coastal sky.",
  },
  {
    id: "art-4",
    title: "Abstract Harmony",
    artistName: "Rohan Mehta",
    artistId: "static-artist-2",
    category: "Abstract",
    price: 18000,
    image: "/images/artworks/abstract-harmony.jpg",
    description: "Layered shapes exploring rhythm and movement.",
  },
  {
    id: "art-5",
    title: "Portrait Study",
    artistName: "Maya Chen",
    artistId: "static-artist-1",
    category: "Portrait",
    price: 14000,
    image: "/images/artworks/portrait-study.jpg",
    description: "A quiet portrait focused on expression and light.",
  },
  {
    id: "art-6",
    title: "City in Light",
    artistName: "Rohan Mehta",
    artistId: "static-artist-2",
    category: "Modern",
    price: 16500,
    image: "/images/artworks/city-in-light.jpg",
    description: "Urban color and evening glow in a modern style.",
  },
];

export function getArtworksByArtistId(artistId: string): GalleryArtwork[] {
  return galleryArtworks.filter((artwork) => artwork.artistId === artistId);
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
