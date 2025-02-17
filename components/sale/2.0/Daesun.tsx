"use client";

import { bskyReport } from "@/data/sale/report";

type DaesunProps = {
  handleDrink: (company: string, drink: string, value: string) => void;
};

export default function Daesun({ handleDrink }: DaesunProps) {
  return (
    <section className="mb-4 border border-gray-300 p-2">
      <h1 className="text-lg">대선주조</h1>
      {Object.keys(bskyReport["다. 대선주조"]).map((drink) => (
        <p key={drink} className="mt-2">
          {drink}
          <input
            type="number"
            pattern="\d*"
            className="border border-gray-300 rounded p-1 w-1/2 text-black"
            placeholder="0"
            onChange={(e) => handleDrink("다. 대선주조", drink, e.target.value)}
          />
          t
        </p>
      ))}
    </section>
  );
}
