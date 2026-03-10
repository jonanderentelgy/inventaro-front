import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogData } from '../dialog-data.interface-module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shared-dialog',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './shared-dialog.component.html',
  styleUrl: './shared-dialog.component.css'
})
export class SharedDialogComponent {
  // En ng-bootstrap, pasamos los datos mediante Inputs
  @Input() data!: DialogData;
  isLoading = false;

  constructor(public activeModal: NgbActiveModal) {}

  onCancel(): void {
    if (!this.isLoading) {
      this.activeModal.dismiss(false); // dismiss para cancelar
    }
  }

  onConfirm(): void {
    // Si es edición, cerramos el modal y devolvemos el valor modificado del input
    if (this.data.type === 'prompt') {
      this.isLoading = true;
      this.activeModal.close(this.data.inputValue);
      return;
    }

    if (this.data.type !== 'confirm') {
      this.activeModal.close(true);
      return;
    }

    this.isLoading = true;
    this.activeModal.close('confirmed');
  }
  // Helper para colores de Bootstrap
  getHeaderClass(): string {
    if (this.data.type === 'success') return 'bg-success text-white';
    if (this.data.type === 'error') return 'bg-danger text-white';
    return 'bg-primary text-white';
  }
}
