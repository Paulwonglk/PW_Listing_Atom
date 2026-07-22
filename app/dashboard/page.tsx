import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: listings } = await supabase
    .from("listings")
    .select("id, project_name, address, price, psf, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const { count: activeCount } = await supabase
    .from("listings")
    .select("id", { count: "exact", head: true })
    .eq("status", "active");

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">Welcome back</p>
          <h1 className="text-2xl font-semibold">{user?.email}</h1>
        </div>
        <Link href="/listings/new">
          <Button>+ New Listing</Button>
        </Link>
      </header>

      <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-muted">Active Listings</p>
          <p className="mt-2 text-3xl font-semibold">{activeCount ?? 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Leads This Week</p>
          <p className="mt-2 text-3xl font-semibold">—</p>
          <p className="mt-1 text-xs text-muted">Coming in Milestone 2</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Follow-ups Due</p>
          <p className="mt-2 text-3xl font-semibold">—</p>
          <p className="mt-1 text-xs text-muted">Coming in Milestone 2</p>
        </Card>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Listings</h2>
          <Link href="/listings" className="text-sm text-muted hover:text-ink">
            View all
          </Link>
        </div>

        {!listings || listings.length === 0 ? (
          <Card className="text-center">
            <p className="text-sm text-muted">
              No listings yet. Add your first one to populate the dashboard.
            </p>
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
                    <p className="text-sm text-muted">{listing.address}</p>
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
      </section>
    </main>
  );
}
