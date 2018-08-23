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

export interface DragSnapshot {
	position : Position;
	target : HTMLElement;
}

export interface DragInfo {
	start : Position;
	current : Position;
	target : HTMLElement;
}

// TODO: deprecate
export interface DragEvent {
	clientX : number;
	clientY : number;
	movementX : number;
	movementY : number;
}

export interface SortEvent {
	currentIndex : number;
	newIndex : number;
}
