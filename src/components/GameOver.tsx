const lines = [
  "Your Not Going to stop there are you?",
  "Looks like Lady Luck swiped left again, huh?",
  "Well, on the bright side, you've got a great story for your memoir.",
  "You’ve officially beaten the house… at losing.",
  "You just made a generous donation to the casino's renovation fund.",
  "Turns out, luck *isn't* a strategy after all.",
  "You could’ve burned that cash for warmth and at least gotten something out of it.",
  "If losing were an Olympic sport, you'd be on the podium.",
  "Next time, let’s just skip the casino and I’ll slap you with a stack of Monopoly money instead.",
  "Maybe you were gambling for the life lesson all along?",
  "Vegas: 1. You: 0. But hey, you showed up in style!",
];

export default function GameOver({
  counter,
  setPage,
  setInBank,
}: {
  counter: number;
  setPage: (v: string) => void;
  setInBank: (b: boolean) => void;
}) {
  const i = Math.floor(Math.random() * lines.length);

  return (
    <div className="text-center">
      <h1 className="pb-2">
        ☠️ Good Job, Your Broke...{counter > 0 && "Again.."}🗑️
      </h1>
      <p className="pb-2">{lines[i]}</p>
      <button
        onClick={() => {
          setInBank(true);
          setPage("bank");
        }}
      >
        Go To Bank
      </button>
    </div>
  );
}
