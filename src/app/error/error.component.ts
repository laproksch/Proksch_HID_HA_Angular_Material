import { Component } from '@angular/core';
import { ErrorService } from '../shared/error.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {
  error$ = this.errorService.errors$();

  constructor(private readonly errorService: ErrorService) {}
}
