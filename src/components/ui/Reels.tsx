import React from "react";

type Props = {
  symbols: string[];
};

const Reels: React.FC<Props> = ({ symbols }) => {
  return (
    <div className="flex justify-center gap-2 text-5xl">
      {symbols.map((symbol, index) => (
        <div
          key={index}
          className="w-16 h-16 bg-black border border-white rounded flex items-center justify-center"
        >
          {symbol}
        </div>
      ))}
    </div>
  );
};

export default Reels;
