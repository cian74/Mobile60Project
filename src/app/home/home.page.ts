import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle,IonBadge, IonContent, IonInfiniteScrollContent, InfiniteScrollCustomEvent, IonList, IonItem, IonAvatar, IonSkeletonText, IonAlert, IonLabel, IonInfiniteScroll, IonButtons, IonButton, IonBackButton } from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';
import { catchError, finalize, map } from 'rxjs';
import { MovieResult } from '../services/interfaces';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonButton, IonButtons, IonInfiniteScroll, 
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
}
