import { useMemo, useState } from "react";
import { trpc } from "@/utils/trpc";

import { getOptionsForVote } from "../utils/getRandomPokemon";

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

    updateIds();
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which Pokemon is rounder?</div>
      <div className="p-2"></div>
      <div className="border rounded p-8 flex justify-between max-w-2xl items-center">
        <div className="w-64 h-64 flex flex-col ">
          <img
            src={firstPokemon.data?.sprites.front_default!}
            className="w-full"
            alt=""
          />
          <div className="text-xl text-center capitalize -mt-12">
            {firstPokemon.data?.name}
          </div>
          <button
            className={btn}
            onClick={() => {
              voteForRoundest(first);
            }}
          >
            Rounder
          </button>
        </div>
        <div className="p-8">vs</div>
        <div className="w-64 h-64 flex flex-col">
          <img
            src={secondPokemon.data?.sprites.front_default!}
            className="w-full"
            alt=""
          />
          <div className="text-xl text-center capitalize -mt-12">
            {secondPokemon.data?.name}
          </div>
          <button
            className={btn}
            onClick={() => {
              voteForRoundest(second);
            }}
          >
            Rounder
          </button>
        </div>
      </div>
      <div className="p-2"></div>
    </div>
  );
};

export default Home;
