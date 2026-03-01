import RifaForm from "@/components/admin/RifaForm";

export default function NuevaRifaPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-black text-white mb-1">Nueva Rifa</h1>
        <p className="text-zinc-500">
          Configura los detalles de tu nuevo sorteo.
        </p>
      </header>

      <div className="max-w-4xl">
        <RifaForm />
      </div>
    </div>
  );
}
