import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButton,IonBackButton,IonButtons, IonItem, IonList,IonLabel, IonAvatar, IonSelect, IonSelectOption, IonAlert, IonInput } from '@ionic/angular/standalone';
import { MovieResult } from '../services/interfaces';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular'
import { Keyboard } from '@capacitor/keyboard';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.page.html',
  styleUrls: ['./watchlist.page.scss'],
  standalone: true,
  imports: [IonInput, IonAlert, IonAvatar, IonItem, IonContent, IonHeader, IonTitle, IonAvatar, IonToolbar, CommonModule, FormsModule,IonBackButton,IonButton,IonButtons,IonList,IonLabel,IonSelect,IonSelectOption]
})
export class WatchlistPage implements OnInit{
    public watchlist: MovieResult[] = [];
    public imageBaseUrl = 'https://image.tmdb.org/t/p';
    public selectedMovie: MovieResult | null = null;

    constructor(private storage: Storage, private router: Router, private alertCtrl: AlertController) {}
  
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
      //Filter out movie to be removed
      this.watchlist = this.watchlist.filter(movie => movie.id !== movieId);
      //Update watchlst in storage
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
      //shows a prompt for the user to enter a rating
      const rating = await this.showRatingPrompt();
      //saves the rating in storage if the rating isnt null
      if (rating !== null) {
        movie.rating = rating;
        await this.storage.set(`rating_${movie.id}`, rating);
        //shows a keyboard if the user is using an android or ios device.
        if (Capacitor.isNativePlatform()) {
          Keyboard.show();
        }
      }
    }
  
    /**
     * Asynchronously prompts the user to enter a rating for a movie.
     * 
     * @returns {Promise<number | null>} - A Promise that resolves with the user-provided rating (if valid) or null if the prompt is canceled or an invalid rating is entered.
     */
    async showRatingPrompt(): Promise<number | null> {
      return new Promise<number | null>(async (resolve) => {
        const alert = await this.alertCtrl.create({
          header: 'Rate this movie',
          inputs: [
            {
              name: 'rating',
              type: 'number',
              min: 1,
              max: 10,
              placeholder: 'Enter rating (1-10)'
            }
          ],
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                resolve(null);
              }
            },
            {
              text: 'Rate',
              handler: (data: { rating: string }) => {
                const parsedRating = parseInt(data.rating, 10);
                if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 10) {
                  // Show an error message if the rating is invalid
                  this.showInvalidRatingAlert();
                  resolve(null);
                } else {
                  resolve(parsedRating);
                }
              }
            }
          ]
        });
  
        await alert.present();
      });
    }
  
    async showInvalidRatingAlert() {
      const alert = await this.alertCtrl.create({
        header: 'Invalid Rating',
        message: 'Please enter a valid rating between 1 and 10.',
        buttons: ['OK']
      });
  
    }
    
}
