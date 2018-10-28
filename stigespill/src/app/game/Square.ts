export class Square {
  number: number;
  posX: number;
  posY: number;
  name: string;
  wormhole: number;
  wormholeUrl: string;
  links = new Array<object>();

  constructor(json: object) {
    this.name = json['name'];
    this.number = json['number'];
    this.links = json['links'];
    this.posX = json['posX'];
    this.posY = json['posY'];
    this.wormhole = json['wormhole'];
    this.wormholeUrl = json['wormholeUrl'];
  }



}
