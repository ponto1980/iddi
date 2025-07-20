import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>iddi</title>
      </Head>
      <main className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold mb-4">Benvenuto in iddi</h1>
        <p className="mb-6 text-center max-w-xl">
          Questa è la versione beta del tuo progetto con interfaccia chiara e pronta a integrare una chat intelligente.
        </p>
        <button className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition">
          Avvia chat
        </button>
      </main>
    </>
  );
}
