import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default async function ListingsPage() {
  const supabase = createClient();
  const { data: listings } = await supabase
    .from("listings")
    .select("id, project_name, address, district, price, psf, status")
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Listings</h1>
        <Link href="/listings/new">
          <Button>+ New Listing</Button>
        </Link>
      </header>

      {!listings || listings.length === 0 ? (
        <Card className="text-center">
          <p className="text-sm text-muted">No listings yet.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <Link key={listing.id} href={`/listings/${listing.id}`}>
              <Card className="flex items-center justify-between transition-shadow hover:shadow-lg">
                <div>
                  <p className="font-medium">
                    {listing.project_name || listing.address}
                  </p>
                  <p className="text-sm text-muted">
                    {listing.address}
                    {listing.district ? ` · District ${listing.district}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">
                      {listing.price
                        ? `$${Number(listing.price).toLocaleString()}`
                        : "—"}
                    </p>
                    <p className="text-xs text-muted">
                      {listing.psf ? `$${listing.psf} psf` : ""}
                    </p>
                  </div>
                  <Badge status={listing.status} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
