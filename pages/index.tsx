import Head from "next/head";
import dynamic from "next/dynamic";

const Chat = dynamic(() => import("../components/Chat"), { ssr: false });

export default function Home() {
  return (
    <>
      <Head>
        <title>iddi</title>
      </Head>
      <main className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold mb-4">Benvenuto in iddi</h1>
        <p className="mb-6 text-center max-w-xl">
          Questa è una versione demo della tua AI personale. Inizia a conversare e testare.
        </p>
        <Chat />
      </main>
    </>
  );
}
