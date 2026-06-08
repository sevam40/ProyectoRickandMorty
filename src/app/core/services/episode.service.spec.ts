import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { EpisodeService } from './episode.service';
import { PaginatedResponse } from '../../models/api-response.model';
import { Episode } from '../../models/episode.model';

describe('EpisodeService', () => {
  let service: EpisodeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EpisodeService,
        // Usamos las nuevas APIs de Angular 18+ para pruebas HTTP
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(EpisodeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifica que no existan peticiones HTTP pendientes al terminar cada test
    httpMock.verify();
  });

  it('debería ser creado correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener una lista paginada de episodios (GET)', () => {
    // 1. Arrange: Preparamos los datos de prueba (Mock Data)
    const mockResponse: PaginatedResponse<Episode> = {
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [
        {
          id: 1,
          name: 'Pilot',
          air_date: 'December 2, 2013',
          episode: 'S01E01',
          characters: ['https://rickandmortyapi.com/api/character/1'],
          url: 'https://rickandmortyapi.com/api/episode/1',
          created: '2017-11-10T12:56:33.798Z'
        }
      ]
    };

    // 2. Act: Llamamos al método del servicio
    service.getEpisodes(1).subscribe((response) => {
      // 3. Assert: Comprobamos que la respuesta coincida con el mock
      expect(response).toBeTruthy();
      expect(response.results.length).toBe(1);
      expect(response.results[0].name).toEqual('Pilot');
      expect(response.info.count).toBe(1);
    });

    // 4. HttpMock: Esperamos que se realice una petición GET al endpoint correcto
    const req = httpMock.expectOne('https://rickandmortyapi.com/api/episode?page=1');
    expect(req.request.method).toBe('GET');

    // Simulamos la respuesta del servidor devolviendo nuestra data de prueba
    req.flush(mockResponse);
  });

  it('debería realizar una búsqueda de episodios por nombre (GET con parámetros)', () => {
    const mockResponse: PaginatedResponse<Episode> = {
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [
        {
          id: 2,
          name: 'Lawnmower Dog',
          air_date: 'December 9, 2013',
          episode: 'S01E02',
          characters: [],
          url: 'https://rickandmortyapi.com/api/episode/2',
          created: '2017-11-10T12:56:33.916Z'
        }
      ]
    };

    // Buscamos por el término "Dog"
    service.searchEpisodes('Dog', 1).subscribe((response) => {
      expect(response.results.length).toBe(1);
      expect(response.results[0].name).toEqual('Lawnmower Dog');
      expect(response.results[0].episode).toEqual('S01E02');
    });

    // Verificamos que la URL construida contenga los query parameters correctamente
    const req = httpMock.expectOne('https://rickandmortyapi.com/api/episode?page=1&name=Dog');
    expect(req.request.method).toBe('GET');
    
    // Devolvemos la respuesta controlada
    req.flush(mockResponse);
  });
});
