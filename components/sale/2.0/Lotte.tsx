"use client";

import { bskyReport } from "@/data/sale/report";

type LotteProps = {
  handleDrink: (company: string, drink: string, value: string) => void;
};

export default function Lotte({ handleDrink }: LotteProps) {
  return (
    <section className="mb-4 border border-gray-300 p-2">
      <h1 className="text-lg">롯데</h1>
      {Object.keys(bskyReport["라. 롯데"]).map((drink) => (
        <p key={drink} className="mt-2">
          {drink}
          <input
            type="number"
            pattern="\d*"
            className="border border-gray-300 rounded p-1 w-1/2 text-black"
            placeholder="0"
            onChange={(e) => handleDrink("라. 롯데", drink, e.target.value)}
          />
          t
        </p>
      ))}
    </section>
  );
}
