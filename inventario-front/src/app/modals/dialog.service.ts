import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SharedDialogComponent } from './shared-dialog/shared-dialog.component';
import { DialogData } from './dialog-data.interface-module';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private modalService: NgbModal) {}

  private openModal(data: DialogData, size: 'sm' | 'md' = 'md'): NgbModalRef {
    const modalRef = this.modalService.open(SharedDialogComponent, {
      centered: true,
      backdrop: 'static',
      size: size
    });

    // Pasamos la interfaz de datos al componente
    modalRef.componentInstance.data = data;
    return modalRef;
  }

  openConfirm(title: string, message: string): NgbModalRef {
    const data: DialogData = { type: 'confirm', title, message, confirmText: 'Sí, continuar' };
    return this.openModal(data);
  }

  openSuccess(title: string, message: string): void {
    const data: DialogData = { type: 'success', title, message };
    this.openModal(data, 'sm');
  }

  openError(title: string, message: string): void {
    const data: DialogData = { type: 'error', title, message };
    this.openModal(data, 'sm');
  }

  closeAll(): void {
    this.modalService.dismissAll();
  }
  // Añade este método dentro de tu DialogService
openPrompt(
  title: string,
  message: string,
  inputLabel: string,
  initialValue: string,
  confirmText: string,
  cancelText: string
): NgbModalRef {
  const data: DialogData = {
    type: 'prompt',
    title,
    message,
    inputLabel,
    inputValue: initialValue,
    confirmText,
    cancelText
  };
  return this.openModal(data);
}
}
