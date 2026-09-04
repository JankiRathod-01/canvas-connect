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
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80",
    description: "A vibrant study of monsoon greens and soft light.",
  },
  {
    id: "art-2",
    title: "Quiet Still Life",
    artistName: "Maya Chen",
    artistId: "static-artist-1",
    category: "Still Life",
    price: 8500,
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=800&q=80",
    description: "Everyday objects arranged with calm, careful balance.",
  },
  {
    id: "art-3",
    title: "Golden Horizon",
    artistName: "Rohan Mehta",
    artistId: "static-artist-2",
    category: "Landscape",
    price: 15000,
    image:
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800&q=80",
    description: "Warm dusk tones across an open coastal sky.",
  },
  {
    id: "art-4",
    title: "Abstract Harmony",
    artistName: "Rohan Mehta",
    artistId: "static-artist-2",
    category: "Abstract",
    price: 18000,
    image:
      "https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=800&q=80",
    description: "Layered shapes exploring rhythm and movement.",
  },
  {
    id: "art-5",
    title: "Portrait Study",
    artistName: "Maya Chen",
    artistId: "static-artist-1",
    category: "Portrait",
    price: 14000,
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?auto=format&fit=crop&w=800&q=80",
    description: "A quiet portrait focused on expression and light.",
  },
  {
    id: "art-6",
    title: "City in Light",
    artistName: "Rohan Mehta",
    artistId: "static-artist-2",
    category: "Modern",
    price: 16500,
    image:
      "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=800&q=80",
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
