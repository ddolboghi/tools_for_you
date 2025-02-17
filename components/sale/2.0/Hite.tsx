"use client";

import { bskyReport } from "@/data/sale/report";

type HiteProps = {
  handleDrink: (company: string, drink: string, value: string) => void;
};

export default function Hite({ handleDrink }: HiteProps) {
  return (
    <section className="mb-4 border border-gray-300 p-2">
      <h1 className="text-lg">하이트진로</h1>
      {Object.keys(bskyReport["나. 하이트진로"]).map((drink) => (
        <p key={drink} className="mt-2">
          {drink}
          <input
            type="number"
            pattern="\d*"
            className="border border-gray-300 rounded p-1 w-1/2 text-black"
            placeholder="0"
            onChange={(e) =>
              handleDrink("나. 하이트진로", drink, e.target.value)
            }
          />
          t
        </p>
      ))}
    </section>
  );
}
