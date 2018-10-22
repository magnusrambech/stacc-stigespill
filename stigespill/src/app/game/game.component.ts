import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { GameserviceService } from '../gameservice.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  gameservice: GameserviceService;

  constructor(httpclient: HttpClientModule, gameservice: GameserviceService) {
    this.gameservice = gameservice;
  }

  ngOnInit() {
  }


  getBoard(): void {
    this.gameservice.getBoard().subscribe(json => {
      console.log(json);
    });
  }

}
