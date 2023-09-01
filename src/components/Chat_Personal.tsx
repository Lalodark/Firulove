import React, {useState, useRef } from 'react';
import { IonContent, IonLabel, IonPage, IonButton, IonImg, IonHeader, IonToolbar, IonIcon, IonTabBar, IonTabButton, IonModal,
IonTitle, IonButtons,IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonFab, IonFabButton, IonList,
IonItem, IonInput, IonFooter} from '@ionic/react';

import './Chat_Personal.css'

import firulais from '../images/firulais.jpg'
import fido from '../images/fido.jpg'
import dido from '../images/dido.jpg'
import cuscus from '../images/cuscus.jpg'
import yamila from '../images/yamila.jpg'


const Chat_Personal: React.FC = () => {
  
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonHeader>
          <IonToolbar>
            Chat App
          </IonToolbar>
        </IonHeader>
        <IonList className='fondo'>
          <IonItem className='chat-message sent'>
            Mensajito fachero
          </IonItem>
          <IonItem className='chat-message received'>
            Mensajito fachero
          </IonItem>
        </IonList>

        <IonFooter className='footer'>
            <IonItem className='chat'>
              <IonInput />
              <IonButton expand="full">Enviar</IonButton>
            </IonItem>
          </IonFooter>
      </IonContent>

    </IonPage>
  );
};

export default Chat_Personal;
