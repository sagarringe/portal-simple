import { Component, HostListener } from '@angular/core';
import { POPOUT_MODALS, PopoutData, PopoutModalName } from './services/popout.tokens';
import { PopoutService } from './services/popout.service';

interface CustomerDetail {
  id: number;
  age: number;
  employer: string;
}

interface CompanyDetail {
  id: number;
  founded: number;
  employeeCount: number;
  description: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  customerDetails: Record<string, CustomerDetail> = {
    Jessica: { id: 1111, age: 35, employer: 'ABCD Bank' },
    Mark: { id: 2222, age: 45, employer: 'XY Holdings' }
  };

  companyDetails: Record<string, CompanyDetail> = {
    'ABCD Bank': {
      id: 2020,
      founded: 1982,
      employeeCount: 20000,
      description: 'ABCD Bank provides wide variety of innovative banking products and services. ' +
        'We are located in several regions of California and Florida.'
    },
    'XY Holdings': {
      id: 2021,
      founded: 2000,
      employeeCount: 10000,
      description: 'XY Holdings Ltd. provides hosting services, custom software solutions, and an import/export division.'
    }
  };

  constructor(private popoutService: PopoutService) {}

  @HostListener('window:beforeunload')
  onWindowClose(): void {
    this.popoutService.closePopoutModal();
  }

  openCustomerPopout(name: string): void {
    const modalData: PopoutData = {
      modalName: PopoutModalName.customerDetail,
      name,
      id: this.customerDetails[name].id,
      age: this.customerDetails[name].age,
      employer: this.customerDetails[name].employer
    };

    const { modalName } = modalData;

    if (!this.popoutService.isPopoutWindowOpen(modalName)) {
      this.popoutService.openPopoutModal(modalData);
    } else {
      const sameCustomer = POPOUT_MODALS[modalName]?.componentInstance?.name === name;
      // When popout modal is open and there is no change in data, focus on popout modal
      if (sameCustomer) {
        this.popoutService.focusPopoutWindow(modalName);
      } else {
        POPOUT_MODALS[modalName].outlet.detach();
        const injector = this.popoutService.createInjector(modalData);
        POPOUT_MODALS[modalName].componentInstance = this.popoutService.attachCustomerContainer(POPOUT_MODALS[modalName].outlet, injector);
        this.popoutService.focusPopoutWindow(modalName);
      }
    }
  }

  openEmployerPopout(name: string): void {
    const modalData: PopoutData = {
      modalName: PopoutModalName.employerDetail,
      name,
      id: this.companyDetails[name].id,
      description: this.companyDetails[name].description,
      founded: String(this.companyDetails[name].founded),
      employeeCount: String(this.companyDetails[name].employeeCount)
    };

    const { modalName } = modalData;

    if (!this.popoutService.isPopoutWindowOpen(modalName)) {
      this.popoutService.openPopoutModal(modalData);
    } else {
      const sameCustomer = POPOUT_MODALS[modalName]?.componentInstance?.name === name;
      // When popout modal is open and there is no change in data, focus on popout modal
      if (sameCustomer) {
        this.popoutService.focusPopoutWindow(modalName);
      } else {
        POPOUT_MODALS[modalName].outlet.detach();
        const injector = this.popoutService.createInjector(modalData);
        POPOUT_MODALS[modalName].componentInstance = this.popoutService.attachEmployerContainer(POPOUT_MODALS[modalName].outlet, injector);
        this.popoutService.focusPopoutWindow(modalName);
      }
    }
  }
}
