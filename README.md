# NgDraggable

Angular module to drag element. Also provide some directives restricting drag area, emitting sort event while dragging.

[한국어](https://github.com/han41858/ng-draggable/blob/master/README-KR.md)

[DEMO](https://stackblitz.com/edit/ng-draggable)

## Usage

1. install `ng-draggable-han` package.

	```
	yarn add ng-draggable-han
	```

1. import `DraggableModule` to `@NgModule`.

	```typescript
    import { DraggableModule } from 'ng-draggable-han';
    
    @NgModule({
    	imports : [..., DraggableModule]
    })
    
    ```
    
1. Add directive to template. For example, `DraggableDirective` is used by:

	```html
    <div class="box" ngDraggable (dragStart)="onDragStart($event)"></div>
    ```
    
1. Add event handler.

	```typescript
    class SomeComponent {
    	onDragStart (event : DragEvent) {
    		// do something
    	}
    }
    ```
    
## Common Interfaces

#### `Position`

Represents the coordinates of x, y.

```typescript
interface Position {
	x : number;
	y : number;
}
```

#### `Boundaries`

Restrict area of elements using `MovableDirective`.

```typescript
interface Boundaries {
	minX : number;
	maxX : number;
	minY : number;
	maxY : number;
}
```

#### `DragEvent`

Represent drag event, emitted by `DraggableDirective`.

```typescript
interface DragEvent {
	start : Position; // position of starting drag
	current : Position; // position of current drag
	target : HTMLElement; // dragging HTMLElement

	movement : Position; // offsets while drag
}
```

#### `SortEvent`

Represent sort event, emitted by `SortableAreaDirective`. Targets are `MovableDirective`.

```typescript
interface SortEvent {
	currentIndex : number; // index of starting drag element
	newIndex : number; // index of sort target
}
```

## Directives

#### `DraggableDirective` (`[ngDraggable]`)

Add draggable interaction to element.

```html
<div ngDraggable>react drag event</div>
```

* Properties

	- `@Input() ngMovable : boolean` : Switch of drag interaction. (default: true)
	
		```html
		<div ngDraggable>default : true</div>
		<div [ngDraggable]="false">disabled</div>
		<div [ngDraggable]="someFlag">set by flag</div>
		```

	- `isDragging : boolean` : Represents element is dragging now. This flag used to set `dragging` CSS class.

* Methods

	- `clientRect() : DOMRect` : Returns DOMRect of element. (internally use `getBoundingClientRect()`)

* Events

	- `dragStart : DragEvent` : Drag start event
    	
    - `dragMove : DragEvent` : Drag move event
    
    - `dragEnd : DragEvent` : Drag end event

#### `MovableDirective` (`[ngMovable]`)

Add draggable interaction & moving element copied. Element added this directives not moving in real. If you want to display moving element, use `MovableHelperDirective` together. 

```html
<div class="moveBox" ngMovable>
	<span>inner text</span>
	<ng-template ngMovableHelper></ng-template>
</div>
```

* Properties

	- `ngMovable : boolean` : Switch of drag interaction, (default : true)
	
		```html
		<div ngMovable>default : true</div>
		<div [ngMovable]="false">disabled</div>
		<div [ngMovable]="someFlag">set by flag</div>
		```
	- `@Input() reset : boolean` : Switch of resetting position. If set, returns to original position. (true : `true`)
	
* Methods

	- `setMovementBoundaries (boundaries : Boundaries)` : Restrict moving area of `MovableDirective`. Called by `MovableAreaDirective`.
	
* CSS Classes

	- `dragging` : Added to original/copied element while dragging.
	
	- `dragSource` : Added to original element while dragging.
	
	- `dragDummy` : Added to copied element while dragging.
	
	> Copied element does not exist in original element / original's parent element. This directive uses `@angular/cdk/overlay`, so, copied element rendered in `<body>` element.
		
#### `MovableHelperDirective` (`['ngMovableHelper]`)

Display copied element of `MovableDirective` while dragging.

#### `MovableAreaDirective` (`[ngMovableArea]`)

Restrict area of child `MovableDirective`. `MovableDirective` element can't move out of `MovableAreaDirective`.

```html
<div class="area" ngMovableArea>
	<div class="box" ngMovable [reset]="false">
		<ng-template ngMovableHelper></ng-template>
	</div>
</div>
```

#### `SortableAreaDirective` (`[ngSortableArea]`)

Emit `SortEvent` if one `MovableDirective` moved over another `MovableDirective` element in `SortableAreaDirective`.

```html
<div class="area sortable" ngSortableArea (sort)="sort($event)">
	<div class="box" ngMovable *ngFor="let box of sortableList">
		<span>{{ box }}</span>
		<ng-template ngMovableHelper></ng-template>
	</div>
</div>
```

```typescript
export class AppComponent {
	title = 'ng-draggable';

	public sortableList : any[] = ['box 1', 'box 2', 'box 3', 'box 4'];

	sort (event : SortEvent) {
		const current = this.sortableList[event.currentIndex];
		const swapWith = this.sortableList[event.newIndex];

		this.sortableList[event.newIndex] = current;
		this.sortableList[event.currentIndex] = swapWith;
	}
}
```

* Events

	- `sort : SortEvent` : Represent emitting sort condition.
