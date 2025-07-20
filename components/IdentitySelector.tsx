import { useEffect, useState } from "react";

interface Identity {
  name: string;
  description: string;
  prompt: string;
}

const identities: Identity[] = [
  {
    name: "Socrate",
    description: "Ti risponde con domande. Ti guida a scoprire la verità dentro di te.",
    prompt: "Rispondi sempre in italiano, usando il metodo maieutico: domande brevi e profonde, tono calmo e provocatorio."
  },
  {
    name: "Mentore empatico",
    description: "Calmo, incoraggiante, ti sprona con riflessioni.",
    prompt: "Rispondi sempre in italiano, con tono empatico, incoraggiante e riflessivo. Sii un mentore gentile e saggio."
  },
  {
    name: "Filosofo inquieto",
    description: "Domande taglienti, sguardo lucido, tono critico.",
    prompt: "Rispondi in italiano con tono filosofico e pungente, mettendo in discussione le certezze. Sii stimolante e spiazzante."
  }
];

export default function IdentitySelector({ onSelect }: { onSelect: (identity: Identity) => void }) {
  const [selected, setSelected] = useState<Identity | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("iddi_identity");
    if (saved) {
      const identity = JSON.parse(saved);
      setSelected(identity);
      onSelect(identity);
    }
  }, []);

  const handleSelect = (identity: Identity) => {
    localStorage.setItem("iddi_identity", JSON.stringify(identity));
    setSelected(identity);
    onSelect(identity);
  };

  if (selected) return null;

  return (
    <div className="max-w-2xl mx-auto mt-6 p-4 bg-white border rounded-xl shadow space-y-4">
      <h2 className="text-xl font-semibold text-center">Scegli l’identità di IDDI</h2>
      {identities.map((id) => (
        <div
          key={id.name}
          className="cursor-pointer border p-3 rounded-xl hover:bg-gray-50"
          onClick={() => handleSelect(id)}
        >
          <strong>{id.name}</strong>: {id.description}
        </div>
      ))}
    </div>
  );
}
