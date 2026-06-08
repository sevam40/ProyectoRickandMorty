import { Component, inject, OnInit, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { EpisodeService } from '../../../../core/services/episode.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { Episode } from '../../../../models/episode.model';
import { finalize } from 'rxjs';
import { EpisodeModalComponent } from '../../../../shared/components/episode-modal/episode-modal.component';

@Component({
  selector: 'app-episodes-page',
  standalone: true,
  imports: [AsyncPipe, EpisodeModalComponent],
  templateUrl: './episodes-page.html',
  styleUrl: './episodes-page.scss',
})
export class EpisodesPage implements OnInit {
  private readonly episodeService = inject(EpisodeService);
  // Hacemos el modalService público para poder usarlo en el template
  readonly modalService = inject(ModalService);

  readonly episodes = signal<Episode[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadEpisodes();
  }

  loadEpisodes(page: number = 1): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.episodeService.getEpisodes(page)
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this.episodes.set(response.results);
        },
        error: (err) => {
          this.error.set('No se pudieron cargar los episodios. Por favor, revisa tu conexión e intenta de nuevo.');
          console.error('Error cargando episodios:', err);
        }
      });
  }

  openModal(episode: Episode): void {
    this.modalService.open(episode);
  }
}
