import { Component, inject, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonText, IonCardContent, IonLabel, IonItem, IonIcon, IonButton, IonAlert } from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';
import { MovieResult } from '../services/interfaces';
import { addIcons } from 'ionicons';
import { calendarOutline, cashOutline} from 'ionicons/icons'
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: true,
  imports: [IonAlert, IonButton, IonIcon, IonItem, IonLabel, IonCardContent, IonText, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule],
})
export class DetailsPage implements OnInit {
  public movieService = inject(ApiService);//Injects Apiservice depandency
  public imageBaseUrl = 'https://image.tmdb.org/t/p';
  public movie: WritableSignal<MovieResult | null> = signal(null); //Signal that holds the currently selecred movie
  showAlert = false; //Alert variable set to control when to show alert 
  dismissButton = ['OK']; // Button for when the alert pops up

  /**
   * Setter method for the 'id' input
   * when a new movieId value is passed in it retrieves movie details
   * based on the movie id. It subscribes to 'getMovieDetails' which is
   * a method of movieService, this executes the observable and retrieves
   * the movie details. The details are then set to the signal 'movie'
   * 
   * @param movieId - identifier of the movies for which the details need to be retrieved. 
   * 
   */
  @Input()
  set id(movieId: string) {
    //retrieves movie detials from api based on id
    this.movieService.getMovieDetails(movieId).subscribe((movie) => { //subscribe executes observable
      console.log(movie);
      //sets movie details to signal
      this.movie.set(movie);
    });
  }  

  constructor(private storage: Storage) { 
    //function that adds icons from ionicons library
    addIcons({
      cashOutline,
      calendarOutline,
    });
  }

  ngOnInit(){
   this.createStorage(); 
  }

  async createStorage() {
    //initialises storage for component
    await this.storage.create();
  }

  /**
   * Asynchronously adds the current movie to the watchlist to storage.
   * If the current movie is not already in the watchlist, Its added and
   * saved to storage. If the current movie is already in the watchlist,
   * an alert is shown and it wont be added
   */
  async addToWatchlist() {
    const currentMovie = this.movie();
    if (currentMovie) {
      // Retrieve watchlist from storage or initialize if it doesn't exist
      const watchlist: MovieResult[] = (await this.storage.get('watchlist')) || [];

      //When its looping through the movies it searches for the movie by id. if its a match it cannot be added
      const isAlreadyAdded = watchlist.some(movie => movie.id === currentMovie.id)

      //if its not already added push it to the watchlist
      if(!isAlreadyAdded) {
      // Add current movie to watchlist
      watchlist.push(currentMovie);

      //save to storage
      await this.storage.set('watchlist', watchlist);
      } else {
        this.showAlert = true;
        console.log('movie is already in watchlist')
      }
    }
  }

  //called when dismiss button is pressed
  alertDismiss() {
    this.showAlert = false;
  }
}
