import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle,IonBadge, IonContent, IonInfiniteScrollContent, InfiniteScrollCustomEvent, IonList, IonItem, IonAvatar, IonSkeletonText, IonAlert, IonLabel, IonInfiniteScroll, IonButtons, IonButton, IonBackButton, IonSearchbar } from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';
import { catchError, finalize } from 'rxjs';
import { MovieResult } from '../services/interfaces';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonSearchbar, IonBackButton, IonButton, IonButtons, IonInfiniteScroll, 
    IonLabel,
    IonAlert,
    IonAvatar, 
    IonItem, 
    IonList, 
    IonHeader, 
    IonToolbar,
    IonTitle, 
    IonContent, 
    IonList, 
    IonItem, 
    IonAvatar, 
    IonSkeletonText,
    DatePipe,
    RouterModule,
    IonBadge,
    IonInfiniteScroll,
    IonInfiniteScrollContent
  ],
})
export class HomePage {
  public movieService = inject(ApiService);
  public error = null;
  public movies: MovieResult[] = [];
  public isLoading = false;
  private currentPage = 1;
  public dummyArray = new Array(5);
  public imageBaseUrl = 'https://image.tmdb.org/t/p';
  public vote_average: any;
  public searchTerm: string = '';
  public filteredMovies: MovieResult[] = [];

  constructor() {
    this.loadMovies();

  }

  /**
   * Loads the top rated movies from the movie service.
   * @param event - Optional parameter representing the InfiniteScrollCustomEvent triggered by the infinite scroll component.
   */
  loadMovies(event?: InfiniteScrollCustomEvent) {
    this.error = null;

    //sets isLoading to true when the page is initially loaded
    if(!event) {
      this.isLoading = true;
    }
    //gets top rated movies which is in the movie service
     this.movieService.getTopRatedMovies(this.currentPage).pipe(
      finalize(() => { // finalizes observable.- completes scroll event
        //stops the scroll event
        this.isLoading = false;
        if(event) {
          event.target.complete();
        }
      }),
      catchError((err: any) => {
        console.log(err);
        this.error = err.error.status_message;
        return [];
      })
     ).subscribe({
      /**
       * Handles the next value emitted by the observable.
       * @param res - The response containing the top rated movies.
       */
      next: (res) => {
        console.log(res);
        this.movies.push(...res.results);
        if (this.searchTerm.trim() !== '') {
          this.filteredMovies = this.movies.filter((movie) =>
            movie.title.toLowerCase().includes(this.searchTerm.toLowerCase())
          ).slice(0, 3);// only displays 3 filtered movies
        } else {
          this.filteredMovies = [...this.movies];
        }
        if(event) {
          event.target.disabled = res.total_pages === this.currentPage;;
        }
      }
     });
  }

  /**
 * Loads more movies when the user scrolls to the bottom of the page.
 * Increases the current page number and calls the loadMovies method to fetch more movies.
 * @param event - Optional parameter representing the InfiniteScrollCustomEvent triggered by the infinite scroll component.
 *                It allows the method to access the event properties, such as target and disabled.
 */
  loadMore(event: InfiniteScrollCustomEvent) {
    this.currentPage++;
    this.loadMovies(event);
  }

  /**
 * Filters the movies based on the search term and updates the filteredMovies array.
 * If the search term is not empty, it filters the movies that match the search term and takes the first three results.
 * If the search term is empty, it clears the filteredMovies array.
 * @param event - The CustomEvent containing the search term in the detail.value property.
 */

  //NOTE: -  track filteredMovies instead of 'movies' html as tracking movies causes them to be loaded twice
  searchMovies(event: CustomEvent) {
    const searchTerm = event.detail.value.toLowerCase();
    if (searchTerm.trim() !== '') {
      // Extracting ids from filteredMovies array
      const movieIds = this.filteredMovies.map(movie => movie.id);
      this.movieService.searchMovies(searchTerm).pipe(
        catchError((err: any) => {
          console.log(err);
          this.error = err.error.status_message;
          return [];
        })
      ).subscribe({
        next: (res) => {
          this.filteredMovies = res.results.slice(0, 3);
        }
      });
    } else {
      this.filteredMovies = [];
      this.searchTerm = '';
      this.loadMovies();
    }
  }
}
