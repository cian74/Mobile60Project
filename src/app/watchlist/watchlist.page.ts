import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButton,IonBackButton,IonButtons, IonItem, IonList,IonLabel } from '@ionic/angular/standalone';
import { MovieResult } from '../services/interfaces';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.page.html',
  styleUrls: ['./watchlist.page.scss'],
  standalone: true,
  imports: [IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonBackButton,IonButton,IonButtons,IonList,IonLabel]
})
export class WatchlistPage implements OnInit{
    public watchlist: MovieResult[] = [];
  
    constructor(private storage: Storage, private router: Router) {}
  
    ngOnInit() {
      this.loadWatchlist();
    }
  
    async loadWatchlist() {
      await this.storage.create();
      const savedWatchlist = await this.storage.get('watchlist');
      this.watchlist = savedWatchlist || [];
    }

    goToDetailsPage(id: number) {
      this.router.navigateByUrl(`/details/${id}`);
    }
}
