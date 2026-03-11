import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { InventoryService } from '../../services/inventory.service';
import { TranslateModule } from '@ngx-translate/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// 1. Importa el servicio de diálogos
import { DialogService } from '../../../../modals/dialog.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  imports: [CommonModule, FormsModule, TranslateModule],
    providers: [InventoryService]
})
export class InventoryComponent implements OnInit {
  // Variables de estado
  componentes: any[] = [];
  tipos: any[] = [];
  ubicaciones: any[] = [];
  filtroTexto: string = '';
  cargando: boolean = false;

  // Modelo Formulario Nuevo
  nuevoComp: any = {
    etiqueta: '',
    tipoId: '',
    marca: '',
    modelo: '',
    usuario: '',
    tipoUbicacionId: '',
    notaUbicacion: ''
  };

  // Modelo Formulario Modal
  modalData: any = {
    id: null,
    tipoUbicacionId: '',
    nota: '',
    estado: 'OPERATIVO'
  };

constructor(
    private inventoryService: InventoryService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales() {
    // Usamos forkJoin para traer catálogos primero
    forkJoin({
      tipos: this.inventoryService.getTipos(),
      ubicaciones: this.inventoryService.getUbicaciones()
    }).subscribe({
      next: (res) => {
        this.tipos = res.tipos;
        this.ubicaciones = res.ubicaciones;
        this.loadComponents(); // Solo después cargamos la tabla
      }
    });
  }

  loadComponents() {
    this.inventoryService.getComponentes().subscribe({
      next: (res) => {
        this.componentes = [...res]; // Usamos el operador spread para asegurar una nueva referencia
        this.cdr.detectChanges(); // <--- ESTO ES LA CLAVE: Forzamos a Angular a pintar
      },
    });
  }
  guardarComponente() {
    const body = {
      etiqueta: this.nuevoComp.etiqueta.toUpperCase(),
      tipoId: parseInt(this.nuevoComp.tipoId),
      marca: this.nuevoComp.marca,
      modelo: this.nuevoComp.modelo,
      usuario: this.nuevoComp.usuario,
      tipoUbicacionId: parseInt(this.nuevoComp.tipoUbicacionId),
      detallesUbicacion: { "nota": this.nuevoComp.notaUbicacion }
    };

    this.inventoryService.create(body).subscribe({
      next: () => {
        this.loadComponents();
        this.resetForm();
        // 3. Modal de éxito al guardar
        this.dialogService.openSuccess(
          '¡Registrado!',
          'El componente ha sido añadido al inventario correctamente.'
        );
      },}
      );
  }
  openUpdateModal(comp: any) {
  // Esta lógica prepara los datos para el modal de Bootstrap que tienes en el HTML
  this.modalData.id = comp.id;
  this.modalData.estado = comp.estadoActual;
  this.modalData.tipoUbicacionId = ''; // Resetear selección previa
  this.modalData.nota = '';
}
  deleteComponent(comp: any) {
    // 1. Validamos que haya un usuario identificado en el formulario para firmar la baja
    const usuarioResponsable = this.nuevoComp.usuario;
    if (!usuarioResponsable) {
      this.dialogService.openError('Usuario requerido', 'Por favor, introduce tu nombre en el campo "Usuario" antes de dar de baja.');
      return;
    }

    const modalRef = this.dialogService.openConfirm(
      'Dar de baja',
      `¿Estás seguro de que deseas retirar el componente ${comp.etiqueta}? Esta acción quedará registrada.`
    );

    modalRef.result.then((result) => {
      if (result === 'confirmed') {
        // Pasamos el ID y el Usuario (el backend ahora lo recibe por @RequestParam)
        this.inventoryService.delete(comp.id, usuarioResponsable).subscribe({
          next: () => {
            this.dialogService.closeAll();
            this.loadComponents();
            this.dialogService.openSuccess('Baja confirmada', 'El componente se ha retirado con éxito.');
          },
          error: (err) => {
            this.dialogService.openError('Error', 'No se pudo procesar la baja. Revisa la consola.');
          }
        });
      }
    }).catch(() => {});
  }

submitUpdateLocation() {
    if (!this.nuevoComp.usuario || !this.modalData.tipoUbicacionId) {
      this.dialogService.openError('Faltan datos', 'El usuario y la nueva ubicación son obligatorios para registrar el movimiento.');
      return;
    }

    // Buscamos el componente original para mantener los datos que el DTO requiere
    const original = this.componentes.find(c => c.id === this.modalData.id);

    // El backend usa ComponenteCreateDTO, debemos enviar todos los campos
    const body = {
      etiqueta: original.etiqueta,
      tipoId: this.tipos.find(t => t.nombre === original.tipo)?.id, // Mapeo de nombre a ID
      marca: original.marca,
      modelo: original.modelo,
      usuario: this.nuevoComp.usuario,
      tipoUbicacionId: parseInt(this.modalData.tipoUbicacionId),
      detallesUbicacion: { "nota": this.modalData.nota },
      estadoActual: this.modalData.estado 
    };

    this.inventoryService.update(this.modalData.id, body).subscribe({
      next: () => {
        this.loadComponents();
        // Cerramos el modal de bootstrap manualmente o vía dialogService
        this.dialogService.openSuccess('Movimiento registrado', 'El traslado se ha guardado en el historial inmutable.');
      },
      error: (err) => {
        // Aquí verás el error si el trigger de Postgres bloquea algo
        console.error(err);
      }
    });
  }


  resetForm() {
    this.nuevoComp = {
      etiqueta: '', tipoId: '', marca: '', modelo: '',
      usuario: this.nuevoComp.usuario,
      tipoUbicacionId: '', notaUbicacion: ''
    };
  }

  // Lógica de filtrado reactivo
get componentesFiltrados() {
    if (!this.filtroTexto) return this.componentes;
    const busqueda = this.filtroTexto.toLowerCase();
    return this.componentes.filter(c =>
      c.etiqueta?.toLowerCase().includes(busqueda) ||
      c.tipo?.toLowerCase().includes(busqueda) ||
      c.marca?.toLowerCase().includes(busqueda) ||
      c.modelo?.toLowerCase().includes(busqueda) ||
      c.ubicacion?.toLowerCase().includes(busqueda) ||
      c.estadoActual?.toLowerCase().includes(busqueda)
    );
  }
  trackById(index: number, item: any) {
    return item.id;
  }
}
