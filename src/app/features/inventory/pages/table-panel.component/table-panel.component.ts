import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Catalogo, CatalogoService } from '../../services/catalogo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogService } from '../../../../modals/dialog.service';

@Component({
  selector: 'app-table-panel',
  standalone: true, // Asegúrate de que coincida con tu configuración
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './table-panel.component.html',
  styleUrl: './table-panel.component.css',
  providers: [CatalogoService]
})
export class TablePanelComponent implements OnInit {

  componentes: Catalogo[] = [];
  ubicaciones: Catalogo[] = [];

  nuevoComponenteNombre: string = '';
  nuevaUbicacionNombre: string = '';

  filtroComponente: string = '';
  filtroUbicacion: string = '';
  ordenComponentesAsc: boolean = true; 
  ordenUbicacionesAsc: boolean = true;

  constructor(
    private catalogoService: CatalogoService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private translate: TranslateService 
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.catalogoService.getComponentes().subscribe(data => {
      this.componentes = data;
      this.cdr.detectChanges();
    });

    this.catalogoService.getUbicaciones().subscribe(data => {
      this.ubicaciones = data;
      this.cdr.detectChanges();
    });
  }

  // --- LÓGICA DE FILTRADO Y ORDENACIÓN ---

  get componentesFiltrados(): Catalogo[] {
    let resultado = [...this.componentes];
    if (this.filtroComponente.trim()) {
      const termino = this.filtroComponente.toLowerCase();
      resultado = resultado.filter(c => c.nombre.toLowerCase().includes(termino));
    }
    return resultado.sort((a, b) => {
      const comparacion = a.nombre.localeCompare(b.nombre);
      return this.ordenComponentesAsc ? comparacion : -comparacion;
    });
  }

  get ubicacionesFiltradas(): Catalogo[] {
    let resultado = [...this.ubicaciones];
    if (this.filtroUbicacion.trim()) {
      const termino = this.filtroUbicacion.toLowerCase();
      resultado = resultado.filter(u => u.nombre.toLowerCase().includes(termino));
    }
    return resultado.sort((a, b) => {
      const comparacion = a.nombre.localeCompare(b.nombre);
      return this.ordenUbicacionesAsc ? comparacion : -comparacion;
    });
  }

  toggleOrdenComponentes() { this.ordenComponentesAsc = !this.ordenComponentesAsc; }
  toggleOrdenUbicaciones() { this.ordenUbicacionesAsc = !this.ordenUbicacionesAsc; }

  // --- MÉTODOS PARA COMPONENTES ---

  agregarComponente() {
    if (!this.nuevoComponenteNombre) return;

    this.catalogoService.createComponente({ nombre: this.nuevoComponenteNombre }).subscribe({
      next: () => {
        this.nuevoComponenteNombre = '';
        this.cargarDatos();
        this.dialogService.openSuccess('MODALS.SUCCESS', 'CATALOGO.COMPONENTES.ADD_SUCCESS');
    
      }
    });
  }

  editarComponente(item: Catalogo) {
    const modalRef = this.dialogService.openPrompt(
      'CATALOGO.COMPONENTES.EDIT_TITLE',
      'CATALOGO.COMPONENTES.EDIT_MSG',
      'CATALOGO.COMPONENTES.INPUT_LABEL',
      item.nombre,
      'SHARED.SAVE',
      'SHARED.CANCEL'
    );

    modalRef.result.then((nuevoNombre) => {
      if (nuevoNombre && nuevoNombre.trim() !== '' && nuevoNombre !== item.nombre) {
        this.catalogoService.updateComponente(item.id!, { nombre: nuevoNombre }).subscribe({
          next: () => {
            this.cargarDatos();
            this.dialogService.openSuccess('MODALS.UPDATED', 'CATALOGO.COMPONENTES.UPDATE_SUCCESS');
          },
        });
      }
    }).catch(() => {});
  }

  eliminarComponente(id: number) {
    const modalRef = this.dialogService.openConfirm(
      'MODALS.CONFIRM_TITLE',
      'CATALOGO.COMPONENTES.DELETE_MSG'
    );

    modalRef.result.then((result) => {
      if (result === 'confirmed') {
        this.catalogoService.deleteComponente(id).subscribe({
          next: () => {
            this.cargarDatos();
            this.dialogService.openSuccess('MODALS.DELETED', 'CATALOGO.COMPONENTES.DELETE_SUCCESS');
          },
        });
      }
    }).catch(() => {});
  }

  // --- MÉTODOS PARA UBICACIONES ---

  agregarUbicacion() {
    if (!this.nuevaUbicacionNombre.trim()) return;

    this.catalogoService.createUbicacion({ nombre: this.nuevaUbicacionNombre }).subscribe({
      next: () => {
        this.nuevaUbicacionNombre = '';
        this.cargarDatos();
        this.dialogService.openSuccess('MODALS.SUCCESS', 'CATALOGO.UBICACIONES.ADD_SUCCESS');
      },
    });
  }

  editarUbicacion(item: Catalogo) {
    const modalRef = this.dialogService.openPrompt(
      'CATALOGO.UBICACIONES.EDIT_TITLE',
      'CATALOGO.UBICACIONES.EDIT_MSG',
      'CATALOGO.UBICACIONES.INPUT_LABEL',
      item.nombre,
      'SHARED.SAVE',
      'SHARED.CANCEL'
    );

    modalRef.result.then((nuevoNombre) => {
      if (nuevoNombre && nuevoNombre.trim() !== '' && nuevoNombre !== item.nombre) {
        this.catalogoService.updateUbicacion(item.id!, { nombre: nuevoNombre }).subscribe({
          next: () => {
            this.cargarDatos();
            this.dialogService.openSuccess('MODALS.UPDATED', 'CATALOGO.UBICACIONES.UPDATE_SUCCESS');
          },
        });
      }
    }).catch(() => {});
  }

  eliminarUbicacion(id: number) {
    const modalRef = this.dialogService.openConfirm(
      'MODALS.CONFIRM_TITLE',
      'CATALOGO.UBICACIONES.DELETE_MSG'
    );

    modalRef.result.then((result) => {
      if (result === 'confirmed') {
        this.catalogoService.deleteUbicacion(id).subscribe({
          next: () => {
            this.cargarDatos();
            this.dialogService.openSuccess('MODALS.DELETED', 'CATALOGO.UBICACIONES.DELETE_SUCCESS');
          },
        });
      }
    }).catch(() => {});
  }
}