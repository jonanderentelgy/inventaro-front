import { Routes } from '@angular/router';
import { InventoryComponent } from '../inventory.component/inventory.component';
import { TablePanelComponent } from '../table-panel.component/table-panel.component';

export const routes: Routes = [
  { path: '', component: InventoryComponent },
  { path: 'table', component: TablePanelComponent },
  { path: '**', redirectTo: '' }
];
