import { Component, OnInit, Injectable } from '@angular/core';

import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/merge';

const AUTOCOMPLETE_URL = 'http://35.189.246.239:8080/cache/products';
const WIKI_URL = 'https://en.wikipedia.org/w/api.php';
const PARAMS = new HttpParams({
  fromObject: {
    action: 'opensearch',
    format: 'json',
    origin: '*'
  }
});

@Injectable()
export class WikipediaService {
  constructor(private http: HttpClient) {}

  search(term: string) {
    if (term === '') {
      return of([]);
    }

    return this.http
      .get(WIKI_URL, {params: PARAMS.set('search', term)})
      .map(response => response[1]);
  }
}

@Injectable()
export class AutocompleteService {
  constructor(private http: HttpClient) {}

  search(term: string) {
    if (term === '') {
      return of([]);
    }

    return this.http
      .get(AUTOCOMPLETE_URL + '/' + term)
      .map(response => response[1]);
  }
}

@Component({
  selector: 'app-searchbar',
  templateUrl: './app-searchbar.component.html',
  styleUrls: ['./app-searchbar.component.css'],
  providers: [WikipediaService, AutocompleteService]
})
export class AppSearchbarComponent implements OnInit {

  model: any;
  searching = false;
  searchFailed = false;
  hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);

  constructor(private _wikiService: WikipediaService, private _autocompleteService: AutocompleteService) {}

  search = (text$: Observable<string>) => {
    return text$
    .debounceTime(300)
    .distinctUntilChanged()
    .do(() => this.searching = true)
    .switchMap(term =>
      this._wikiService.search(term)
        .do(() => this.searchFailed = false)
        .catch(() => {
          this.searchFailed = true;
          return of([]);
        }))
    .do(() => this.searching = false)
    .merge(this.hideSearchingWhenUnsubscribed);
  }

  autocomplete = (text$: Observable<string>) => {
    return text$
    .debounceTime(300)
    .distinctUntilChanged()
    .do(() => this.searching = true)
    .switchMap(term =>
      this._autocompleteService.search(term)
        .do(() => this.searchFailed = false)
        .catch(() => {
          this.searchFailed = true;
          return of([]);
        }))
    .do(() => this.searching = false)
    .merge(this.hideSearchingWhenUnsubscribed);
  }

  ngOnInit() {
  }
}
