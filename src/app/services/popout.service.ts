import { ComponentPortal, DomPortalOutlet } from '@angular/cdk/portal';
import { ApplicationRef, ComponentRef, Injectable, Injector, OnDestroy } from '@angular/core';
import { POPOUT_MODAL_DATA, POPOUT_MODALS, PopoutData, PopoutModalName } from './popout.tokens';
import { CustomerComponent } from '../customer/customer.component';
import { EmployerComponent } from '../employer/employer.component';

@Injectable({ providedIn: 'root' })
export class PopoutService implements OnDestroy {

  constructor(
    private injector: Injector,
    private applicationRef: ApplicationRef
  ) {}

  ngOnDestroy() {}

  openPopoutModal(data: PopoutData): void {
    const windowInstance = this.openOnce(data.modalName);
    this.createCDKPortal(data, windowInstance);
  }

  openOnce(target: string): Window {
    // window.open('', target) already provides a blank document with head and body
    return window.open('', target, '') as Window;
  }

  createCDKPortal(data: PopoutData, windowInstance: Window): void {
    if (!windowInstance) {
      return;
    }

    const outlet = new DomPortalOutlet(
      windowInstance.document.body,
      this.applicationRef,
      this.injector
    );

    // Copy all styles synchronously — no onload wait needed
    document.querySelectorAll('style').forEach(el => {
      windowInstance.document.head.appendChild(el.cloneNode(true));
    });
    document.querySelectorAll('link[rel="stylesheet"]').forEach(el => {
      windowInstance.document.head.appendChild(el.cloneNode(true));
    });

    // Attach the component immediately
    const injector = this.createInjector(data);
    let componentInstance: CustomerComponent | EmployerComponent | undefined;

    if (data.modalName === PopoutModalName.customerDetail) {
      windowInstance.document.title = 'Customer Modal';
      componentInstance = this.attachCustomerContainer(outlet, injector);
    }
    if (data.modalName === PopoutModalName.employerDetail) {
      windowInstance.document.title = 'Employer Modal';
      componentInstance = this.attachEmployerContainer(outlet, injector);
    }

    POPOUT_MODALS[data.modalName] = { windowInstance, outlet, componentInstance };
  }

  isPopoutWindowOpen(modalName: string): boolean {
    const modal = POPOUT_MODALS[modalName];
    return modal?.windowInstance && !modal.windowInstance.closed;
  }

  focusPopoutWindow(modalName: string): void {
    POPOUT_MODALS[modalName]?.windowInstance?.focus();
  }

  closePopoutModal(): void {
    Object.values(POPOUT_MODALS).forEach(modal => {
      modal?.windowInstance?.close();
    });
  }

  attachCustomerContainer(outlet: DomPortalOutlet, injector: Injector): CustomerComponent {
    const containerPortal = new ComponentPortal(CustomerComponent, null, injector);
    const containerRef: ComponentRef<CustomerComponent> = outlet.attach(containerPortal);
    return containerRef.instance;
  }

  attachEmployerContainer(outlet: DomPortalOutlet, injector: Injector): EmployerComponent {
    const containerPortal = new ComponentPortal(EmployerComponent, null, injector);
    const containerRef: ComponentRef<EmployerComponent> = outlet.attach(containerPortal);
    return containerRef.instance;
  }

  createInjector(data: PopoutData): Injector {
    return Injector.create({
      providers: [{ provide: POPOUT_MODAL_DATA, useValue: data }],
      parent: this.injector
    });
  }
}
