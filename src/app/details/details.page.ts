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
  public movieService = inject(ApiService);
  public imageBaseUrl = 'https://image.tmdb.org/t/p';
  public movie: WritableSignal<MovieResult | null> = signal(null);
  showAlert = false;
  dismissButton = ['OK']; // button for when the alert pops up

  @Input()
  set id(movieId: string) {
    this.movieService.getMovieDetails(movieId).subscribe((movie) => {
      console.log(movie);
      this.movie.set(movie);
    });
  }  

  constructor(private storage: Storage) { 
    addIcons({
      cashOutline,
      calendarOutline,
    });
  }

  ngOnInit(){
   this.createStorage(); 
  }

  async createStorage() {
    await this.storage.create();
  }

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

      //save
      await this.storage.set('watchlist', watchlist);
      } else {
        this.showAlert = true;
        console.log('movie is already in watchlist')
      }
    }
  }

  alertDismiss() {
    this.showAlert = false;
  }
}
