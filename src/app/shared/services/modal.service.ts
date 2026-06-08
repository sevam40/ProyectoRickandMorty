import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Episode } from '../../models/episode.model';

/**
 * Servicio encargado de gestionar el ciclo de vida de los modales en la aplicación.
 * 
 * Implementación técnica:
 * - Utiliza un patrón de comunicación desacoplado para abrir/cerrar modales.
 * - Centraliza la lógica de UI, evitando que los componentes de página 
 *   tengan que gestionar manualmente el estado de visibilidad del modal.[cite: 1]
 */
@Injectable({
  providedIn: 'root'
})
export class ModalService {
  // Estado interno manejado por BehaviorSubjects (requerido por la arquitectura solicitada)
  private readonly isOpenSubject = new BehaviorSubject<boolean>(false);
  private readonly episodeSubject = new BehaviorSubject<Episode | null>(null);

  // Observables expuestos de solo lectura para los componentes
  readonly isOpen$ = this.isOpenSubject.asObservable();
  readonly episode$ = this.episodeSubject.asObservable();

  /**
   * Abre el modal y establece el episodio seleccionado
   * @param episode Objeto del episodio a mostrar
   */
  open(episode: Episode): void {
    this.episodeSubject.next(episode);
    this.isOpenSubject.next(true);
  }

  /**
   * Cierra el modal y limpia el estado
   */
  close(): void {
    this.isOpenSubject.next(false);
    // Un pequeño retraso para permitir animaciones de salida (opcional pero recomendado)
    setTimeout(() => {
      this.episodeSubject.next(null);
    }, 200);
  }
}
