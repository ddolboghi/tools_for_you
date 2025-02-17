"use client";

type HiteProps = {
  handleDrink: (index: number, value: string) => void;
};

export default function Hite({ handleDrink }: HiteProps) {
  return (
    <section className="mb-4 border border-gray-300 p-2">
      <h1 className="text-lg">하이트진로</h1>
      <p className="mt-2">
        참이슬 :{" "}
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
        진로 :{" "}
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
        기타(진로 골드) :{" "}
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
