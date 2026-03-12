import { inject } from '@angular/core';
import {  HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import {  throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DialogService } from '../../modals/dialog.service';

// Estructura para soportar ambos idiomas
interface Translation {
  es: string;
  eu: string;
}

interface ErrorEntry {
  title: Translation;
  message: Translation;
}

const ERROR_DICTIONARY: Record<string, ErrorEntry> = {
 'ERR_ETIQUETA_DUPLICADA': {
    title: { es: 'Nombre duplicado', eu: 'Izena bikoiztuta' },
    message: { es: 'Ya existe un elemento con este nombre.', eu: 'Dagoeneko badago izen horrekin elementu bat.' }
  },
  'ERR_REGISTRO_EN_USO': {
    title: { es: 'Registro en uso', eu: 'Erregistroa erabiltzen' },
    message: { es: 'No se puede borrar porque tiene elementos asociados.', eu: 'Ezin da ezabatu lotutako elementuak dituelako.' }
  },
  'ERR_COMPONENTE_NO_ENCONTRADO': {
    title: { es: 'No encontrado', eu: 'Ez da aurkitu' },
    message: { es: 'El componente no existe o fue eliminado.', eu: 'Osagaia ez da existitzen edo ezabatu egin da.' }
  },
  'ERR_TIPO_COMP_NO_ENCONTRADO': {
    title: { es: 'Error de Catálogo', eu: 'Katalogo errorea' },
    message: { es: 'El tipo de componente no es válido.', eu: 'Osagai mota ez da baliozkoa.' }
  },
  'ERR_TIPO_UBIC_NO_ENCONTRADO': {
    title: { es: 'Error de Catálogo', eu: 'Katalogo errorea' },
    message: { es: 'El tipo de ubicación no es válido.', eu: 'Kokaleku mota ez da baliozkoa.' }
  },
  'ERR_UBICACION_NO_ENCONTRADA': {
    title: { es: 'No encontrado', eu: 'Ez da aurkitu' },
    message: { es: 'La ubicación ya no existe.', eu: 'Kokalekua jada ez da existitzen.' }
  },
  'ERR_VALIDACION': {
    title: { es: 'Datos incompletos', eu: 'Datu osatugabeak' },
    message: { es: 'Revisa que todos los campos estén correctos.', eu: 'Egiaztatu eremu guztiak zuzen daudela.' }
  },
  'ERR_DESCONOCIDO': {
    title: { es: 'Error del Servidor', eu: 'Zerbitzari errorea' },
    message: { es: 'Ocurrió un problema inesperado. Contacta a soporte.', eu: 'Ustekabeko arazo bat gertatu da. Jarri harremanetan laguntzarekin.' }
  }
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  // 2. Usamos inject() para traer el servicio que antes iba en el constructor
  const dialogService = inject(DialogService);

  // Función auxiliar interna para el idioma
  const lang = (localStorage.getItem('lang') as 'es' | 'eu') || 'es';

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let title = lang === 'es' ? 'Error de conexión' : 'Konexio errorea';
      let message = lang === 'es' ? 'No se pudo comunicar con el servidor.' : 'Ezin izan da zerbitzariarekin komunikatu.';

      if (error.error && error.error.errorCode) {
        const code = error.error.errorCode;
        const mappedError = ERROR_DICTIONARY[code];

        if (mappedError) {
          title = mappedError.title[lang];
          message = mappedError.message[lang];
        } else {
          title = lang === 'es' ? 'Error en el sistema' : 'Sistemako errorea';
          message = error.error.message || (lang === 'es' ? 'Error desconocido' : 'Errore ezezaguna');
        }
      } else if (error.status === 0) {
        title = lang === 'es' ? 'Error de conexión' : 'Konexio errorea';
        message = lang === 'es' ? 'No se pudo comunicar con el servidor.' : 'Ezin izan da zerbitzariarekin komunikatu.';
      } else if (error.status >= 500) {
        title = lang === 'es' ? 'Error del Servidor' : 'Zerbitzari errorea';
        message = lang === 'es' ? 'Ocurrió un problema inesperado. Contacta a soporte.' : 'Ustekabeko arazo bat gertatu da. Jarri harremanetan laguntzarekin.';
      } else if (error.status >= 400) {
        title = lang === 'es' ? 'Error en la solicitud' : 'Eskaera errorea';
        message = lang === 'es' ? 'Revisa que todos los campos estén correctos.' : 'Egiaztatu eremu guztiak zuzen daudela.';
      }

      dialogService.openError(title, message);
      return throwError(() => error);
    })
  );
};
