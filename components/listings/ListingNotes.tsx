"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type Note = { id: string; note: string; created_at: string };

export function ListingNotes({
  listingId,
  initialNotes
}: {
  listingId: string;
  initialNotes: Note[];
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  async function addNote() {
    if (!draft.trim()) return;
    setSaving(true);

    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("listing_notes")
      .insert({ listing_id: listingId, agent_id: user.id, note: draft.trim() })
      .select("id, note, created_at")
      .single();

    setSaving(false);
    if (!error && data) {
      setNotes([data, ...notes]);
      setDraft("");
    }
  }

  return (
    <Card>
      <h2 className="mb-4 text-sm font-semibold text-muted">Agent notes</h2>
      <div className="mb-4 flex gap-2">
        <textarea
          className="w-full rounded-xl border border-line px-4 py-2.5 text-sm"
          rows={2}
          placeholder="Add a note about this listing…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <Button onClick={addNote} disabled={saving}>
          Add
        </Button>
      </div>
      {notes.length === 0 ? (
        <p className="text-sm text-muted">No notes yet.</p>
      ) : (
        <ul className="space-y-3">
          {notes.map((n) => (
            <li key={n.id} className="border-t border-line pt-3 text-sm">
              <p>{n.note}</p>
              <p className="mt-1 text-xs text-muted">
                {new Date(n.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
