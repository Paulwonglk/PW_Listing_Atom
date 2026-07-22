const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700",
  under_offer: "bg-amber-50 text-amber-700",
  sold: "bg-neutral-100 text-neutral-500",
  withdrawn: "bg-neutral-100 text-neutral-400"
};

export function Badge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? "bg-neutral-100 text-neutral-600";
  const label = status.replace("_", " ");

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${style}`}
    >
      {label}
    </span>
  );
}
