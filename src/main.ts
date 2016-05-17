import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { HTTP_BINDINGS } from '@angular/http';
import { ROUTER_PROVIDERS } from '@angular/router';

import { AppComponent } from './app/app.component';
import { CurrentUser, FirebaseData } from './app/shared/shared';

bootstrap(AppComponent, [
	CurrentUser,
	FirebaseData,
	ROUTER_PROVIDERS
]);