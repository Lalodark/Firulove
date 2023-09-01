import React, {useState, useRef, useEffect } from 'react';
import { IonContent, IonLabel, IonPage, IonButton, IonImg, IonHeader, IonToolbar, IonIcon, IonTabBar, IonTabButton, IonModal,
IonTitle, IonButtons, IonItem, IonAvatar } from '@ionic/react';
import './Chats.css'
import { OverlayEventDetail } from '@ionic/core/components';
import { searchOutline, pawOutline, chatbubbleEllipsesOutline, filter, personCircleOutline } from 'ionicons/icons';
import logo from '../images/logofirulove2.png'

import {auth, store} from '../firebase'
import { collection, query, where, getDocs } from "firebase/firestore";

import Filtros from './Filtros';
import Perfil from './Perfil';

import firulais from '../images/firulais.jpg'
import fido from '../images/fido.jpg'
import dido from '../images/dido.jpg'
import cuscus from '../images/cuscus.jpg'
import yamila from '../images/yamila.jpg'

const db = [
  {
    name: 'Firulais',
    url: firulais,
    age: 5,
    distance: 10
  },
  {
    name: 'Fido',
    url: fido,
    age: 7,
    distance: 8
  },
  {
    name: 'Dido',
    url: dido,
    age: 3,
    distance: 4
  },
  {
    name: 'Cuscus',
    url: cuscus,
    age: 6,
    distance: 12
  },
  {
    name: 'Yamila',
    url: yamila,
    age: 8,
    distance: 5
  }
]

const Chats: React.FC = () => {
  const characters = db
  const modal3 = useRef<HTMLIonModalElement>(null);
  const modal4 = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);
  const [datosUsuario, setDatosUsuario] = useState({
    nombre: '',
    apellido: '',
    email: '',
  });
  // const [message, setMessage] = useState(
  //   'This modal example uses triggers to automatically open a modal when the button is clicked.'
  // );

  function confirm() {
    modal3.current?.dismiss(input.current?.value, 'confirm');
  }

  const [mostrarModalcf, setMostrarModalcf] = useState(false);
  const [mostrarModalcp, setMostrarModalcp] = useState(false);

  const abrirModalcp = () => {
    setMostrarModalcp(true);
  };

  const cerrarModalcp = () => {
    setMostrarModalcp(false);
  };

  const abrirModalcf = () => {
    setMostrarModalcf(true);
  };

  const cerrarModalcf = () => {
    setMostrarModalcf(false);
  };

  useEffect(() => {
    const authUser = () =>{
      auth.onAuthStateChanged(async (usuarioActual) => {
        if (usuarioActual) {
          const email = usuarioActual.email;

          if (email) {
            // const usuarioRef = store.collection('usuarios').doc();
            // const doc = await usuarioRef.get();
            const usuarioss = collection(store,'usuarios')
            const user = query(usuarioss, where("email", "==", email))
            const querySnapshots = await getDocs(user)
            if (!querySnapshots.empty) {
                const doc = querySnapshots.docs[0];
                const data = doc.data()
                const { nombre, apellido } = data;
                setDatosUsuario({ nombre, apellido, email });
              }
            }
        }
      })
    }
    authUser()
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
            <IonHeader>
                <IonToolbar>
                    <IonButton fill="clear" onClick={abrirModalcf}>
                      <IonIcon aria-hidden="true" icon={filter} />
                    </IonButton>
                    <IonImg className="logoheader" src={logo}></IonImg>
                    <IonButton fill="clear" className='profile' size='default' onClick={abrirModalcp}>
                      <IonIcon aria-hidden="true" icon={personCircleOutline} />
                    </IonButton>
                </IonToolbar>
            </IonHeader>

            
            <div className='chats'>
              {characters.map((character) =>
                <IonItem button key={character.name}>
                  <IonAvatar slot="start">
                    <img src={character.url} />
                  </IonAvatar>
                  <IonLabel>
                    <h3>{character.name}</h3>
                    <p>Hola!</p>
                  </IonLabel>
                </IonItem>
              )}
            </div>
      </IonContent>

      <IonModal ref={modal3} isOpen={mostrarModalcf} onDidDismiss={cerrarModalcf}>
          <Filtros onClose={cerrarModalcf}></Filtros>
      </IonModal>


        <IonModal ref={modal4} isOpen={mostrarModalcp} onDidDismiss={cerrarModalcp}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => modal4.current?.dismiss()}>Cerrar</IonButton>
              </IonButtons>
              <IonTitle>Mi Perfil</IonTitle>
            </IonToolbar>
          </IonHeader>
          <Perfil datosUsuario={datosUsuario} onClose={cerrarModalcp} />
        </IonModal>
      
      

      <IonTabBar slot="bottom">
          <IonTabButton tab="mascotas" href="/mascotas">
            <IonIcon aria-hidden="true" icon={pawOutline} />
            <IonLabel>Mis Mascotas</IonLabel>
          </IonTabButton>
          <IonTabButton tab="menu" href="/menu">
            <IonIcon aria-hidden="true" icon={searchOutline} />
            <IonLabel>Buscar</IonLabel>
          </IonTabButton>
          <IonTabButton tab="chats" href="/chats">
            <IonIcon aria-hidden="true" icon={chatbubbleEllipsesOutline} />
            <IonLabel>Mis Chats</IonLabel>
          </IonTabButton>
        </IonTabBar>
    </IonPage>
  );
};

export default Chats;
