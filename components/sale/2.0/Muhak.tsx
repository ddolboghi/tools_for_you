"use client";

type MuhakProps = {
  handleDrink: (company: string, drink: string, value: string) => void;
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
          className="border border-gray-300 rounded p-1 w-1/2 text-black"
          placeholder="0"
          onChange={(e) => handleDrink("가. 무학", "좋은데이", e.target.value)}
        />
        t
      </p>
      <p className="mt-2">
        톡시리즈 :{" "}
        <input
          type="number"
          pattern="\d*"
          className="border border-gray-300 rounded p-1 w-1/2 text-black"
          placeholder="0"
          onChange={(e) => handleDrink("가. 무학", "톡시리즈", e.target.value)}
        />
        t
      </p>
      <p className="mt-2">
        부산갈매기 :{" "}
        <input
          type="number"
          pattern="\d*"
          className="border border-gray-300 rounded p-1 w-1/2 text-black"
          placeholder="0"
          onChange={(e) =>
            handleDrink("가. 무학", "부산갈매기", e.target.value)
          }
        />
        t
      </p>
    </section>
  );
}
