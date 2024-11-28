import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { ComponentTone } from 'src/app/util/tone';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() modalId: string = '';
  @Input() title: string = 'Modal Title';
  @Input() tone: ComponentTone = "neutral";
  @Input() buttonLabel: string = 'Salvar';
  @Input() disabled: boolean = false;
  @Input() hidden: boolean = false;
  @Output() onSubmit: EventEmitter<void> = new EventEmitter<void>();
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();

  constructor(public modalService: ModalService) { }

  openModal() {
    this.modalService.openModal(this.modalId);
  }

  closeModal() {
    this.modalService.closeModal(this.modalId);
    this.onClose.emit();
  }

  submit() {
    this.onSubmit.emit();
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    if (this.modalService.isModalOpen(this.modalId)) {
      this.closeModal();
    }
  }
}

