import { Component, OnInit, Injectable } from '@angular/core';

import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {from} from 'rxjs/observable/from';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/merge';

// const AUTOCOMPLETE_URL = 'http://35.189.246.239:8080/cache/products';
const AUTOCOMPLETE_URL = 'http://localhost:8080/cache/products';
const WIKI_URL = 'https://en.wikipedia.org/w/api.php';
const PARAMS = new HttpParams({
  fromObject: {
    action: 'opensearch',
    format: 'json',
    origin: '*'
  }
});

@Injectable()
export class AutocompleteService {
  constructor(private http: HttpClient) {}

  // Returns an Observable...
  search(term: string) {
    if (term === '') {
      return of([]);
    }

    return this.http
      .get(AUTOCOMPLETE_URL + '/' + term);
  }
}

@Component({
  selector: 'app-searchbar',
  templateUrl: './app-searchbar.component.html',
  styleUrls: ['./app-searchbar.component.css'],
  providers: [AutocompleteService]
})
export class AppSearchbarComponent implements OnInit {

  model: any;
  data: any[];
  searching = false;
  searchFailed = false;
  selectedItem = -1;
  hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);

  constructor(private _autocompleteService: AutocompleteService) {}

  // Text input in the search field is delivered as an Observable<string>
  // Result is also an Observable...
  autocomplete = (text$: Observable<string>) => {
    return text$
    .debounceTime(300)
    .distinctUntilChanged()
    .do(() => this.searching = true)
    .switchMap(term =>
      this._autocompleteService.search(term)
        .do((data: any[]) => {
          this.data = data;
          this.searchFailed = false;
        })
        .map((element: any[]) => {
          return element.map(product => product['name']);
        })
        .catch(() => {
          this.searchFailed = true;
          return of([]);
        }))
    .do(() => this.searching = false)
    .merge(this.hideSearchingWhenUnsubscribed);
  }

  onSelectedItem = (selectedItem) => {
    console.log(selectedItem);
  }

  ngOnInit() {
  }
}
