import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { getOptionsForVote } from "../utils/getRandomPokemon";
import { inferQueryResponse } from "./api/trpc/[trpc]";

import type React from "react";

const btn =
  "bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow";

const Home = () => {
  const [ids, updateIds] = useState(() => getOptionsForVote());

  const [first, second] = ids;
  const firstPokemon = trpc.useQuery([
    "get-pokemon-by-id",
    {
      id: first,
    },
  ]);
  const secondPokemon = trpc.useQuery([
    "get-pokemon-by-id",
    {
      id: second,
    },
  ]);

  if (firstPokemon.isLoading || secondPokemon.isLoading) return null;

  const voteForRoundest = (selected: number) => {
    // todo: fire mutation to persist changes
    updateIds(getOptionsForVote());
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which Pokemon is rounder?</div>
      <div className="p-2"></div>
      <div className="border rounded p-8 flex justify-between max-w-2xl items-center">
        {!firstPokemon.isLoading &&
          firstPokemon.data &&
          !secondPokemon.isLoading &&
          secondPokemon.data && (
            <>
              <PokemonListing
                pokemon={firstPokemon.data}
                vote={() => voteForRoundest(first)}
              />
              <div className="p-8">vs</div>
              <PokemonListing
                pokemon={secondPokemon.data}
                vote={() => voteForRoundest(second)}
              />
            </>
          )}
      </div>
      <div className="p-2"></div>
    </div>
  );
};

type PokemonFromServer = inferQueryResponse<"get-pokemon-by-id">;

const PokemonListing: React.FC<{
  pokemon: PokemonFromServer;
  vote: () => void;
}> = (props) => {
  return (
    <div className="flex flex-col ">
      <img
        src={props.pokemon.sprites.front_default!}
        className="w-64 h-64"
        alt=""
      />
      <div className="text-xl text-center capitalize -mt-12">
        {props.pokemon.name}
      </div>
      <button
        className={btn}
        onClick={() => {
          props.vote();
        }}
      >
        Rounder
      </button>
    </div>
  );
};

export default Home;
