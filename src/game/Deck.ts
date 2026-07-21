import { shuffle } from 'lodash';

export class Deck {
  public readonly cards: Array<{ suit: string; rank: string }>;
  public readonly suits: string[];
  public readonly ranks: string[];

  constructor() {
    this.suits = ['s', 'h', 'd', 'c'];
    this.ranks = [
      'A',
      'K',
      'Q',
      'J',
      '10',
      '9',
      '8',
      '7',
      '6',
      '5',
      '4',
      '3',
      '2',
    ];
    this.cards = this.createDeckAndShuffle();
  }

  createDeckAndShuffle() {
    let cards: Array<{ suit: string; rank: string }> = new Array();

    this.suits.forEach((suit) => {
      this.ranks.forEach((rank) => {
        cards.push({ suit, rank });
      });
    });

    for (let i = 0; i <= 7; i++) {
      cards = shuffle(cards);
    }

    return cards;
  }

  count() {
    return this.cards.length;
  }

  draw() {
    const count = this.count();
    if (count > 0)
      return this.cards.splice(Math.floor(Math.random() * count), 1)[0];
    else return null;
  }
}
