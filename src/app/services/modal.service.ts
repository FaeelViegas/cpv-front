import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private activeModals: { [modalId: string]: boolean } = {};

  constructor() { }

  openModal(modalId: string) {
    this.activeModals[modalId] = true;
  }

  closeModal(modalId: string) {
    this.activeModals[modalId] = false;
  }

  isModalOpen(modalId: string) {
    return this.activeModals[modalId];
  }
}
