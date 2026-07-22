"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const PROPERTY_TYPES = ["EC", "Condo", "HDB", "Landed"];

export function ListingForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    project_name: "",
    address: "",
    postal_code: "",
    district: "",
    developer: "",
    property_type: "Condo",
    tenure: "",
    top_year: "",
    bedrooms: "",
    bathrooms: "",
    floor_area_sqft: "",
    floor_level: "",
    facing: "",
    price: "",
    nearby_mrt: "",
    nearby_schools: "",
    nearby_shopping: "",
    nearby_amenities: ""
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be signed in.");
      setSaving(false);
      return;
    }

    const payload = {
      agent_id: user.id,
      project_name: form.project_name || null,
      address: form.address,
      postal_code: form.postal_code || null,
      district: form.district || null,
      developer: form.developer || null,
      property_type: form.property_type || null,
      tenure: form.tenure || null,
      top_year: form.top_year ? Number(form.top_year) : null,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
      floor_area_sqft: form.floor_area_sqft ? Number(form.floor_area_sqft) : null,
      floor_level: form.floor_level || null,
      facing: form.facing || null,
      price: form.price ? Number(form.price) : null,
      nearby_mrt: form.nearby_mrt || null,
      nearby_schools: form.nearby_schools || null,
      nearby_shopping: form.nearby_shopping || null,
      nearby_amenities: form.nearby_amenities || null
    };

    const { data, error } = await supabase
      .from("listings")
      .insert(payload)
      .select("id")
      .single();

    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push(`/listings/${data.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <h2 className="mb-4 text-sm font-semibold text-muted">Basics</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Project name"
            value={form.project_name}
            onChange={(e) => update("project_name", e.target.value)}
          />
          <Input
            label="Address"
            required
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
          />
          <Input
            label="Postal code"
            value={form.postal_code}
            onChange={(e) => update("postal_code", e.target.value)}
          />
          <Input
            label="District"
            value={form.district}
            onChange={(e) => update("district", e.target.value)}
          />
          <Input
            label="Developer"
            value={form.developer}
            onChange={(e) => update("developer", e.target.value)}
          />
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">
              Property type
            </span>
            <select
              className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink"
              value={form.property_type}
              onChange={(e) => update("property_type", e.target.value)}
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <Input
            label="Tenure"
            placeholder="99-year / Freehold"
            value={form.tenure}
            onChange={(e) => update("tenure", e.target.value)}
          />
          <Input
            label="TOP year"
            type="number"
            value={form.top_year}
            onChange={(e) => update("top_year", e.target.value)}
          />
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-muted">Unit details</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Bedrooms"
            type="number"
            value={form.bedrooms}
            onChange={(e) => update("bedrooms", e.target.value)}
          />
          <Input
            label="Bathrooms"
            type="number"
            value={form.bathrooms}
            onChange={(e) => update("bathrooms", e.target.value)}
          />
          <Input
            label="Floor area (sqft)"
            type="number"
            value={form.floor_area_sqft}
            onChange={(e) => update("floor_area_sqft", e.target.value)}
          />
          <Input
            label="Floor level"
            value={form.floor_level}
            onChange={(e) => update("floor_level", e.target.value)}
          />
          <Input
            label="Facing"
            value={form.facing}
            onChange={(e) => update("facing", e.target.value)}
          />
          <Input
            label="Price (SGD)"
            type="number"
            required
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
          />
        </div>
        <p className="mt-3 text-xs text-muted">
          PSF is calculated automatically from price and floor area.
        </p>
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-muted">Nearby</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Nearby MRT"
            value={form.nearby_mrt}
            onChange={(e) => update("nearby_mrt", e.target.value)}
          />
          <Input
            label="Nearby schools"
            value={form.nearby_schools}
            onChange={(e) => update("nearby_schools", e.target.value)}
          />
          <Input
            label="Nearby shopping"
            value={form.nearby_shopping}
            onChange={(e) => update("nearby_shopping", e.target.value)}
          />
          <Input
            label="Nearby amenities"
            value={form.nearby_amenities}
            onChange={(e) => update("nearby_amenities", e.target.value)}
          />
        </div>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={saving} className="w-full sm:w-auto">
        {saving ? "Saving…" : "Save listing"}
      </Button>
    </form>
  );
}
