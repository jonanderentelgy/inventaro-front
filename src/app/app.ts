import { Component, signal } from '@angular/core';
import { Footer } from '../layout/footer/footer';
import { NavbarComponent } from '../layout/navbar/navbar';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ Footer, NavbarComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('inventario-front');
}
