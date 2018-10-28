import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameserviceService {
  private baseUrl: string;
  constructor(private client: HttpClient) {
    this.baseUrl = "https://visningsrom.stacc.com/dd_server_worms/rest/boards/2/"
  }


  getBoard(): Observable<object> {
    return this.client.get(this.baseUrl);
  }

  getSquare(id: number): Observable<object> {
    return this.client.get(this.baseUrl + id);
  }
}
