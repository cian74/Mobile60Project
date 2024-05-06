import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, delay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResult, MovieResult } from './interfaces';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = environment.apiKey;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  constructor() { }

/**
 * Retrieves a list of top-rated movies from the API.
 * @param page - The page number of the results to retrieve (default is 1).
 * @returns An observable of type ApiResult representing the list of top-rated movies.
 */
  getTopRatedMovies(page = 1): Observable<ApiResult> {
    return this.http.get<ApiResult>(`${BASE_URL}/movie/popular?page=${page}&api_key=${API_KEY}`).pipe(
      delay(1200));
  }

/**
 * Retrieves the details of a specific movie from the API.
 * @param id - The ID of the movie to retrieve details for.
 * @returns An observable of type MovieResult representing the details of the specific movie.
 */
  getMovieDetails(id: string): Observable<MovieResult> {
    return this.http.get<MovieResult>(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
  }

  searchMovies(searchTerm: string): Observable<ApiResult> {
    return this.http.get<ApiResult>(`${BASE_URL}/search/movie?query=${searchTerm}&api_key=${API_KEY}`);
  }
}
