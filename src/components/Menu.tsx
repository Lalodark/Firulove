import React, {useState, useRef, useEffect, useReducer } from 'react';
import { IonContent, IonHeader, IonPage, IonImg, IonToolbar, IonTabBar, IonTabButton, IonIcon, IonLabel, IonButton, IonModal, IonItem, IonTitle,
IonInput, IonButtons, IonSelect, IonSelectOption, IonRange, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle} from '@ionic/react';
import TinderCard from 'react-tinder-card'
import {auth, store} from '../firebase'
import logo from '../images/logofirulove2.png'
import './Menu.css'
import { searchOutline, pawOutline, chatbubbleEllipsesOutline, filter, personCircleOutline, heartSharp, closeSharp } from 'ionicons/icons';

import Filtros from './Filtros';
import Perfil from './Perfil';
import { collection, query, where, getDocs } from "firebase/firestore";

import firulais from '../images/firulais.jpg'
import fido from '../images/fido.jpg'
import dido from '../images/dido.jpg'
import cuscus from '../images/cuscus.jpg'
import yamila from '../images/yamila.jpg'

const Menu: React.FC = () => {
  const [lastDirection, setLastDirection] = useState('')
  const [datosUsuario, setDatosUsuario] = useState({
    nombre: '',
    apellido: '',
    email: '',
    id:'',
    activepet:''
  });
  

  interface Mascota {
    // Define aquí las propiedades de las mascotas, como nombre, edad, latitud, longitud, etc.
    id:string,
    nombre:string,
    edad:number,
    especie:string,
    raza:string,
    descripcion:string,
    sexo: string,
    color : string[],
    distancia:number
  }
  const [mascotasFiltradas, setMascotasFiltradas] = useState<Mascota[]>([]);
  const [currentPetIndex, setCurrentPetIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hayMascotasDisponibles, setHayMascotasDisponibles] = useState(true);

  const swiped = (direction:string, nameToDelete:string) => {
    console.log('removing: ' + nameToDelete + 'in direction: ' + direction )
    setLastDirection(direction)
    setCurrentPetIndex(currentPetIndex + 1);
  }

  const outOfFrame = (name:string) => {
    console.log(name + ' left the screen!')
  }

  const modal1 = useRef<HTMLIonModalElement>(null);
  const modal2 = useRef<HTMLIonModalElement>(null);


  const [mostrarModalmf, setMostrarModalmf] = useState(false);
  const [mostrarModalmp, setMostrarModalmp] = useState(false);

  const handleSwipeLeft = () => {
    // Simular un swipe a la izquierda
    swiped('left', mascotasFiltradas[currentPetIndex].nombre);
    if (currentPetIndex + 1 === mascotasFiltradas.length) {
      setHayMascotasDisponibles(false);
    }
  };

  const handleSwipeRight = () => {
    // Simular un swipe a la derecha
    swiped('right', mascotasFiltradas[currentPetIndex].nombre);
    if (currentPetIndex + 1 === mascotasFiltradas.length) {
      setHayMascotasDisponibles(false);
    }
  };

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

  function calcularDistancia(lat1:any, lon1:any, lat2:any, lon2:any) {
    // Radio de la Tierra en kilómetros
    const radioTierra = 6371;
  
    // Convertir las latitudes y longitudes de grados a radianes
    const latitud1Rad = (Math.PI / 180) * lat1;
    const longitud1Rad = (Math.PI / 180) * lon1;
    const latitud2Rad = (Math.PI / 180) * lat2;
    const longitud2Rad = (Math.PI / 180) * lon2;
  
    // Diferencia de latitud y longitud
    const diferenciaLatitud = latitud2Rad - latitud1Rad;
    const diferenciaLongitud = longitud2Rad - longitud1Rad;
  
    // Calcular la distancia utilizando la fórmula haversine
    const a =
      Math.sin(diferenciaLatitud / 2) ** 2 +
      Math.cos(latitud1Rad) *
        Math.cos(latitud2Rad) *
        Math.sin(diferenciaLongitud / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = radioTierra * c;
  
    return distancia;
  }

  useEffect(() => {

    const traerMascotas = async (activepet:any, id:any) => 
    {
      const mascotasAgregadas = new Set();
      const mascotasFiltradasNuevas:Mascota[] = [];
      const mascotass = collection(store, 'mascotas')
      const mascotaactual = query(mascotass, where("idmascota", "==", activepet)) 
      const querymascota = await getDocs(mascotaactual)
      const docm = querymascota.docs[0];
      const datam = docm.data();
      const {latitud, longitud} = datam;
      const distanciaMascotaActual = {
        latitud: latitud,// La latitud de la mascota actual,
        longitud: longitud// La longitud de la mascota actual,
      };

      const filtross = collection(store, 'filtros')
      const filtro = query(filtross, where("idmascota", "==", activepet)) 
      const queryfiltro = await getDocs(filtro)
      const doc = queryfiltro.docs[0];
      const data = doc.data();
      const {distancia, edadMaxima, edadMinima, especie, raza, sexo} = data;
      const mascotas = collection(store, 'mascotas');
      const matchesc = collection(store, 'matchesfallidos');
      const matchese = collection(store, 'matchesexitosos');
      try{
        const query1 = query(mascotas,
          where("idusuario", "!=", id),
          where("especie", "==", especie),
          where("raza", "==", raza),
          where("sexo", "==", sexo)
        );
        
        
        const querySnapshot1 = await getDocs(query1);

        const mascotasFiltradass = querySnapshot1.docs.filter(doc => {
          const {edad} = doc.data(); // Asumiendo que tienes un campo "edad" en tus documentos
          return edad >= edadMinima && edad <= edadMaxima;
        });
      


        mascotasFiltradass.forEach(async (doc) => {
          const mascota = doc.data();
          const distanciaf = Math.round(calcularDistancia(
            distanciaMascotaActual.latitud,
            distanciaMascotaActual.longitud,
            mascota.latitud, // Latitud de la mascota en el documento
            mascota.longitud // Longitud de la mascota en el documento
          ));

          const querymf1 = query(matchesc,
            where("idmascota1", "==", mascota.idmascota), // Compara con los IDs de las mascotas filtradas
            where("idmascota2", "==", activepet) // Compara con el ID de la mascota actual
          );
  
          const querymf2 = query(matchesc,
            where("idmascota2", "==", mascota.idmascota),
            where("idmascota1", "==", activepet)
          );

          const queryme1 = query(matchesc,
            where("idmascota1", "==", mascota.idmascota), // Compara con los IDs de las mascotas filtradas
            where("idmascota2", "==", activepet) // Compara con el ID de la mascota actual
          );
  
          const queryme2 = query(matchesc,
            where("idmascota2", "==", mascota.idmascota),
            where("idmascota1", "==", activepet)
          );
  
          const querySnapshotmf1 = await getDocs(querymf1);
          const querySnapshotmf2 = await getDocs(querymf2);
          const querySnapshotme1 = await getDocs(queryme1);
          const querySnapshotme2 = await getDocs(queryme2);

          if (distanciaf <= distancia) {
            const {idmascota, nombre, edad, especie, raza, sexo, descripcion, color} = mascota
            // Agregar la mascota a la lista de mascotas filtradas si cumple con la distancia máxima
            if(querySnapshotmf1.empty && querySnapshotmf2.empty && querySnapshotme1.empty && querySnapshotme2.empty && !mascotasAgregadas.has(idmascota)){
              mascotasFiltradasNuevas.push({ ...mascota, id:idmascota, nombre:nombre, edad:edad, especie:especie,
                raza:raza, sexo:sexo, descripcion:descripcion,color:color, distancia:distanciaf });
            }
            mascotasAgregadas.add(idmascota);
          }       
        });

        setTimeout(() => {
          setMascotasFiltradas(mascotasFiltradasNuevas);
          setIsLoading(false);
        }, 5000)
        
      }

      catch(e)
      {
        console.log("No se encontraron mascotas! Error: ", e)
      }
    }

    const authUser = () =>{
      auth.onAuthStateChanged(async (usuarioActual) => {
        if (usuarioActual) {
          const email = usuarioActual.email;

          if (email) {
            const usuarioss = collection(store,'usuarios')
            const user = query(usuarioss, where("email", "==", email))
            const querySnapshots = await getDocs(user)
            if (!querySnapshots.empty) {
                const doc = querySnapshots.docs[0];
                const data = doc.data()
                const { nombre, apellido, id, activepet } = data;
                setDatosUsuario({ nombre, apellido, email, id, activepet });
                traerMascotas(activepet, id)
              }
            }
        }
      })
    } 
    authUser();
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
          <Filtros onClose={cerrarModalmf}></Filtros>
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
            {hayMascotasDisponibles ? 
            (mascotasFiltradas.slice(currentPetIndex, currentPetIndex + 1).map((character) =>
              <TinderCard className='swipe generic' key={character.nombre} 
              onSwipe={(dir) => 
                {swiped(dir, character.nombre);
                  if (currentPetIndex + 1 === mascotasFiltradas.length) {
                    setHayMascotasDisponibles(false);
                  }
                }}
              onCardLeftScreen={() => outOfFrame(character.nombre)} 
              preventSwipe={['up', 'down']}>
                <div style={{ backgroundImage: 'url(' + firulais + ')' }} className='card'></div>
              </TinderCard>)):
              (
                <div>No hay más mascotas disponibles.</div>
              )
            }
          </div>
          {lastDirection ? <h2 className='infoText'>You swiped {lastDirection}</h2> : <h2 className='infoText' />}  
        </div>       
        <div className='buttons'>
          <IonButton shape='round' color={'danger'} size='large' onClick={handleSwipeLeft}>
            <IonIcon aria-hidden="true" icon={closeSharp}/>
          </IonButton>
          <IonButton shape='round' color={'success'} size='large' className='likebutton' onClick={handleSwipeRight}>
            <IonIcon aria-hidden="true" icon={heartSharp} />
          </IonButton>
      </div>
      <div>
          {isLoading ? (
            <div>Cargando datos...</div>
          ) : (
            <div> 
              {
                hayMascotasDisponibles ? (
                <IonCard key={mascotasFiltradas[currentPetIndex].nombre} className={`cards`}>
                  <IonCardHeader>
                    <IonCardTitle>{mascotasFiltradas[currentPetIndex].nombre}, {mascotasFiltradas[currentPetIndex].edad} años</IonCardTitle>
                    <IonCardSubtitle>{mascotasFiltradas[currentPetIndex].distancia} Km</IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>{mascotasFiltradas[currentPetIndex].descripcion}</IonCardContent>
                </IonCard>
                )
                :
                (
                  <span></span>
                )
              }      
            </div>
          )
        }
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
