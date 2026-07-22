import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ListingNotes } from "@/components/listings/ListingNotes";

export default async function ListingDetailPage({
  params
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!listing) notFound();

  const { data: notes } = await supabase
    .from("listing_notes")
    .select("id, note, created_at")
    .eq("listing_id", params.id)
    .order("created_at", { ascending: false });

  const facts: Array<[string, string | number | null]> = [
    ["District", listing.district],
    ["Developer", listing.developer],
    ["Property type", listing.property_type],
    ["Tenure", listing.tenure],
    ["TOP", listing.top_year],
    ["Bedrooms", listing.bedrooms],
    ["Bathrooms", listing.bathrooms],
    ["Floor area", listing.floor_area_sqft ? `${listing.floor_area_sqft} sqft` : null],
    ["Floor level", listing.floor_level],
    ["Facing", listing.facing],
    ["PSF", listing.psf ? `$${listing.psf}` : null],
    ["Nearby MRT", listing.nearby_mrt],
    ["Nearby schools", listing.nearby_schools],
    ["Nearby shopping", listing.nearby_shopping],
    ["Nearby amenities", listing.nearby_amenities]
  ];

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <h1 className="text-2xl font-semibold">
            {listing.project_name || listing.address}
          </h1>
          <Badge status={listing.status} />
        </div>
        <p className="text-muted">{listing.address}</p>
        <p className="mt-2 text-2xl font-semibold">
          {listing.price ? `$${Number(listing.price).toLocaleString()}` : "—"}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-muted">Details</h2>
          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            {facts
              .filter(([, value]) => value !== null && value !== "")
              .map(([label, value]) => (
                <div key={label}>
                  <dt className="text-muted">{label}</dt>
                  <dd className="font-medium">{value}</dd>
                </div>
              ))}
          </dl>
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-semibold text-muted">
            Media &amp; documents
          </h2>
          <p className="text-sm text-muted">
            Photo, video, floor plan, and brochure uploads land here —
            wired up in the Storage pass of this milestone.
          </p>
        </Card>
      </div>

      <div className="mt-6">
        <ListingNotes listingId={listing.id} initialNotes={notes ?? []} />
      </div>
    </main>
  );
}
