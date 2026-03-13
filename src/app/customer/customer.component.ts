import { Component, Inject } from '@angular/core';
import { POPOUT_MODAL_DATA, PopoutData } from '../services/popout.tokens';

@Component({
  selector: 'app-customer',
  standalone: true,
  templateUrl: './customer.component.html'
})
export class CustomerComponent {
  id: number;
  age: number;
  name: string;
  employer: string;

  constructor(@Inject(POPOUT_MODAL_DATA) public data: PopoutData) {
    this.id = data.id;
    this.age = data.age ?? 0;
    this.name = data.name;
    this.employer = data.employer ?? '';
  }
}
