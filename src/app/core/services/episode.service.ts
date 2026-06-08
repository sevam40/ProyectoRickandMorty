import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { PaginatedResponse } from '../../models/api-response.model';
import { Episode } from '../../models/episode.model';

@Injectable({
  providedIn: 'root'
})
export class EpisodeService {
  private readonly apiUrl = 'https://rickandmortyapi.com/api/episode';
  private readonly http = inject(HttpClient);

  getEpisodes(page: number = 1): Observable<PaginatedResponse<Episode>> {
    return this.http.get<PaginatedResponse<Episode>>(`${this.apiUrl}?page=${page}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o red
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // El backend retornó un código de error
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
