# AI Development Agent Guidelines

Este documento define cómo debe comportarse el agente de IA (Copilot) al generar código en este proyecto.

El objetivo es que todo el código generado sea:
- Correcto
- Seguro
- Escalable
- Consistente con Angular
- Fácil de mantener

---

# Project Stack

El proyecto utiliza:

Angular CLI: 21.2.0  
Node.js: 24.14.0  
Package Manager: npm 11.9.0  

Framework principal:
Angular (Standalone APIs)

Arquitectura:
Frontend Angular + Backend API (Spring Boot)

Dominio principal:
Sistema de inventario de componentes tecnológicos.

---

# Core Principles

El agente debe priorizar:

1. Código limpio
2. Seguridad
3. Buen rendimiento
4. Arquitectura clara
5. Tipado fuerte
6. Separación de responsabilidades
7. Reutilización

Evitar:
- código duplicado
- lógica en componentes
- funciones excesivamente largas
- any en TypeScript

---

# Angular Best Practices

## Usar Standalone Components

Siempre que se generen componentes:

- importar dependencias explícitamente

Ejemplo correcto:

```ts
@Component({
  selector: 'app-component-list',
  imports: [CommonModule],
  templateUrl: './component-list.component.html'
})
