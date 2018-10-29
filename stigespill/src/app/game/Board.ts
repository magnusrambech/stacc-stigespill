export class Board {
  id: number;
  name: string;
  description: string;
  size: string;
  dimX: number;
  dimY: number;
  start: number;
  goal: number

  constructor(json: object) {
    this.id = json['id'];
    this.description = json['description'];
    this.dimX = json['dimX'];
    this.dimY = json['dimY'];
    this.goal = json['goal'];
    this.name = json['name'];
    this.size = json['size'];
    this.start = json['start'];
  }


}
