import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { DraggableModule } from '../../projects/draggable/src/lib/draggable.module';

@NgModule({
	declarations : [
		AppComponent
	],
	imports : [
		BrowserModule,

		DraggableModule
	],
	providers : [],
	bootstrap : [AppComponent]
})
export class AppModule {
}
