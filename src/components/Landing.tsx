import React from 'react';
import { IonContent, IonImg, IonPage, IonButton } from '@ionic/react';
import Login from './Login';
import Register from './Register';
import './Landing.css'
import logo from '../images/logofirulove2.png'
import letra from  '../images/logoletras.png'

const Landing: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen className="background">
        
        <div className="container">
          <IonImg className="logo" src={logo}></IonImg>
            <div className="container">
              <IonImg className="letra" src={letra}></IonImg>
            </div>
        </div>
        
        <div className="botones">
          <div className=" container-but container">
            <IonButton size="large" shape="round" routerDirection='root' expand='block' href="/login">Iniciar Sesión</IonButton>
            <IonButton size="large" shape="round" routerDirection='root' expand='block' href="/register">Registrarse</IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Landing;
