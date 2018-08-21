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
	clientX : number;
	clientY : number;
}

export interface SortEvent {
	currentIndex : number;
	newIndex : number;
}
