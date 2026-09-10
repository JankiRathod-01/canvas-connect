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
    image: "/images/artworks/nature-in-colors.jpg",
  },
  {
    id: 2,
    title: "Quiet Still Life",
    artist: "A. Mehta",
    category: "Still Life",
    image: "/images/artworks/quiet-still-life.jpg",
  },
  {
    id: 3,
    title: "Golden Horizon",
    artist: "R. Sharma",
    category: "Landscape",
    image: "/images/artworks/golden-horizon.jpg",
  },
  {
    id: 4,
    title: "Abstract Harmony",
    artist: "S. Kapoor",
    category: "Abstract",
    image: "/images/artworks/abstract-harmony.jpg",
  },
  {
    id: 5,
    title: "Portrait Study",
    artist: "N. Iyer",
    category: "Portrait",
    image: "/images/artworks/portrait-study.jpg",
  },
  {
    id: 6,
    title: "City in Light",
    artist: "K. Patel",
    category: "Modern",
    image: "/images/artworks/city-in-light.jpg",
  },
];
