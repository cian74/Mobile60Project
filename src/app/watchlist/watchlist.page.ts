import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButton,IonBackButton,IonButtons, IonItem, IonList,IonLabel, IonAvatar, IonSelect, IonSelectOption, IonAlert } from '@ionic/angular/standalone';
import { MovieResult } from '../services/interfaces';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { text } from 'ionicons/icons';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.page.html',
  styleUrls: ['./watchlist.page.scss'],
  standalone: true,
  imports: [IonAlert, IonAvatar, IonItem, IonContent, IonHeader, IonTitle, IonAvatar, IonToolbar, CommonModule, FormsModule,IonBackButton,IonButton,IonButtons,IonList,IonLabel,IonSelect,IonSelectOption]
})
export class WatchlistPage implements OnInit{
    public watchlist: MovieResult[] = [];
    public imageBaseUrl = 'https://image.tmdb.org/t/p';
    public selectedMovie: MovieResult | null = null;

    constructor(private storage: Storage, private router: Router) {}
  
    ngOnInit() {
      this.loadWatchlist();
    }
  
    async loadWatchlist() {
      await this.storage.create();
      const savedWatchlist = await this.storage.get('watchlist');
      this.watchlist = savedWatchlist || [];
      this.loadRatings();
    }

    async loadRatings() {
      for (const movie of this.watchlist) {
        const rating = await this.storage.get(`rating_${movie.id}`);
        if (rating !== null) {
          movie.rating = rating;
        }
      }
    }

    async removeFromWatchlist(movieId: number, event: MouseEvent) {
      event.stopImmediatePropagation(); // Prevents triggering goToDetailsPage
      this.watchlist = this.watchlist.filter(movie => movie.id !== movieId);
      await this.storage.set('watchlist', this.watchlist);
    }

    goToDetailsPage(id: number) {
      this.router.navigateByUrl(`/details/${id}`);
    }

    async rateMovie(movie: MovieResult) {
      const rating = await this.showRatingPrompt();
      if (rating !== null) {
        movie.rating = rating;
        // Save rating to storage
        await this.storage.set(`rating_${movie.id}`, rating);
      }
    }
  
    async showRatingPrompt(): Promise<number | null> {
      return new Promise<number | null>((resolve) => {
        const rating = prompt('Rate this movie from 1 to 10:');
        if (rating === null || rating.trim() === '') {
          resolve(null);
        } else {
          const parsedRating = parseInt(rating.trim(), 10);
          if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 10) {
            alert('Please enter a valid rating between 1 and 10.');
            resolve(null);
          } else {
            resolve(parsedRating);
          }
        }
      });
    }
    
}
