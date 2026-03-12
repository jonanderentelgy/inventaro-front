import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-movimiento',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './movimiento.html',
  styleUrls: ['./movimiento.css']
})
export class MovimientosComponent implements OnInit {

  movimientos: any[] = [];
// En el archivo .ts
keepOrder = (a: any, b: any) => 0;
  page = 0;
  totalPages = 0;
  totalElements = 0;

  filtroTexto = '';
  filtroMotivo = '';

constructor(private service: InventoryService, private cd: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.load();
  }

  load() {
    this.service.getMovimientos(this.page).subscribe({
      next: (res: any) => {
        this.movimientos = res.content || [];
        this.totalPages = res.totalPages || 0;
        this.totalElements = res.totalElements || 0;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando movimientos', err);
      }
    });
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.load();
    }
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.load();
    }
  }

  trackById(index:number,item:any){
    return item.id
  }

  get movimientosFiltrados() {

    if (!this.movimientos) return [];

    return this.movimientos.filter(m => {

      const txt = this.filtroTexto.toLowerCase();

      const usuario = m.usuarioModificador || '';
      const motivo = m.motivo || '';

      const coincideTexto =
        !txt ||
        usuario.toLowerCase().includes(txt) ||
        motivo.toLowerCase().includes(txt);

      const coincideMotivo =
        !this.filtroMotivo ||
        motivo.toUpperCase().includes(this.filtroMotivo.toUpperCase());

      return coincideTexto && coincideMotivo;

    });
  }

  get movimientosAgrupados() {

    const grupos:any = {};

    for (const m of this.movimientosFiltrados) {

      const fecha = new Date(m.fecha).toLocaleDateString();

      if (!grupos[fecha]) {
        grupos[fecha] = [];
      }

      grupos[fecha].push(m);

    }

    return grupos;
  }

  getMotivoClass(motivo:string){

    const mot = motivo?.toUpperCase();

    if(mot?.includes('ALTA')) return 'alta';
    if(mot?.includes('BAJA')) return 'baja';
    if(mot?.includes('TRASLADO')) return 'traslado';

    return 'otro';

  }

  getMotivoIcon(motivo:string){

    const mot = motivo?.toUpperCase();

    if(mot?.includes('ALTA')) return 'bi-plus-circle';
    if(mot?.includes('BAJA')) return 'bi-x-circle';
    if(mot?.includes('TRASLADO')) return 'bi-arrow-left-right';

    return 'bi-pencil';

  }

}
