import { createClient } from "@/utils/supabase/server";

type Sale = {
  id: number;
  created_at: string;
  sales_date: string | null;
  degC: number | null;
  ice_cream_sales: number | null;
  coffee_sales: number | null;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
});

function formatDate(value: string | null) {
  if (!value) return "—";
  return dateFormatter.format(new Date(value));
}

function formatNumber(value: number | null) {
  if (value === null) return "—";
  return value.toLocaleString("en-US");
}

function sum(sales: Sale[], field: "ice_cream_sales" | "coffee_sales") {
  return sales.reduce((total, sale) => total + (sale[field] ?? 0), 0);
}

async function getSales(): Promise<{ sales: Sale[]; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .order("sales_date", { ascending: true });

    if (error) return { sales: [], error: error.message };
    return { sales: (data ?? []) as Sale[], error: null };
  } catch (cause) {
    return { sales: [], error: (cause as Error).message };
  }
}

export default async function Home() {
  const { sales, error } = await getSales();

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Sales</h1>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Ice cream and coffee sales by day, from Supabase.
        </p>
      </header>

      {error ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
          <h2 className="font-medium text-red-600 dark:text-red-400">
            Could not load sales
          </h2>
          <p className="mt-1 font-mono text-sm text-black/70 dark:text-white/70">
            {error}
          </p>
        </div>
      ) : sales.length === 0 ? (
        <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
          <h2 className="font-medium">No rows returned</h2>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">
            The query succeeded but came back empty. If the table has rows, the
            row-level security policy is probably not granting read access.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Stat label="Days recorded" value={formatNumber(sales.length)} />
            <Stat
              label="Ice cream sold"
              value={formatNumber(sum(sales, "ice_cream_sales"))}
            />
            <Stat
              label="Coffee sold"
              value={formatNumber(sum(sales, "coffee_sales"))}
            />
          </div>

          <div className="overflow-x-auto rounded-lg border border-black/10 dark:border-white/15">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-black/10 bg-black/[.03] text-left dark:border-white/15 dark:bg-white/[.04]">
                  <Th>Date</Th>
                  <Th align="right">Temp (°C)</Th>
                  <Th align="right">Ice cream</Th>
                  <Th align="right">Coffee</Th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr
                    key={sale.id}
                    className="border-b border-black/5 last:border-0 dark:border-white/10"
                  >
                    <Td>{formatDate(sale.sales_date)}</Td>
                    <Td align="right">{formatNumber(sale.degC)}</Td>
                    <Td align="right">{formatNumber(sale.ice_cream_sales)}</Td>
                    <Td align="right">{formatNumber(sale.coffee_sales)}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
      <div className="text-xs uppercase tracking-wide text-black/50 dark:text-white/50">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-4 py-3 font-medium ${align === "right" ? "text-right" : "text-left"}`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <td
      className={`px-4 py-3 ${align === "right" ? "text-right tabular-nums" : ""}`}
    >
      {children}
    </td>
  );
}
