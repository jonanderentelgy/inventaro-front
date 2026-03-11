export interface DialogData {
  type: 'confirm' | 'success' | 'error' | 'prompt'; // Añadimos 'prompt'
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  inputLabel?: string; // Etiqueta encima del input
  inputValue?: string; // Valor que el usuario escribirá/editará
}
