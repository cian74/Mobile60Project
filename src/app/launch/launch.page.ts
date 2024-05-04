import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton, IonList, IonGrid, IonCol, IonRow } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { videocam } from 'ionicons/icons';
import { RouterLinkWithHref } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-launch',
  templateUrl: './launch.page.html',
  styleUrls: ['./launch.page.scss'],
  standalone: true,
  imports: [IonRow, IonCol, IonGrid, IonList, RouterLinkWithHref, IonButton, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class LaunchPage implements OnInit {

  constructor() {
    addIcons({
      videocam
    })
   }

  ngOnInit() {
  }

}
