# NgDraggable

엘리먼트를 드래그할 수 있는 기능을 제공하는 Angular 모듈입니다. 엘리먼트가 드래그 되는 영역을 제한하거나, 다른 엘리먼트 위로 드래그 되었을 때 이벤트를 발생하는 디렉티브도 제공합니다.

[예제](https://stackblitz.com/edit/ng-draggable)

## 사용방법

1. `ng-draggable-han` 패키지를 설치합니다.

	```
	yarn add ng-draggable-han
	```

1. `@NgModule`에 `DraggableModule`을 로드합니다.

	```typescript
    import { DraggableModule } from 'ng-draggable-han';
    
    @NgModule({
    	imports : [..., DraggableModule]
    })
    
    ```
    
1. 템플릿에 디렉티브를 적용합니다. `DraggableDirective`는 다음과 같이 적용합니다:

	```html
    <div class="box" ngDraggable (dragStart)="onDragStart($event)"></div>
    ```
    
1. 이벤트 핸들러를 정의합니다.

	```typescript
    class SomeComponent {
    	onDragStart (event : DragEvent) {
    		// do something
    	}
    }
    ```
    
## 공통 인터페이스

#### `Position`

x, y로 이루어진 좌표를 표현합니다.

```typescript
interface Position {
	x : number;
	y : number;
}
```

#### `Boundaries`
`MovableDirective`가 움직일 수 있는 영역을 제한할 때 사용합니다.

```typescript
interface Boundaries {
	minX : number;
	maxX : number;
	minY : number;
	maxY : number;
}
```

#### `DragEvent`

드래그 이벤트를 표현하며, `DraggableDirective`에서 발생합니다.

```typescript
interface DragEvent {
	start : Position; // 드래그가 시작된 좌표
	current : Position; // 현재 드래그 좌표
	target : HTMLElement; // 드래그가 시작된 HTMLElement

	movement : Position; // 드래그한 거리
}
```

#### `SortEvent`

정렬 이벤트를 표현하며, `SortableAreaDirective`에서 발생합니다. 정렬 대상은 `MovableDirective` 입니다.

```typescript
interface SortEvent {
	currentIndex : number; // 드래그가 시작된 항목의 인덱스
	newIndex : number; // 드래그하고 있는 HTMLElement가 이동할 인덱스
}
```

## 디렉티브

#### `DraggableDirective` (`[ngDraggable]`)

엘리먼트가 드래그에 반응하는 기능을 추가합니다.

```html
<div ngDraggable>react drag event</div>
```

* 프로퍼티
	- `@Input() ngMovable : boolean` : 드래그에 반응하는 기능을 활성화할지 지정합니다. (기본값 : `true`)
	
		```html
		<div ngDraggable>기본값 : true</div>
		<div [ngDraggable]="false">비활성화</div>
		<div [ngDraggable]="someFlag">플래그 값으로 조정</div>
		```

	- `isDragging : boolean` : 드래그 중인지 표현하는 플래그입니다. CSS 클래스 `dragging`를 적용하는 데에도 사용됩니다.

* 메소드

	- `clientRect() : DOMRect` : 엘리먼트의 DOMRect를 반환합니다. (내부적으로 `getBoundingClientRect()`를 사용합니다.)

* 이벤트

	- `dragStart : DragEvent` : 드래그 시작 이벤트
    	
    - `dragMove : DragEvent` : 드래그 이동 이벤트
    
    - `dragEnd : DragEvent` : 드래그 종료 이벤트

#### `MovableDirective` (`[ngMovable]`)

MovableDirective는 엘리먼트가 드래그에 반응해서 이동하는 기능을 추가합니다. 하지만 이 디렉티브가 적용된 엘리먼트가 직접 움직이지는 않습니다. 드래그 하는 동안 엘리먼트를 표시하기 위해 `MovableHelperDirective`를 함께 사용해야 합니다. 

```html
<div class="moveBox" ngMovable>
	<span>inner text</span>
	<ng-template ngMovableHelper></ng-template>
</div>
```

* 프로퍼티

	- `ngMovable : boolean` : 드래그에 반응하는 기능을 활성화할지 지정합니다. (기본값 : `true`)
	
		```html
		<div ngMovable>기본값 : true</div>
		<div [ngMovable]="false">비활성화</div>
		<div [ngMovable]="someFlag">플래그 값으로 조정</div>
		```
	- `@Input() reset : boolean` : 드래그가 끝난 후 엘리먼트를 원래 위치로 이동할지 지정합니다. (기본값 : `true`)
	
* 메소드

	- `setMovementBoundaries (boundaries : Boundaries)` : MovableDirective 엘리먼트가 이동하는 영역을 제한합니다. MovableAreaDirective에서 자동으로 사용합니다.
	
* CSS 클래스

	- `dragging` : 드래그 하는 동안 원래 엘리먼트와 복제 엘리먼트에 지정됩니다.
	
	- `dragSource` : 드래그 하는 동안 원래 엘리먼트에 지정됩니다.
	
	- `dragDummy` : 드래그 하는 동안 복제 엘리먼트에 지정됩니다.
	
	> 복제 엘리먼트는 `@angular/cdk/overlay`를 사용하기 때문에 원래 엘리먼트나 부모 엘리먼트의 하위 계층에 존재하지 않습니다. 복제 엘리먼트는 `<body>`에 렌더링됩니다.
	
> tip : `DraggableDirective`에서 발생한 `DragEvent`는 `MovableAreaDirective`에서도 받을 수 있습니다. 그래서 다음과 같이 사용하는 것도 가능합니다.

```html
<div ngMovableArea (dragEnd)="doSomething()">
	<div ngMovable></div>
</div>
```
		
#### `MovableHelperDirective` (`['ngMovableHelper]`)

MovableDirective 엘리먼트가 드래그되는 동안 화면에 복제본을 표시할 때 사용합니다.

#### `MovableAreaDirective` (`[ngMovableArea]`)

MovableDirective 엘리먼트가 이동할 수 있는 영역을 제한합니다. MovableDirective 엘리먼트는 MovableAreaDirective 엘리먼트 밖으로 이동할 수 없습니다.

```html
<div class="area" ngMovableArea>
	<div class="box" ngMovable [reset]="false">
		<ng-template ngMovableHelper></ng-template>
	</div>
</div>
```

#### `SortableAreaDirective` (`[ngSortableArea]`)

MovableDirective 엘리먼트가 다른 MovableDirective 엘리먼트 위로 이동하면 `SortEvent` 이벤트를 발생합니다.

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

* 이벤트

	- `sort : SortEvent` : 위치가 변경되는 것을 알리는 이벤트
