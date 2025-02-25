"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface PokemonData {
  name: string;
  id: number;
  height: number;
  weight: number;
  sprites: { front_default: string };
  types: { type: { name: string } }[];
}

const PokemonDetails = () => {
  const pathname = usePathname();
  const lastSegment = pathname.split("/").filter(Boolean).pop();
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (lastSegment) {
      fetchPokemonDetails(lastSegment);
    }
  }, [lastSegment]);

  const fetchPokemonDetails = async (query: string) => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${query}`
      );
      if (!response.ok) throw new Error("Pokémon not found");
      const data = await response.json();
      setPokemon(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const renderData = (data: unknown) => {
    if (Array.isArray(data)) {
      return (
        <div className="overflow-auto border rounded-lg shadow-sm bg-white my-4 w-full sm:max-w-4xl lg:max-w-[70vw]">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-sm md:text-base">
                <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                  Key
                </th>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.map((item, index) => (
                <tr key={index} className="bg-gray-50 even:bg-gray-100">
                  <td colSpan={2} className="px-4 py-2">
                    {renderData(item)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (typeof data === "object" && data !== null) {
      return (
        <div className="overflow-auto border rounded-lg shadow-sm bg-white my-4 w-full sm:max-w-4xl lg:max-w-[70vw]">
          <table className="min-w-full border-collapse">
            <tbody className="divide-y">
              {Object.entries(data).map(([key, value]) => (
                <tr
                  key={key}
                  className="bg-gray-50 even:bg-gray-100 text-sm md:text-base"
                >
                  <td className="px-4 py-2 font-semibold text-gray-800 capitalize">
                    {key.replace(/_/g, " ")}
                  </td>
                  <td className="px-4 py-2">{renderData(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (typeof data === "string" && data.startsWith("http")) {
      if (data.endsWith(".ogg") || data.endsWith(".mp3")) {
        return (
          <audio controls className="mt-2 w-full max-w-xs">
            <source src={data} type="audio/ogg" />
            Your browser does not support the audio element.
          </audio>
        );
      } else if (
        data.endsWith(".gif") ||
        data.endsWith(".png") ||
        data.endsWith(".svg") ||
        data.endsWith(".jpg")
      ) {
        return (
          <div className="relative w-24 h-24 md:w-32 md:h-32 border-2 border-gray-300 rounded-lg overflow-hidden shadow-sm">
            <Image
              src={data}
              alt="Pokémon image"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        );
      } else {
        return (
          <a
            href={data}
            className="hover:text-blue-800 cursor-pointer text-blue-600 break-words block max-w-xs md:max-w-md"
          >
            {data}
          </a>
        );
      }
    } else {
      return <span className="text-gray-800">{String(data)}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-purple-400 p-6 flex flex-col items-center">
      <h1 className="text-5xl font-extrabold  text-center mb-8   ">
        Pokémon Details
      </h1>
      <Link
        href="/"
        className="mb-6 px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
      >
        ⬅ Back to Home
      </Link>

      <div className="w-full sm:max-w-4xl lg:max-w-[70vw] bg-white shadow-xl rounded-2xl p-6 sm:p-8">
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-lg font-semibold text-gray-700">
              Loading...
            </p>
          </div>
        ) : pokemon ? (
          renderData(pokemon)
        ) : (
          <p className="text-center text-xl font-medium text-red-500">
            Pokémon not found.
          </p>
        )}
      </div>
    </div>
  );
};

export default PokemonDetails;
