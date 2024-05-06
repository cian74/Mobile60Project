import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton, IonList, IonGrid, IonCol, IonRow, IonCard, IonCardTitle, IonCardSubtitle, IonCardHeader, IonText, IonItem, IonLabel, IonCardContent, IonFooter } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { apertureOutline,logoIonic, fileTrayOutline, videocamOutline } from 'ionicons/icons';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-launch',
  templateUrl: './launch.page.html',
  styleUrls: ['./launch.page.scss'],
  standalone: true,
  imports: [IonFooter, IonCardContent, IonLabel, IonItem, IonText, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCard, IonRow, IonCol, IonGrid, IonList, RouterLinkWithHref, IonButton, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class LaunchPage implements OnInit {

  constructor() {
    //adds icons from ionicons library
    addIcons({
      apertureOutline,
      videocamOutline,
      fileTrayOutline,
      logoIonic
    })
   }

  ngOnInit() {
  }

}
