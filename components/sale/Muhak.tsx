"use client";

import { useState } from "react";

type MuhakProps = {
  handleDrink: (index: number, value: string) => void;
};

export default function Muhak({ handleDrink }: MuhakProps) {
  const [onSplit, setOnSplit] = useState(false);

  const handleSplitGalmegi = () => {
    setOnSplit(!onSplit);
  };
  return (
    <section className="mb-4 border border-gray-300 p-2">
      <h1 className="text-lg">무학</h1>
      <p className="mt-2">
        좋은데이 :{" "}
        <input
          type="number"
          pattern="\d*"
          className="border border-gray-300 rounded p-1 w-1/2"
          placeholder="0"
          onChange={(e) => handleDrink(1, e.target.value)}
        />
        t
      </p>
      <p className="mt-2">
        톡시리즈 :{" "}
        <input
          type="number"
          pattern="\d*"
          className="border border-gray-300 rounded p-1 w-1/2"
          placeholder="0"
          onChange={(e) => handleDrink(2, e.target.value)}
        />
        t
      </p>
      {onSplit ? (
        <div>
          <p className="mt-2">
            부산갈매기19 :{" "}
            <input
              type="number"
              pattern="\d*"
              className="border border-gray-300 rounded p-1 w-1/2"
              placeholder="0"
              onChange={(e) => handleDrink(3, e.target.value)}
            />
            t
          </p>
          <p className="mt-2">
            부산갈매기16 :{" "}
            <input
              type="number"
              pattern="\d*"
              className="border border-gray-300 rounded p-1 w-1/2"
              placeholder="0"
              onChange={(e) => handleDrink(4, e.target.value)}
            />
            t
          </p>
        </div>
      ) : (
        <p className="mt-2">
          부산갈매기 :{" "}
          <input
            type="number"
            pattern="\d*"
            className="border border-gray-300 rounded p-1 w-1/2"
            placeholder="0"
            onChange={(e) => handleDrink(3, e.target.value)}
          />
          t
        </p>
      )}
      <button
        onClick={handleSplitGalmegi}
        className="bg-blue-500 text-white rounded p-1"
      >
        갈매기19,16 나누기
      </button>
    </section>
  );
}
