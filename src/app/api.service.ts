import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  fetchData() {
    let url = "https://n21p4p5y4j.execute-api.eu-central-1.amazonaws.com/dev/load_profiles/?sector=Dienstleistungen%2FIT&weekend_prod=Yes&day=Werktag"
    return this.http.get(url);
  }
}
