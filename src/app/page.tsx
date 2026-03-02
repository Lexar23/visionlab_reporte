import { getReportData } from "@/lib/excel";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  const rawData = await getReportData();

  return (
    <main className="pb-20">
      <section className="relative pt-12 pb-12 px-6 overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent -z-10" />
        <h1 className="text-4xl font-black tracking-tight mb-2">
          Dashboard de <span className="text-primary italic">Resultados</span>
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto">
          Resumen ejecutivo del rendimiento general por sucursales y meses.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6">
        <DashboardContent initialData={rawData} />
      </section>
    </main>
  );
}
