const financeOptions = {
  good: [
    {
      name: "Personal Loan",
      interest: 0.08,
      money: 8000,
      payoff: 10,
      description: "A boring, responsible option? Shocking. Get decent cash at a decent rate—if you can handle paperwork and waiting more than five minutes."
    },
    {
      name: "Business Line of Credit",
      interest: 0.25,
      money: 6000,
      payoff: 10,
      description: "Have a business or just pretending to? Either way, banks will give you a high-interest credit line and a pat on the back. Good luck!"
    },
    {
      name: "Home Equity Loan",
      interest: 0.08,
      money: 10000,
      payoff: 10,
      description: "Why not gamble your house to fix your cash flow? It’s not like shelter is important or anything."
    },
    {
      name: "Sell Investment",
      interest: 0,
      money: 15000,
      payoff: 10,
      description: "Oh look, a smart adult move! Just cash out your retirement and try not to cry about long-term growth later."
    },
  ],
  fair: [
    {
      name: "WhaleMard Credit Card",
      interest: 0.35,
      money: 4000,
      payoff: 10,
      description: "Who needs savings when you can pay 35% APR to buy a TV you don’t need from a megastore you secretly hate?"
    },
    {
      name: "Junk Recycling",
      interest: 0.08,
      money: 200,
      payoff: 0,
      description: "Feeling like turning literal trash into cash? Hope you enjoy the aroma of stale soda and questionable fluids."
    },
    {
      name: "Credit Advance",
      interest: 0.08,
      money: 10,
      payoff: 10,
      description: "Need ten bucks and like pain? Enjoy paying fees for what basically amounts to couch-cushion change."
    },
    {
      name: "Visit the Pawn Shop",
      interest: 0.0,
      money: 2500,
      payoff: 10,
      description: "Trade grandma’s necklace for 20% of its value. What could possibly go wrong?"
    },
  ],
  bad: [
    {
      name: "Recycle Cans && Bottles",
      interest: 0.0,
      money: 20,
      payoff: 0,
      description: "Still here, still sticky, still not making more than gas money. But hey, it builds character?"
    },
    {
      name: "Pay Day Loan", 
      interest: 200.0, 
      money: 10000,
      payoff: 10,
      description: "Need money now and a financial disaster later? Sign here and prepare to owe your soul to the interest gods."
    },
    {
      name: "Credit Card Cash Advance",
      interest: 0.29,
      money: 3000,
      payoff: 10,
      description: "Like a regular loan, but worse in every possible way. Instant regret included free of charge."
    },
    {
      name: "Rent-to-Own Furniture",
      interest: 0.4,
      money: 500,
      payoff: 10,
      description: "Why buy a couch outright when you can pay triple for it over time? It’s the future of poor decisions."
    },
  ],
  desperate: [
    {
      name: "Sell Dad's Golf Clubs",
      interest: 0.00,
      money: 1000,
      payoff: 0,
      description: "Sure, he hasn’t played in years… but are you ready to explain why they’re missing this Thanksgiving?"
    },
    {
      name: "Sell Your Personal Data",
      interest: 0.00,
      money: 450,
      payoff: 0,
      description: "What’s privacy worth these days? Apparently less than a weekend road trip. Enjoy the targeted ads."
    },
    {
      name: "Deal with Loan Shark",
      interest: 300.00,
      money: 1000,
      payoff: 50,
      description: "Ah yes, borrowing money with the slight risk of losing a kneecap. Sounds reasonable."
    },
    {
      name: "Drug Mule",
      interest: 0.0,
      money: 3000,
      payoff: 0,
      description: "Sure, it’s quick cash—assuming customs doesn’t get to you before your conscience does. What could go wrong?"
    },
  ],
};

export default financeOptions;
