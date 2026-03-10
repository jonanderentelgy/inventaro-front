import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DialogService } from '../../modals/dialog.service'; // Ajusta la ruta si es necesario

// Diccionario de errores que coincide con los de tu backend Spring Boot
const ERROR_DICTIONARY: Record<string, { title: string, message: string }> = {
  'ERR_ETIQUETA_DUPLICADA': { title: 'Etiqueta en uso', message: 'Esta etiqueta ya está asignada a otro componente.' },
  'ERR_COMPONENTE_NO_ENCONTRADO': { title: 'No encontrado', message: 'El componente no existe o fue eliminado.' },
  'ERR_TIPO_COMP_NO_ENCONTRADO': { title: 'Error de Catálogo', message: 'El tipo de componente no es válido.' },
  'ERR_TIPO_UBIC_NO_ENCONTRADO': { title: 'Error de Catálogo', message: 'El tipo de ubicación no es válido.' },
  'ERR_UBICACION_NO_ENCONTRADA': { title: 'No encontrado', message: 'La ubicación ya no existe.' },
  'ERR_VALIDACION': { title: 'Datos incompletos', message: 'Revisa que todos los campos estén correctos.' },
  'ERR_DESCONOCIDO': { title: 'Error del Servidor', message: 'Ocurrió un problema inesperado. Contacta a soporte.' }
};

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dialogService: DialogService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {

        let title = 'Error de conexión';
        let message = 'No se pudo comunicar con el servidor.';

        // Comprobamos si el backend nos devolvió nuestro ErrorResponse estandarizado
        if (error.error && error.error.errorCode) {
          const code = error.error.errorCode;
          const mappedError = ERROR_DICTIONARY[code];

          if (mappedError) {
            title = mappedError.title;
            message = mappedError.message;
          } else {
            // Si el código no está en el diccionario, usamos el mensaje que manda el backend
            title = 'Error ' + code;
            message = error.error.message || 'Error desconocido';
          }
        } else if (error.error && error.error.mensaje) {
          // Por si queda algún endpoint devolviendo el formato antiguo
          title = 'Fallo al procesar';
          message = error.error.mensaje;
        }

        // ¡LLAMAMOS A TU MODAL DIRECTAMENTE!
        this.dialogService.openError(title, message);

        return throwError(() => error);
      })
    );
  }
}
