import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { APP_SETTINGS } from '../settings';

@Injectable()
export class AppLoadService {

  constructor(private httpClient: HttpClient) { }

  initializeApp(): Promise<any> {
    return new Promise((resolve, reject) => {
          console.log('initializeApp:: inside promise');

          setTimeout(() => {
            console.log('initializeApp:: inside setTimeout');
            // doing something
            resolve();
          }, 10);
        });
  }

  getSettings(): Promise<any> {
    console.log('getSettings:: before http.get call');

    const promise = this.httpClient.get('/settings')
      .toPromise()
      .then(settings => {
        console.log('Settings from /settings: ', settings);

        APP_SETTINGS.gitTag = settings['tag'];

        console.log('APP_SETTINGS: ', APP_SETTINGS);

        return settings;
      })
      .catch((reason) => {
        console.error(reason);
      });

    return promise;
  }

  getIpInfo(): Promise<any> {
    console.log('getSettings:: before http.get call');

    const promise = this.httpClient.get('http://ipinfo.io/geo')
      .toPromise()
      .then(settings => {
        console.log('Settings from ipinfo.io/geo: ', settings);

        APP_SETTINGS.country = settings['country'];
        if (APP_SETTINGS.country === 'ES' || APP_SETTINGS.country === 'FR') {
            APP_SETTINGS.area = 'eu';
            APP_SETTINGS.autosuggestServiceURl = 'http://eu.cache.apps.viralmar.es:8080/' + APP_SETTINGS.autosuggestServiceURi;
            APP_SETTINGS.catalogServiceUrl = 'http://eu.catalog.apps.viralmar.es:8080/' + APP_SETTINGS.catalogServiceUri;
        } else {
            APP_SETTINGS.area = 'us';
            APP_SETTINGS.autosuggestServiceURl = 'http://us.cache.apps.viralmar.es:8080/' + APP_SETTINGS.autosuggestServiceURi;
            APP_SETTINGS.catalogServiceUrl = 'http://us.catalog.apps.viralmar.es:8080/' + APP_SETTINGS.catalogServiceUri;
        }

        console.log('APP_SETTINGS: ', APP_SETTINGS);

        return settings;
      });

    return promise;
  }
}
