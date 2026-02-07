import AsiatiskMenuContent from "@/components/MenusContent/AsiatiskMenuContent";

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen bg-[#12110D]">
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-serif text-2xl font-semibold tracking-tight text-[#EAC84E] sm:text-3xl">
          Våra menyer
        </h1>
        <p className="mt-2 text-[#E5E7E3]/80">
          Asiatisk meny med bilder – klicka på en bild för att förstora.
        </p>
        <AsiatiskMenuContent />
      </section>
    </main>
  );
}
