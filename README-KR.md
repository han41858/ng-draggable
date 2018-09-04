# NgDraggable

엘리먼트를 드래그할 수 있는 기능을 제공하는 모듈입니다.

## 사용방법

1. `ng-draggable-han` 패키지를 설치합니다.
	```
	yarn add ng-draggable-han
	```

1. `NgModule`에 `DraggableModule`을 로드합니다.
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

### `Position`

좌표를 표현합니다.

```typescript
interface Position {
	x : number;
	y : number;
}
```

### `Boundaries`
`MovableDirective`가 움직일 수 있는 영역을 제한할 때 사용합니다.

```typescript
interface Boundaries {
	minX : number;
	maxX : number;
	minY : number;
	maxY : number;
}
```

### `DragEvent`

드래그 이벤트를 표현하며, `DraggableDirective`에서 발생합니다.

```typescript
interface DragEvent {
	start : Position; // 드래그가 시작된 좌표
	current : Position; // 현재 드래그 좌표
	target : HTMLElement; // 드래그가 시작된 HTMLElement

	movement : Position; // 드래그한 거리
}
```

### `SortEvent`

정렬 이벤트를 표현하며, `SortableAreaDirective`에서 발생합니다.

```typescript
interface SortEvent {
	currentIndex : number; // 드래그가 시작된 항목의 인덱스
	newIndex : number; // 드래그하고 있는 HTMLElement가 이동할 인덱스
}
```

## 디렉티브

### `DraggableDirective` : `[ngDraggable]`

엘리먼트가 드래그에 반응하는 기능을 추가합니다.

```html
<div ngDraggable>react drag event</div>
```

* 프로퍼티

	- `isDragging : boolean` : 드래그 중인지 표현하는 플래그입니다. CSS 클래스 `dragging`를 적용하는 데에도 사용됩니다.

* 메소드

	- `clientRect() : DOMRect` : 엘리먼트의 DOMRect를 반환합니다. (내부적으로 `getBoundingClientRect()`를 사용합니다.)

* 이벤트

	- `dragStart : DragEvent` : 드래그 시작 이벤트
    	
    - `dragMove : DragEvent` : 드래그 이동 이벤트
    
    - `dragEnd : DragEvent` : 드래그 종료 이벤트
