import { Component, Inject } from '@angular/core';
import { POPOUT_MODAL_DATA, PopoutData } from '../services/popout.tokens';

@Component({
  selector: 'app-employer',
  standalone: true,
  templateUrl: './employer.component.html'
})
export class EmployerComponent {
  id: number;
  name: string;
  founded: string;
  employeeCount: string;
  description: string;

  constructor(@Inject(POPOUT_MODAL_DATA) public data: PopoutData) {
    this.id = data.id;
    this.name = data.name;
    this.founded = data.founded ?? '';
    this.employeeCount = data.employeeCount ?? '';
    this.description = data.description ?? '';
  }
}
