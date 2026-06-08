import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs';
import { EpisodeService } from '../../../../core/services/episode.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { Episode } from '../../../../models/episode.model';
import { Info } from '../../../../models/api-response.model';
import { EpisodeModalComponent } from '../../../../shared/components/episode-modal/episode-modal.component';
import { SearchBarComponent } from '../../../../shared/components/search-bar/search-bar.component';


/**
 * Componente principal para el listado de episodios.
 * 
 * Cumplimiento de Requerimientos Funcionales[cite: 2]:
 * - Consumo de API: Gestión delegada a EpisodeService para mantener una arquitectura limpia.
 * - Estados de UI: Manejo reactivo de estados de carga, error y casos sin resultados.
 * - Experiencia de Usuario: Interfaz construida con Tailwind CSS para máxima legibilidad.
 */
@Component({
  selector: 'app-episodes-page',
  standalone: true,
  imports: [AsyncPipe, EpisodeModalComponent, SearchBarComponent],
  templateUrl: './episodes-page.html',
  styleUrl: './episodes-page.scss',
})
export class EpisodesPage implements OnInit {
  private readonly episodeService = inject(EpisodeService);
  readonly modalService = inject(ModalService);
  private readonly destroyRef = inject(DestroyRef);

  readonly episodes = signal<Episode[]>([]);
  readonly pageInfo = signal<Info | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly currentPage = signal<number>(1);
  readonly currentSearchTerm = signal<string>('');

  readonly searchControl = new FormControl('');

  ngOnInit(): void {
    this.setupSearch();
    this.loadEpisodes();
  }

  private setupSearch(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(term => {
      const searchTerm = term || '';
      this.currentSearchTerm.set(searchTerm);
      this.currentPage.set(1);
      this.loadEpisodes(1, searchTerm);
    });
  }

  loadEpisodes(page: number = 1, name: string = ''): void {
    this.isLoading.set(true);
    this.error.set(null);

    const request = name 
      ? this.episodeService.searchEpisodes(name, page) 
      : this.episodeService.getEpisodes(page);

    request.pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (response) => {
        this.episodes.set(response.results);
        this.pageInfo.set(response.info);
      },
      error: (err) => {
        if (err.status === 404) {
          // La API devuelve 404 cuando no hay resultados de búsqueda
          this.episodes.set([]);
          this.pageInfo.set(null);
        } else {
          this.error.set('No se pudieron cargar los episodios. Por favor, revisa tu conexión.');
          console.error('Error cargando episodios:', err);
        }
      }
    });
  }

  nextPage(): void {
    const info = this.pageInfo();
    if (info?.next) {
      this.currentPage.update(p => p + 1);
      this.loadEpisodes(this.currentPage(), this.currentSearchTerm());
    }
  }

  prevPage(): void {
    const info = this.pageInfo();
    if (info?.prev) {
      this.currentPage.update(p => p - 1);
      this.loadEpisodes(this.currentPage(), this.currentSearchTerm());
    }
  }

  openModal(episode: Episode): void {
    this.modalService.open(episode);
  }
}
