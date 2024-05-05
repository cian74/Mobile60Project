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
  
    //loads the watchlist
    ngOnInit() {
      this.loadWatchlist();
    }
  
    /**
     * Loads the watchlist from storage and initializes the component's watchlist property.
     * If the watchlist is not found in the storage, initializes an empty array.
     * Also triggers the loading of ratings for the movies in the watchlist.
     */
    async loadWatchlist() {
      await this.storage.create();
      //retrieves watchlist from storage
      const savedWatchlist = await this.storage.get('watchlist');

      //sets local watchlist to retrieved one from storage
      this.watchlist = savedWatchlist || [];

      //calls loadRatings
      this.loadRatings();
    }
    /**
     * Asynchronously loads the ratings for the movies in the watchlist from the storage.
     * Updates the rating property of each movie in the watchlist if a rating is found in the storage.
     */
    async loadRatings() {
      for (const movie of this.watchlist) {
        const rating = await this.storage.get(`rating_${movie.id}`);
        //if a rating is found in storage, it updates the movies rating property
        if (rating !== null) {
          movie.rating = rating;
        }
      }
    }

    /**
     * Asynchronously removes a movie from the watchlist and updates the storage.
     * 
     * @param movieId - The ID of the movie to be removed from the watchlist.
     * @param event - The mouse event that triggered the removal action.
     * 
     * @returns {Promise<void>} - A Promise that resolves once the movie is removed from the watchlist and the storage is updated.
     */
    async removeFromWatchlist(movieId: number, event: MouseEvent) {
      event.stopImmediatePropagation(); // Prevents triggering goToDetailsPage
      this.watchlist = this.watchlist.filter(movie => movie.id !== movieId);
      await this.storage.set('watchlist', this.watchlist);
    }

    /**
     * Navigates to the details page for a specific movie.
     * 
     * @param id - The ID of the movie for which the details page will be navigated to.
     * 
     * @returns {void} - This function does not return a value.
     */
    goToDetailsPage(id: number) {
      this.router.navigateByUrl(`/details/${id}`);
    }

    /**
     * Asynchronously prompts the user to rate a movie and saves the rating to the storage if provided.
     * 
     * @param movie - The movie for which the user is prompted to provide a rating.
     * 
     * @returns {Promise<void>} - A Promise that resolves once the user provides a rating and it is saved to the storage.
     */
    async rateMovie(movie: MovieResult) {
      const rating = await this.showRatingPrompt();
      if (rating !== null) {
        movie.rating = rating;
        // Save rating to storage
        await this.storage.set(`rating_${movie.id}`, rating);
      }
    }
  
    /**
     * Asynchronously prompts the user to enter a rating for a movie.
     * 
     * @returns {Promise<number | null>} - A Promise that resolves with the user-provided rating (if valid) or null if the prompt is canceled or an invalid rating is entered.
     */
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
