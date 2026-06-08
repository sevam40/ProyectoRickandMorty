import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Episode } from '../../../models/episode.model';

@Component({
  selector: 'app-episode-modal',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './episode-modal.component.html'
})
export class EpisodeModalComponent {
  // Recibe la data estrictamente tipada. Es obligatorio para que el modal funcione.
  @Input({ required: true }) episode!: Episode;
  
  // Emite el evento hacia el padre (o contenedor) para notificar el cierre
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  // Utilidad para extraer el ID del personaje de la URL para mostrarlo bonito
  getCharacterId(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1] || '';
  }
}
