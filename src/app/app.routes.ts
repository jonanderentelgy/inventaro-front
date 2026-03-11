import { Routes } from '@angular/router';
import { InventoryComponent } from './features/inventory/pages/inventory.component/inventory.component';
import { TablePanelComponent } from './features/inventory/pages/table-panel.component/table-panel.component';
import { MovimientosComponent } from './features/inventory/pages/movimiento/movimiento';
export const routes: Routes = [
  { path: '', component: InventoryComponent },
  { path: 'table', component: TablePanelComponent },
  { path: 'movimientos', component: MovimientosComponent },
  { path: '**', redirectTo: '' }
];
