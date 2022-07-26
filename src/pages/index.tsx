import React, { useState } from "react";
import { trpc } from "@/utils/trpc";
import { getOptionsForVote } from "../utils/getRandomPokemon";
import { inferQueryResponse } from "./api/trpc/[trpc]";

import Image from "next/image";
import Link from "next/link";

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

  //tacos
  const voteMutation = trpc.useMutation(["cast-vote"]);

  const voteForRoundest = (selected: number) => {
    if (selected === first) {
      voteMutation.mutate({ votedFor: first, votedAgainst: second });
    } else {
      voteMutation.mutate({ votedFor: second, votedAgainst: first });
    }

    // todo: fire mutation to persist changes
    updateIds(getOptionsForVote());
  };

  const dataLoaded =
    !firstPokemon.isLoading &&
    firstPokemon.data &&
    !secondPokemon.isLoading &&
    secondPokemon.data;

  // const dataLoaded = false;

  return (
    <div>
      <div className="h-screen w-screen flex flex-col justify-between items-center relative">
        <div className="text-2xl text-center pt-8">
          Which Pokemon is rounder?
        </div>

        {dataLoaded && (
          <>
            <div className="border rounded p-8 flex justify-between items-center max-w-2xl">
              <PokemonListing
                pokemon={firstPokemon.data}
                vote={() => voteForRoundest(first)}
              />
              <div className="p-8">vs</div>
              <PokemonListing
                pokemon={secondPokemon.data}
                vote={() => voteForRoundest(second)}
              />
              <div className="p-2"></div>
            </div>
          </>
        )}
        {!dataLoaded && <img src="/ring-loader.svg" className="w-48" />}

        <div className="w-full text-xl text-center pb-2">
          <a href="https://github.com/AgenticAI/pokemon">Github</a>
          {" | "}
          <Link href="/results">
            <a href="/results">Results</a>
          </Link>
        </div>
      </div>
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
      <Image
        src={props.pokemon.spriteUrl}
        width={256}
        height={256}
        className="w-64 h-64"
        layout="fixed"
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
