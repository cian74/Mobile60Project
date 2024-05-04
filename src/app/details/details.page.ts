import { Component, inject, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonText, IonCardContent, IonLabel, IonItem, IonIcon, IonButton } from '@ionic/angular/standalone';
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
  imports: [IonButton, IonIcon, IonItem, IonLabel, IonCardContent, IonText, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule],
})
export class DetailsPage implements OnInit {
  public movieService = inject(ApiService);
  public imageBaseUrl = 'https://image.tmdb.org/t/p';
  public movie: WritableSignal<MovieResult | null> = signal(null);

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

      // Add current movie to watchlist
      watchlist.push(currentMovie);

      // Save updated watchlist to storage
      await this.storage.set('watchlist', watchlist);
    }
  }

}
