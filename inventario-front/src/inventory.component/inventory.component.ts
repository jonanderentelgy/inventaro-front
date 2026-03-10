import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { InventoryService } from '../Service/inventory.service';
import { TranslateModule } from '@ngx-translate/core';
// 1. Importa el servicio de diálogos
import { DialogService } from '../app/modals/dialog.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  standalone: true,
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
      error: (err) => console.error("Error al cargar componentes", err)
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
      },
      error: () => {
        // 4. Modal de error
        this.dialogService.openError(
          'Error de Registro',
          'Verifica que la etiqueta sea única y tenga el formato correcto (Ej: AB12345).'
        );
      }
    });
  }
  openUpdateModal(comp: any) {
  // Esta lógica prepara los datos para el modal de Bootstrap que tienes en el HTML
  this.modalData.id = comp.id;
  this.modalData.estado = comp.estadoActual;
  this.modalData.tipoUbicacionId = ''; // Resetear selección previa
  this.modalData.nota = '';
}
  deleteComponent(id: string) {
    // 5. Abrir modal de confirmación
    const modalRef = this.dialogService.openConfirm(
      'Dar de baja',
      '¿Estás seguro de que deseas retirar este componente del inventario activo?'
    );

    // 6. Escuchar la respuesta del modal (Promesa de NgbModal)
    modalRef.result.then((result) => {
      if (result === 'confirmed') {
        // El spinner ya se activa automáticamente dentro del SharedDialogComponent
        // cuando pulsamos el botón que llama a activeModal.close('confirmed')

        this.inventoryService.delete(id).subscribe({
          next: () => {
            // Cerramos todos los modales (el de confirmación que quedó con el spinner)
            this.dialogService.closeAll();
            this.loadComponents();
            this.dialogService.openSuccess('Baja confirmada', 'El componente se ha retirado con éxito.');
          },
          error: () => {
            this.dialogService.closeAll();
            this.dialogService.openError('Error', 'No se pudo procesar la baja del componente.');
          }
        });
      }
    }).catch(() => {
      // El usuario canceló o cerró el modal, no hacemos nada
    });
  }

submitUpdateLocation() {
    if (!this.nuevoComp.usuario) {
      this.dialogService.openError('Faltan datos', 'Introduce el "Usuario que registra" antes de continuar.');
      return;
    }

   const body = {
      tipoUbicacionId: parseInt(this.modalData.tipoUbicacionId),
      detallesUbicacion: { "nota": this.modalData.nota },
      estadoActual: this.modalData.estado,
      usuario: this.nuevoComp.usuario
    };

    this.inventoryService.updateLocation(this.modalData.id, body).subscribe({
      next: () => {
        this.loadComponents();
        this.dialogService.openSuccess('Ubicación Actualizada', 'El traslado se registró correctamente.');
      },
      error: () => {
        this.dialogService.openError('Error', 'No se pudo actualizar la ubicación del componente.');
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
      c.marca?.toLowerCase().includes(busqueda) ||
      c.modelo?.toLowerCase().includes(busqueda) ||
      c.tipo?.toLowerCase().includes(busqueda)
    );
  }


  trackById(index: number, item: any) {
    return item.id;
  }
}
