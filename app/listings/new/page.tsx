import { ListingForm } from "@/components/listings/ListingForm";

export default function NewListingPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-8 text-2xl font-semibold">New Listing</h1>
      <ListingForm />
    </main>
  );
}
