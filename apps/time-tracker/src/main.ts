import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';


async function loadConfig(): Promise<void> {
  console.log('Loading configuration file');
  const response = await fetch('assets/config.json');
  const config = await response.json();

  environment.serverUrl = config.serverUrl;
  environment.auth0.audience = config.auth0Audience;
  environment.auth0.clientId = config.auth0ClientId;
  environment.auth0.domain = config.auth0Domain;
}

loadConfig()
  .then(() => {
    if (environment.production) {
      enableProdMode();
    }

    return platformBrowserDynamic().bootstrapModule(AppModule);
  })
  .catch(err => console.error(err));
