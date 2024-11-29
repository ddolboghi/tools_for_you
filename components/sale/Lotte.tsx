"use client";

type LotteProps = {
  handleDrink: (index: number, value: string) => void;
};

export default function Lotte({ handleDrink }: LotteProps) {
  return (
    <section className="mb-4 border border-gray-300 p-2">
      <h1 className="text-lg">롯데</h1>
      <p className="mt-2">
        새로 :{" "}
        <input
          type="number"
          pattern="\d*"
          className="border border-gray-300 rounded p-1 w-1/2 text-black"
          placeholder="0"
          onChange={(e) => handleDrink(1, e.target.value)}
        />
        t
      </p>
      <p className="mt-2">
        새로(살구) :{" "}
        <input
          type="number"
          pattern="\d*"
          className="border border-gray-300 rounded p-1 w-1/2 text-black"
          placeholder="0"
          onChange={(e) => handleDrink(2, e.target.value)}
        />
        t
      </p>
      <p className="mt-2">
        청하(별빛청하 포함) :{" "}
        <input
          type="number"
          pattern="\d*"
          className="border border-gray-300 rounded p-1 w-1/2 text-black"
          placeholder="0"
          onChange={(e) => handleDrink(3, e.target.value)}
        />
        t
      </p>
    </section>
  );
}
