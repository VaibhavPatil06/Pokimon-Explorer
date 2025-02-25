"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

interface Pokemon {
  name: string;
  url: string;
}

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const loader = useRef<HTMLDivElement>(null);

  const fetchPokemons = useCallback(async () => {
    if (loading) return; 
    setLoading(true);

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`
      );
      const data = await response.json();

      setPokemons((prev) => {
        const newPokemons = data.results.filter(
          (newPokemon: Pokemon) =>
            !prev.some((pokemon) => pokemon.name === newPokemon.name)
        );
        return [...prev, ...newPokemons];
      });

      setOffset((prev) => prev + 20); 
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
    } finally {
      setLoading(false);
    }
  }, [offset, loading]); 

  useEffect(() => {
    fetchPokemons();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        fetchPokemons(); 
      }
    });

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => observer.disconnect();
  }, [fetchPokemons]); 

  const getPokemonId = (url: string) => {
    const parts = url.split("/");
    return parts[parts.length - 2]; 
  };

  const filteredPokemons = search
    ? pokemons.filter((pokemon) => pokemon.name.includes(search))
    : pokemons;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-red-200 p-6">
      <h1 className="text-4xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-yellow-500">
        Pokemon Explorer
      </h1>
      <input
        type="text"
        placeholder="Search Pokémon..."
        className="block w-full max-w-md mx-auto mb-6 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-400 focus:border-red-500 transition"
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filteredPokemons.map((pokemon) => {
          const pokemonId = getPokemonId(pokemon.url);
          return (
            <Link key={pokemon.name} href={`/pokemon/${pokemonId}`}>
              <div className="bg-white p-5 rounded-xl shadow-lg text-center cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
                <Image
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
                  alt={pokemon.name}
                  className="w-28 h-28 mx-auto"
                  width={100}
                  height={100}
                />
                <p className="mt-3 text-lg font-semibold capitalize text-gray-800">
                  {pokemon.name}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
      <div
        ref={loader}
        className="text-center p-6 text-lg font-semibold text-red-600"
      >
        {loading && "Loading more..."}
      </div>
    </div>
  );
}
