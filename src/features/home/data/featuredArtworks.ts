export interface FeaturedArtwork {
  id: number;
  title: string;
  artist: string;
  category: string;
  image: string;
}

export const featuredArtworks: FeaturedArtwork[] = [
  {
    id: 1,
    title: "Nature in Colors",
    artist: "Sample Artist",
    category: "Painting",
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Quiet Still Life",
    artist: "A. Mehta",
    category: "Still Life",
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Golden Horizon",
    artist: "R. Sharma",
    category: "Landscape",
    image:
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Abstract Harmony",
    artist: "S. Kapoor",
    category: "Abstract",
    image:
      "https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    title: "Portrait Study",
    artist: "N. Iyer",
    category: "Portrait",
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    title: "City in Light",
    artist: "K. Patel",
    category: "Modern",
    image:
      "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=800&q=80",
  },
];
