import { Component } from '@angular/core';
import { SortEvent } from '../../projects/draggable/src/lib/interfaces';

@Component({
	selector : 'app-root',
	templateUrl : './app.component.html',
	styleUrls : ['./app.component.css']
})
export class AppComponent {
	title = 'ng-draggable';

	public sortableList : any[] = ['box 1', 'box 2', 'box 3', 'box 4'];

	sort (event : SortEvent) {
		console.warn('sort()', event);

		const current = this.sortableList[event.currentIndex];
		const swapWith = this.sortableList[event.newIndex];

		this.sortableList[event.newIndex] = current;
		this.sortableList[event.currentIndex] = swapWith;
	}
}
