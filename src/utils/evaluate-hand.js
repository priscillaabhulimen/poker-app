// SOURCED FROM THE INTERNET - REFACTORED WITH AI
const VALUE_MAP = {
  ACE: 14,
  KING: 13,
  QUEEN: 12,
  JACK: 11,
  10: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
};

const VALUE_NAME = {
  14: "Ace",
  13: "King",
  12: "Queen",
  11: "Jack",
  10: "Ten",
  9: "Nine",
  8: "Eight",
  7: "Seven",
  6: "Six",
  5: "Five",
  4: "Four",
  3: "Three",
  2: "Two",
};

export function evaluatePokerHand(cards = []) {
  const validCards = cards.filter((c) => !c.isPlaceholder && c.value && c.suit);

  if (validCards.length === 0) {
    return {
      status: "no_cards",
      hand: null,
      reason: "All cards are placeholders or no valid cards provided",
    };
  }

  if (validCards.length < 5) {
    return {
      status: "incomplete",
      hand: null,
      reason: `Only ${validCards.length} valid card(s) provided; need 5 for a full evaluation.`,
      validCount: validCards.length,
    };
  }

  const handCards = validCards.slice(0, 5);

  const values = handCards.map((c) => VALUE_MAP[c.value]).sort((a, b) => b - a);
  const suits = handCards.map((c) => c.suit);

  const valueCounts = {};
  values.forEach((v) => (valueCounts[v] = (valueCounts[v] || 0) + 1));
  const counts = Object.values(valueCounts).sort((a, b) => b - a);

  const isFlush = new Set(suits).size === 1;

  const isConsecutive = (arr) =>
    arr.every((v, i) => i === 0 || arr[i - 1] === v + 1);

  const isWheel = JSON.stringify(values) === JSON.stringify([14, 5, 4, 3, 2]);
  const isStraight = isConsecutive(values) || isWheel;

  let handName = "High Card";

  if (isFlush && isStraight && values[0] === 14) {
    handName = "Royal Flush";
  } else if (isFlush && isStraight) {
    handName = "Straight Flush";
  } else if (counts[0] === 4) {
    handName = "Four of a Kind";
  } else if (counts[0] === 3 && counts[1] === 2) {
    handName = "Full House";
  } else if (isFlush) {
    handName = "Flush";
  } else if (isStraight) {
    handName = "Straight";
  } else if (counts[0] === 3) {
    handName = "Three of a Kind";
  } else if (counts[0] === 2 && counts[1] === 2) {
    handName = "Two Pair";
  } else if (counts[0] === 2) {
    handName = "One Pair";
  }

  if (handName === "High Card") {
    const highest = values[0];
    handName = `High ${VALUE_NAME[highest]}`;
  }

  return {
    status: "ok",
    hand: handName,
    cardsUsed: handCards,
  };
}
