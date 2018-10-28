export class Player {
  id: number;
  name: string;
  pos: number;
  color: string;
  numOfDiceRolls;

  constructor(id: number) {
    this.id = id;
    this.name = "P" + id;
    this.pos = 1;
    this.color = this.getRandomColor();
    this.numOfDiceRolls = 0;
  }

  getRandomColor() {
   return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
  }
}
