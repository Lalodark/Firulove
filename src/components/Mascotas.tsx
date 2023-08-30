import React, {useState, useRef, useEffect } from 'react';
import { IonContent, IonLabel, IonPage, IonButton, IonImg, IonHeader, IonToolbar, IonIcon, IonTabBar, IonTabButton, IonModal,
IonTitle, IonButtons,IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonFab, IonFabButton, IonGrid,
IonRow, IonCol } from '@ionic/react';
import './Mascotas.css'

import { searchOutline, pawOutline, chatbubbleEllipsesOutline, filter, personCircleOutline, createOutline, trashOutline, addOutline } from 'ionicons/icons';
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

const Mascotas: React.FC = () => {
  const characters = db
  const modal5 = useRef<HTMLIonModalElement>(null);
  const modal6 = useRef<HTMLIonModalElement>(null);
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
    modal5.current?.dismiss(input.current?.value, 'confirm');
  }


  const [mostrarModalmaf, setMostrarModalmaf] = useState(false);
  const [mostrarModalmap, setMostrarModalmap] = useState(false);

  const abrirModalmap = () => {
    setMostrarModalmap(true);
  };

  const cerrarModalmap = () => {
    setMostrarModalmap(false);
  };

  const abrirModalmaf = () => {
    setMostrarModalmaf(true);
  };

  const cerrarModalmaf = () => {
    setMostrarModalmaf(false);
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
                    <IonButton fill="clear" onClick={abrirModalmaf}>
                      <IonIcon aria-hidden="true" icon={filter} />
                    </IonButton>
                    <IonImg className="logoheader" src={logo}></IonImg>
                    <IonButton fill="clear" className='profile' size='default' onClick={abrirModalmap}>
                      <IonIcon aria-hidden="true" icon={personCircleOutline} />
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <div>
            {characters.map((character) =>
              <IonCard key={character.name} button>
                <IonCardHeader>
                  <img src={character.url} />
                  <IonCardTitle>{character.name}</IonCardTitle>
                  <IonCardSubtitle>Edad: {character.age}</IonCardSubtitle>
                </IonCardHeader>

                <IonCardContent>Descripción del animalitou</IonCardContent>

                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonButton expand="block" color="secondary">
                        <IonIcon aria-hidden="true" icon={createOutline}></IonIcon>
                      </IonButton>
                    </IonCol>
                    <IonCol>
                      <IonButton expand="block">
                        <IonIcon aria-hidden="true" icon={trashOutline}></IonIcon>
                      </IonButton>                      
                    </IonCol>
                  </IonRow>
                </IonGrid>
                

              </IonCard>
            )}
            </div>

            <IonFab slot="fixed" vertical="bottom" horizontal="end">
              <IonFabButton href='/mascotas/create'>
                <IonIcon icon={addOutline}></IonIcon>
              </IonFabButton>
            </IonFab>
            
      </IonContent>

      <IonModal ref={modal5} isOpen={mostrarModalmaf} onDidDismiss={cerrarModalmaf}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => modal5.current?.dismiss()}>Cancelar</IonButton>
              </IonButtons>
              <IonTitle>Filtros</IonTitle>
              <IonButtons slot="end">
                <IonButton strong={true} onClick={() => confirm()}>
                  Aplicar
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <Filtros></Filtros>
        </IonModal>


        <IonModal ref={modal6} isOpen={mostrarModalmap} onDidDismiss={cerrarModalmap}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => modal6.current?.dismiss()}>Cerrar</IonButton>
              </IonButtons>
              <IonTitle>Mi Perfil</IonTitle>
            </IonToolbar>
          </IonHeader>
          <Perfil datosUsuario={datosUsuario} onClose={cerrarModalmap} />
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

export default Mascotas;
