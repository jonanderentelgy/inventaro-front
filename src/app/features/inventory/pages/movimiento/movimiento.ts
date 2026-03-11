import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-movimiento',
  imports: [CommonModule, FormsModule],
  templateUrl: './movimiento.html',
  styleUrl: './movimiento.css',
})

export class MovimientosComponent implements OnInit {

  movimientos: any[] = [];
  filtro: string = '';

  pagina = 1;
  pageSize = 5;

  constructor(private service: InventoryService) {}

  ngOnInit(): void {
    this.loadMovimientos();
  }

  loadMovimientos() {
    this.service.getMovimientos().subscribe(res => {
      this.movimientos = res;
    });
  }

  get movimientosFiltrados() {

    if (!this.filtro) return this.movimientos;

    const txt = this.filtro.toLowerCase();

    return this.movimientos.filter(m =>
      m.usuarioModificador?.toLowerCase().includes(txt) ||
      m.motivo?.toLowerCase().includes(txt)
    );
  }

  get totalPaginas() {
    return Math.ceil(this.movimientosFiltrados.length / this.pageSize);
  }

  get movimientosPaginados() {

    const start = (this.pagina - 1) * this.pageSize;

    return this.movimientosFiltrados.slice(
      start,
      start + this.pageSize
    );
  }

  nextPage() {
    if (this.pagina < this.totalPaginas) {
      this.pagina++;
    }
  }

  prevPage() {
    if (this.pagina > 1) {
      this.pagina--;
    }
  }

  trackById(index:number,item:any){
    return item.id
  }

}
