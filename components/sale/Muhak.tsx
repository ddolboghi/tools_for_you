"use client";

type MuhakProps = {
  handleDrink: (index: number, value: string) => void;
};

export default function Muhak({ handleDrink }: MuhakProps) {
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
    </section>
  );
}
