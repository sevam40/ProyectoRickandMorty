import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Episode } from '../../../models/episode.model';

/**
 * Componente modal de detalle para episodios.
 * 
 * Arquitectura:
 * - Diseño desacoplado: Utiliza @Input/@Output para comunicación bidireccional simple.
 * - Tipado fuerte: Implementa la interfaz 'Episode' para asegurar integridad de datos.
 * - Utilidad de visualización: Incluye lógica de procesamiento de URLs para navegación dinámica.
 */
@Component({
  selector: 'app-episode-modal',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './episode-modal.component.html'
})
export class EpisodeModalComponent {
  // Inyección de datos mediante input requerido para garantizar la integridad del estado inicial[cite: 1]
  @Input({ required: true }) episode!: Episode;
  
  // Emisor de eventos para delegar la gestión del cierre al servicio o componente padre[cite: 1]
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  // Lógica de transformación: Permite derivar identificadores desde URLs relativas de la API[cite: 1]
  getCharacterId(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1] || '';
  }
}
