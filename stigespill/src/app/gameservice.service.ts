import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameserviceService {
  constructor(private client: HttpClient) {
  }


  getBoard(): Observable<object> {
    return this.client.get("https://visningsrom.stacc.com/dd_server_worms/rest/boards/2/1");
  }
}
