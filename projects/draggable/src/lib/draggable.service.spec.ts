import { inject, TestBed } from '@angular/core/testing';

import { DraggableService } from './draggable.service';

describe('DraggableService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers : [DraggableService]
		});
	});

	it('should be created', inject([DraggableService], (service : DraggableService) => {
		expect(service).toBeTruthy();
	}));
});
