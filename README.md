# NgDraggable

Angular module that provides the ability to drag the element. It also limits the area where the element is dragging, or provides a directive that occurs when it is dragged over other elements.

[한국어](https://github.com/han41858/ng-draggable/blob/master/README-KR.md)

[DEMO](https://stackblitz.com/edit/ng-draggable)

## Usage

1. Install `ng-draggable-han` package.

	```
	yarn add ng-draggable-han
	```

1. Import `DraggableModule` to `@NgModule`.

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

Use to limit the area where `MobableDirective` can move.

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

Adds the ability to respond to the drag by the element.

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

The `MovableDirective` adds the ability for the element to move in response to the drag, but the element with this directive does not move directly. You must use `MovebleHelperDirective` to display the element during dragging.

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

	- `dragging` : Added to original/replica element during dragging.
	
	- `dragSource` : Added to original element during dragging.
	
	- `dragDummy` : Added to replica element during dragging.
	
	> The replication element does not exist in the lower layer of the original element or parent element because it uses `@angular/cdk/overlay`. The replication element is rendered to the `<body>`.
	
> tip : `DragEvent` in `DraggableDirective` can also be received in `MovableAreaDirective`. So it's possible to use it as follows.

```html
<div ngMovableArea (dragEnd)="doSomething()">
	<div ngMovable></div>
</div>
```
		
#### `MovableHelperDirective` (`['ngMovableHelper]`)

Use to display replicas on the screen while the `MovableDirective` Element is being dragged.

#### `MovableAreaDirective` (`[ngMovableArea]`)

Limits the area where the `MovableDirective` element can move. The `MovableDirective` element cannot be moved out of the `MovableAreaDirective` element.

```html
<div class="area" ngMovableArea>
	<div class="box" ngMovable [reset]="false">
		<ng-template ngMovableHelper></ng-template>
	</div>
</div>
```

#### `SortableAreaDirective` (`[ngSortableArea]`)

When the `MovableDirective` element moves over another `MovableDirective` element, a `SortEvent` event occurs.

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
