import { Component, inject, OnInit, signal } from '@angular/core';
import { EpisodeService } from '../../../../core/services/episode.service';
import { Episode } from '../../../../models/episode.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-episodes-page',
  imports: [],
  templateUrl: './episodes-page.html',
  styleUrl: './episodes-page.scss',
})
export class EpisodesPage implements OnInit {
  // Inyección del servicio de episodios
  private readonly episodeService = inject(EpisodeService);

  // Signals para manejar el estado reactivo de la vista (Angular 17+)
  readonly episodes = signal<Episode[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadEpisodes();
  }

  // Método para cargar episodios, por defecto la página 1
  loadEpisodes(page: number = 1): void {
    // Iniciamos el estado de carga y limpiamos errores previos
    this.isLoading.set(true);
    this.error.set(null);

    this.episodeService.getEpisodes(page)
      .pipe(
        // finalize se ejecuta siempre, haya éxito o error, ideal para detener el loading
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          // Actualizamos el signal de episodios con los resultados
          this.episodes.set(response.results);
        },
        error: (err) => {
          // Actualizamos el signal de error
          this.error.set('No se pudieron cargar los episodios. Por favor, revisa tu conexión e intenta de nuevo.');
          console.error('Error cargando episodios:', err);
        }
      });
  }
}
