export interface Position {
	x : number;
	y : number;
}

export interface Boundaries {
	minX : number;
	maxX : number;
	minY : number;
	maxY : number;
}

export interface DragEvent {
	start : Position;
	current : Position;
	target : HTMLElement;

	movement : Position;
}

export interface SortEvent {
	currentIndex : number;
	newIndex : number;
}
