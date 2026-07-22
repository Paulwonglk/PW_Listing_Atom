export type Listing = {
  id: string;
  agent_id: string;
  project_name: string | null;
  address: string;
  postal_code: string | null;
  district: string | null;
  developer: string | null;
  property_type: string | null;
  tenure: string | null;
  top_year: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  floor_area_sqft: number | null;
  floor_level: string | null;
  facing: string | null;
  price: number | null;
  psf: number | null;
  nearby_mrt: string | null;
  nearby_schools: string | null;
  nearby_shopping: string | null;
  nearby_amenities: string | null;
  status: "active" | "under_offer" | "sold" | "withdrawn";
  tags: string[];
  created_at: string;
  updated_at: string;
};

export type ListingMedia = {
  id: string;
  listing_id: string;
  type: "photo" | "video" | "floorplan" | "brochure";
  url: string;
  sort_order: number;
  created_at: string;
};

export type ListingNote = {
  id: string;
  listing_id: string;
  agent_id: string;
  note: string;
  created_at: string;
};

export type Agent = {
  id: string;
  team_id: string | null;
  name: string;
  email: string;
  role: "owner" | "agent";
  created_at: string;
};
