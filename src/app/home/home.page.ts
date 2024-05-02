import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle,IonBadge, IonContent, IonInfiniteScrollContent, InfiniteScrollCustomEvent, IonList, IonItem, IonAvatar, IonSkeletonText, IonAlert, IonLabel, IonInfiniteScroll } from '@ionic/angular/standalone';
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
  imports: [IonInfiniteScroll, 
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

  constructor() {
    this.loadMovies();
  }

  loadMovies(event?: InfiniteScrollCustomEvent) {
    this.error = null;

    if(!event) {
      this.isLoading = true;
    }
     this.movieService.getTopRatedMovies(this.currentPage).pipe(
      finalize(() => {
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
      next: (res) => {
        console.log(res);
        this.movies.push(...res.results);
        if(event) {
          event.target.disabled = res.total_pages === this.currentPage;;
        }
        
      }
     });
  }

  loadMore(event: InfiniteScrollCustomEvent) {
    this.currentPage++;
    this.loadMovies(event);
  }
}
