import React, {useState, useRef, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonImg, IonToolbar, IonTabBar, IonTabButton, IonIcon, IonLabel, IonButton, IonModal, IonItem, IonTitle,
IonInput, IonButtons, IonSelect, IonSelectOption, IonRange, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle} from '@ionic/react';
import TinderCard from 'react-tinder-card'
import {auth, store} from '../firebase'
import logo from '../images/logofirulove2.png'
import './Menu.css'
import { OverlayEventDetail } from '@ionic/core/components';
import { searchOutline, pawOutline, chatbubbleEllipsesOutline, filter, personCircleOutline, heartSharp, closeSharp } from 'ionicons/icons';

import Filtros from './Filtros';
import Perfil from './Perfil';
import { collection, query, where, getDocs } from "firebase/firestore";

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

const Menu: React.FC = () => {
  const characters = db
  const [lastDirection, setLastDirection] = useState('')
  const [datosUsuario, setDatosUsuario] = useState({
    nombre: '',
    apellido: '',
    email: '',
  });

  const swiped = (direction:string, nameToDelete:string) => {
    console.log('removing: ' + nameToDelete + 'in direction: ' + direction )
    setLastDirection(direction)
  }

  const outOfFrame = (name:string) => {
    console.log(name + ' left the screen!')
  }

  const modal1 = useRef<HTMLIonModalElement>(null);
  const modal2 = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);

  // const [message, setMessage] = useState(
  //   'This modal example uses triggers to automatically open a modal when the button is clicked.'
  // );

  function confirm() {
    modal1.current?.dismiss(input.current?.value, 'confirm');
  }


  const [mostrarModalmf, setMostrarModalmf] = useState(false);
  const [mostrarModalmp, setMostrarModalmp] = useState(false);

  const abrirModalmp = () => {
    setMostrarModalmp(true);
  };

  const cerrarModalmp = () => {
    setMostrarModalmp(false);
  };

  const abrirModalmf = () => {
    setMostrarModalmf(true);
  };

  const cerrarModalmf = () => {
    setMostrarModalmf(false);
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
            <IonButton fill="clear" onClick={abrirModalmf}>
              <IonIcon aria-hidden="true" icon={filter} />
            </IonButton>
            <IonImg className="logoheader" src={logo}></IonImg>
            <IonButton fill="clear" className='profile' size='default' onClick={abrirModalmp}>
              <IonIcon aria-hidden="true" icon={personCircleOutline} />
            </IonButton>
          </IonToolbar>
        </IonHeader>

        <IonModal ref={modal1} isOpen={mostrarModalmf} onDidDismiss={cerrarModalmf}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => modal1.current?.dismiss()}>Cancelar</IonButton>
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


        <IonModal ref={modal2} isOpen={mostrarModalmp} onDidDismiss={cerrarModalmp}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => modal2.current?.dismiss()}>Cerrar</IonButton>
              </IonButtons>
              <IonTitle>Mi Perfil</IonTitle>
            </IonToolbar>
          </IonHeader>
          <Perfil datosUsuario={datosUsuario} onClose={cerrarModalmp} />
        </IonModal>
  
      <div className='generic'>
          <div className='cardContainer generic'>
            {characters.map((character) =>
              <TinderCard className='swipe generic' key={character.name} onSwipe={(dir) => swiped(dir, character.name)} onCardLeftScreen={() => outOfFrame(character.name)}>
                <div style={{ backgroundImage: 'url(' + character.url + ')' }} className='card'>
                  {/* <h3>{character.name}</h3> */}
                </div>
              </TinderCard>
            )}
          </div>
          {lastDirection ? <h2 className='infoText'>You swiped {lastDirection}</h2> : <h2 className='infoText' />}  
        </div>       
        <div className='buttons'>
          <IonButton shape='round' color={'danger'} size='large'>
            <IonIcon aria-hidden="true" icon={closeSharp} />
          </IonButton>
          <IonButton shape='round' color={'success'} size='large' className='likebutton'>
            <IonIcon aria-hidden="true" icon={heartSharp} />
          </IonButton>
      </div>
      <div>
      {characters.map((character) =>
        <IonCard key={character.name} className='cards'>
          <IonCardHeader>
            <IonCardTitle>{character.name}, {character.age}</IonCardTitle>
            <IonCardSubtitle>{character.distance} Km</IonCardSubtitle>
          </IonCardHeader>
  
          <IonCardContent>Descripción de la mascota.</IonCardContent>
        </IonCard>
      )}
      </div>
      

      </IonContent>

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

export default Menu;
