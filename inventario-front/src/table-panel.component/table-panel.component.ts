import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Catalogo, CatalogoService } from '../Service/catalogo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogService } from '../app/modals/dialog.service';

@Component({
  selector: 'app-table-panel',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './table-panel.component.html',
  styleUrl: './table-panel.component.css',
})
export class TablePanelComponent implements OnInit {

  componentes: Catalogo[] = [];
  ubicaciones: Catalogo[] = [];

  nuevoComponenteNombre: string = '';
  nuevaUbicacionNombre: string = '';

  filtroComponente: string = '';
  filtroUbicacion: string = '';
  ordenComponentesAsc: boolean = true; // true = A-Z, false = Z-A
  ordenUbicacionesAsc: boolean = true;
  constructor(
    private catalogoService: CatalogoService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private translate: TranslateService // Por si decides usar traducciones en los modales luego
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
  // --- LÓGICA DE FILTRADO Y ORDENACIÓN REACTIVA ---

  get componentesFiltrados(): Catalogo[] {
    let resultado = this.componentes;

    // 1. Filtrar por texto
    if (this.filtroComponente.trim()) {
      const termino = this.filtroComponente.toLowerCase();
      resultado = resultado.filter(c => c.nombre.toLowerCase().includes(termino));
    }

    // 2. Ordenar alfabéticamente
    return resultado.sort((a, b) => {
      const comparacion = a.nombre.localeCompare(b.nombre);
      return this.ordenComponentesAsc ? comparacion : -comparacion;
    });
  }

  get ubicacionesFiltradas(): Catalogo[] {
    let resultado = this.ubicaciones;

    // 1. Filtrar por texto
    if (this.filtroUbicacion.trim()) {
      const termino = this.filtroUbicacion.toLowerCase();
      resultado = resultado.filter(u => u.nombre.toLowerCase().includes(termino));
    }

    // 2. Ordenar alfabéticamente
    return resultado.sort((a, b) => {
      const comparacion = a.nombre.localeCompare(b.nombre);
      return this.ordenUbicacionesAsc ? comparacion : -comparacion;
    });
  }

  // Métodos para cambiar el orden al hacer clic en la cabecera
  toggleOrdenComponentes() {
    this.ordenComponentesAsc = !this.ordenComponentesAsc;
  }

  toggleOrdenUbicaciones() {
    this.ordenUbicacionesAsc = !this.ordenUbicacionesAsc;
  }
  // --- MÉTODOS PARA COMPONENTES ---

  agregarComponente() {
    if (!this.nuevoComponenteNombre) return;

    this.catalogoService.createComponente({ nombre: this.nuevoComponenteNombre }).subscribe({
      next: () => {
        this.nuevoComponenteNombre = '';
        this.cargarDatos();
        this.dialogService.openSuccess('¡Logrado!', 'Nuevo tipo de componente añadido.');
      },
    });
  }

  editarComponente(item: Catalogo) {
    // Reemplazamos el prompt() nativo por la modal interactiva
    const modalRef = this.dialogService.openPrompt(
      'Editar Componente',
      'Introduce el nuevo nombre para este tipo de componente:',
      'Nombre del componente',
      item.nombre,
      'Guardar',
      'Cancelar'
    );

    modalRef.result.then((nuevoNombre) => {
      if (nuevoNombre && nuevoNombre.trim() !== '' && nuevoNombre !== item.nombre) {
        this.catalogoService.updateComponente(item.id!, { nombre: nuevoNombre }).subscribe({
          next: () => {
            this.cargarDatos();
            this.dialogService.openSuccess('Actualizado', 'El componente se ha actualizado correctamente.');
          },

        });
      }
    }).catch(() => {
    });
  }

  eliminarComponente(id: number) {
    const modalRef = this.dialogService.openConfirm(
      '¿Estás seguro?',
      'Esta acción eliminará permanentemente el tipo de componente.'
    );

    modalRef.result.then((result) => {
      if (result === 'confirmed') {
        this.catalogoService.deleteComponente(id).subscribe({
          next: () => {
            this.cargarDatos();
            this.dialogService.openSuccess('Eliminado', 'El tipo de componente ha sido borrado.');
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
        this.dialogService.openSuccess('¡Logrado!', 'Nueva ubicación añadida.');
      },
    });
  }

  editarUbicacion(item: Catalogo) {
    // Reemplazamos el prompt() nativo
    const modalRef = this.dialogService.openPrompt(
      'Editar Ubicación',
      'Introduce el nuevo nombre para esta ubicación:',
      'Nombre de la ubicación',
      item.nombre,
      'Guardar',
      'Cancelar'
    );

    modalRef.result.then((nuevoNombre) => {
      if (nuevoNombre && nuevoNombre.trim() !== '' && nuevoNombre !== item.nombre) {
        this.catalogoService.updateUbicacion(item.id!, { nombre: nuevoNombre }).subscribe({
          next: () => {
            this.cargarDatos();
            this.dialogService.openSuccess('Actualizada', 'La ubicación se ha actualizado correctamente.');
          },
        });
      }
    }).catch(() => {});
  }

  eliminarUbicacion(id: number) {
    // Reemplazamos el confirm() nativo
    const modalRef = this.dialogService.openConfirm(
      '¿Estás seguro?',
      'Esta acción eliminará permanentemente la ubicación.'
    );

    modalRef.result.then((result) => {
      if (result === 'confirmed') {
        this.catalogoService.deleteUbicacion(id).subscribe({
          next: () => {
            this.cargarDatos();
            this.dialogService.openSuccess('Eliminada', 'La ubicación ha sido borrada.');
          },
        });
      }
    }).catch(() => {});
  }
}
