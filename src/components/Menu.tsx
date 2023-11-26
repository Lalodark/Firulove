import React, { useState, useRef, useEffect } from 'react';
import TinderCard from 'react-tinder-card'
import { Geolocation } from '@ionic-native/geolocation';

import { IonContent, IonHeader, IonPage, IonImg, IonToolbar, IonTabBar, IonTabButton, IonIcon, IonLabel, IonButton, IonModal, IonTitle,
IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonAlert, useIonViewWillEnter, IonSpinner, IonBadge,
IonChip} from '@ionic/react';
import { searchOutline, pawOutline, chatbubbleEllipsesOutline, filter, personCircleOutline, heartSharp, closeSharp, maleSharp, femaleSharp } from 'ionicons/icons';

import uniqid from 'uniqid';

import Filtros from './Filtros';
import Perfil from './Perfil';

import { auth, store } from '../firebase'
import { collection, query, where, getDocs, deleteDoc, doc, Timestamp } from "firebase/firestore";

import './Menu.css'
import logo from '../images/logofirulove2.png'
import firulais from '../images/firulais.jpg'
import triste from '../images/Triste.png'

import * as tf from '@tensorflow/tfjs';


declare global {
  interface Window {
    googletag: {
      cmd: ((callback: () => void) => void)[];
      companionAds?: any;
      defineOutOfPageSlot?: any;
      defineSlot?: any;
      defineUnit?: any;
    };
  }
}
const Menu: React.FC = () => {

  //Variables & Declaraciones
  const [lastDirection, setLastDirection] = useState('')
  let rewardedSlot: googletag.Slot|null;

  const [datosUsuario, setDatosUsuario] = useState({
    nombre: '',
    apellido: '',
    email: '',
    id:'',
    activepet:'',
    likes: 0,
    dayLikes: Timestamp.now()
  });

  
  interface Mascota {
    id:string,
    nombre:string,
    edad:number,
    especie:string,
    raza:string,
    descripcion:string,
    sexo: string,
    color : string[],
    distancia:number,
    imagenUrl:string,
    likesrecibidos: number
  }

// Define un objeto de mapeo para los colores de especie
  const speciesColors: { [key: string]: string } = {
    Perro: 'primary',
    Gato: 'secondary',
    Roedor: 'tertiary',
    Pájaro: 'warning',
    Reptil: 'dark',
    Anfibio: 'success',
    Pez: 'primary',
    Otro: 'secondary',
  };

  // Define un objeto de mapeo para los colores de raza
  const raceColors: { [key: string]: string } = {
    Perro: '#cf3c4f',
    Gato: '#36abe0',
    Roedor: '#4854e0',
    Pájaro: '#e0ac08',
    Reptil: '#1e2023',
    Anfibio: '#28ba62',
    Pez: '#cf3c4f',
    Otro: '#36abe0',
  };

  const coloresMap: { [key: string]: { background: string, text: string } } = {
    Blanco: { background: 'rgb(255, 255, 255)', text: 'rgb(0, 0, 0)' },
    Negro: { background: 'rgb(0, 0, 0)', text: 'rgb(255, 255, 255)' },
    Gris: { background: 'rgb(169, 169, 169)', text: 'rgb(0, 0, 0)' },
    Marron: { background: 'rgb(139, 69, 19)', text: 'rgb(255, 255, 255)' },
    Naranja: { background: 'rgb(255, 165, 0)', text: 'rgb(0, 0, 0)' },
    Amarillo: { background: 'rgb(255, 255, 0)', text: 'rgb(0, 0, 0)' },
    Atigrado: { background: 'rgb(128, 0, 0)', text: 'rgb(255, 255, 255)' },
    Manchado: { background: 'rgb(0, 0, 128)', text: 'rgb(255, 255, 255)' },
    Rojo: { background: 'rgb(255, 0, 0)', text: 'rgb(255, 255, 255)' },
    Azul: { background: 'rgb(0, 0, 255)', text: 'rgb(255, 255, 255)' },
    Verde: { background: 'rgb(0, 128, 0)', text: 'rgb(255, 255, 255)' },
  };
  
  const [mascotasFiltradas, setMascotasFiltradas] = useState<Mascota[]>([]);
  const [currentPetIndex, setCurrentPetIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [doc_id, setDocId] = useState('')
  const [hayMascotasDisponibles, setHayMascotasDisponibles] = useState(true);
  const [buttons, setButtons] = useState(false);

  const modal1 = useRef<HTMLIonModalElement>(null);
  const modal2 = useRef<HTMLIonModalElement>(null);

  const [mostrarModalmf, setMostrarModalmf] = useState(false);
  const [mostrarModalmp, setMostrarModalmp] = useState(false);
  const [showMatchPopup, setShowMatchPopup] = useState(false);
  const [mensajeMatch, setMensajeMatch] = useState<string>('')
  const [displayAd, setDisplayAd] = useState(false);
  const [showAdAlert, setShowAdAlert] = useState(false);
  const [showRewardAlert, setShowRewardAlert] = useState(false);
  //Funciones
  
  const swiped = (direction:string, nameToDelete:string) => {
    if(direction == 'left'){
      matchfallido(mascotasFiltradas[currentPetIndex].id)
    }
    if(direction == 'right'){
      matchexitoso(mascotasFiltradas[currentPetIndex].id)
    }
    console.log('removing: ' + nameToDelete + 'in direction: ' + direction )
    if (currentPetIndex + 1 === mascotasFiltradas.length) {
      setHayMascotasDisponibles(false);
      setButtons(false);
    }
    setCurrentPetIndex(currentPetIndex + 1);
  }

  const matchfallido = async (id:string) => {
    const matchf= {
      idmascota1: id,
      idmascota2: datosUsuario.activepet
    }
    await store.collection('matchesfallidos').add(matchf)
    console.log("Match cancelado!")
  }

  const matchexitoso = async (id:string) => {
    const sug = collection(store,'sugerencias')
    const mascs = collection(store,'mascotas')

    const pet = query(mascs, where("idmascota", "==", id))
    const querySnapshotsl = await getDocs(pet)
    const docl = querySnapshotsl.docs[0]
    const data = docl.data();
    const {nombre} = data;
    const mascotasFiltradasPorId = mascotasFiltradas.filter((mascota) => mascota.id === id)
    const likes = mascotasFiltradasPorId[0].likesrecibidos + 1;
    await store.collection('mascotas').doc(docl.id).update({'likesrecibidos': likes})


    const petcolor = query(sug, where("idmascota", "==", datosUsuario.activepet))
    const querySnapshotsc = await getDocs(petcolor)
    const docc = querySnapshotsc.docs[0]
    const {coloresLikes} = docc.data()
    
    const mascotasFiltradasPorIdColor = mascotasFiltradas.filter((mascota) => mascota.id === id)
    const colores = mascotasFiltradasPorIdColor[0].color

    colores.forEach((color) => {
      // Busca el objeto correspondiente en 'coloresLikes' usando findIndex
      const index = coloresLikes.findIndex((item:any) => item.color === color);
    
      // Si se encuentra el color en 'coloresLikes', incrementa los 'likes'
      if (index !== -1) {
        coloresLikes[index].likes += 1;
      }
    });
    await store.collection('sugerencias').doc(docc.id).update({'coloresLikes': coloresLikes})
    
    const matchesp = collection(store, 'matchespendientes');

    const querymp1 = query(matchesp,
      where("idmascotaliker", "==", id), 
      where("idmascotapending", "==", datosUsuario.activepet) 
    );

    const querymp2 = query(matchesp,
      where("idmascotapending", "==", id),
      where("idmascotaliker", "==", datosUsuario.activepet)
    );

    const querySnapshotmp1 = await getDocs(querymp1);
    const querySnapshotmp2 = await getDocs(querymp2);

    if(querySnapshotmp1.empty && querySnapshotmp2.empty)
    {
      const matchp= {
        idmascotaliker: datosUsuario.activepet,
        idmascotapending: id
      }
      await store.collection('matchespendientes').add(matchp)
      console.log("Match pendiente!")
    }
    else{
        if(querySnapshotmp2.empty){
          const docs = querySnapshotmp1.docs[0];
          await deleteDoc(doc(store, 'matchespendientes', docs.id));
        }
        else{
          const docs = querySnapshotmp2.docs[0];
          await deleteDoc(doc(store, 'matchespendientes', docs.id));
        }
      const matche = {
        idmascota1: id,
        idmascota2: datosUsuario.activepet,
        idchat: uniqid()
      }
      const chat = {
        chatid: matche.idchat,
        messages: []
      }
      await store.collection('matchesexitosos').add(matche)
      await store.collection('chats').add(chat)
      setMensajeMatch('¡Match exitoso con ' + nombre + '!')
      setShowMatchPopup(true);
    }
  }

  const outOfFrame = (name:string) => {
    console.log(name + ' left the screen!')
  }

  const handleSwipeLeft = () => {
    const card = document.querySelector('.swipe.generic') as HTMLElement;
    if (card) {
      card.style.animation = 'swipe-left 0.3s ease-in-out';
      setTimeout(() => {
        swiped('left', mascotasFiltradas[currentPetIndex].nombre); 
        card.style.animation = ''; 
      }, 300); 
    }
  };

  const handleSwipeRight = () => {
    const card = document.querySelector('.swipe.generic') as HTMLElement;
    if (card && datosUsuario.likes > 0) {
      datosUsuario.likes -= 1;
      store.collection('usuarios').doc(doc_id).update({'likes': datosUsuario.likes })
      card.style.animation = 'swipe-right 0.3s ease-in-out';
      setTimeout(() => {
        swiped('right', mascotasFiltradas[currentPetIndex].nombre); 
        card.style.animation = ''; 
      }, 400); 
    }
    else
    {
      setShowAdAlert(true);
    }
  };

  const showAd = () => {
    window.googletag = window.googletag || { cmd: [] };

    let rewardedSlot: googletag.Slot | null;

    window.googletag.cmd.push(() => {
      rewardedSlot = googletag.defineOutOfPageSlot(
        '/22639388115/rewarded_web_example',
        googletag.enums.OutOfPageFormat.REWARDED
      );

      if (rewardedSlot) {
        rewardedSlot.addService(googletag.pubads());

        googletag.pubads().addEventListener('rewardedSlotReady', (event) => {
          event.makeRewardedVisible();
        });

        googletag.pubads().addEventListener('rewardedSlotClosed', (event) => {
          // Automatically close the ad by destroying the slot.
          // Remove this to force the user to close the ad themselves.
          if(rewardedSlot){
            googletag.destroySlots([rewardedSlot]);
          }
          
        });

        googletag.pubads().addEventListener('rewardedSlotGranted', async (event) => {
          if(rewardedSlot){
            googletag.destroySlots([rewardedSlot]);
          }
          setShowRewardAlert(true)
          datosUsuario.likes += 5;
          await store.collection('usuarios').doc(doc_id).update({'likes': datosUsuario.likes })
        });

          
        googletag.enableServices();
        googletag.display(rewardedSlot);
      }
    });
  }

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
    const radioTierra = 6371;
  
    const latitud1Rad = (Math.PI / 180) * lat1;
    const longitud1Rad = (Math.PI / 180) * lon1;
    const latitud2Rad = (Math.PI / 180) * lat2;
    const longitud2Rad = (Math.PI / 180) * lon2;
  
    const diferenciaLatitud = latitud2Rad - latitud1Rad;
    const diferenciaLongitud = longitud2Rad - longitud1Rad;
  
    const a =
      Math.sin(diferenciaLatitud / 2) ** 2 +
      Math.cos(latitud1Rad) *
        Math.cos(latitud2Rad) *
        Math.sin(diferenciaLongitud / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = radioTierra * c;
  
    return distancia;
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
              const { nombre, apellido, id, activepet, likes, dayLikes } = data;
              setDocId(doc.id)
              setDatosUsuario({ ...datosUsuario, nombre, apellido, email, id, activepet, likes, dayLikes });
              if(activepet != '')
              {
                actualizarUbicación(activepet)
                traerMascotas(activepet, id)
                actualizarLikes(dayLikes, doc.id)
              }
              else
              {
                setIsLoading(false);
                setHayMascotasDisponibles(false);
              }
            }
          }
      }
    })
  } 

  const actualizarUbicación = async (activepet:any) => {
  
    const position = await Geolocation.getCurrentPosition();
    const { latitude, longitude } = position.coords;
    const mascotass = collection(store,'mascotas')
    const pet = query(mascotass, where("idmascota", "==", activepet))
    const querySnapshots = await getDocs(pet)
    const doc = querySnapshots.docs[0]
    await store.collection('mascotas').doc(doc.id).update({'latitud': latitude, 'longitud': longitude})
  }

  const actualizarLikes = async (dayLikes:any, docid:any) => {
      const fechaActual = new Date();
      const fechaAnterior = new Date(dayLikes.toMillis());

      const diaActual = fechaActual.getDate();
      const mesActual = fechaActual.getMonth() + 1;
      const anioActual = fechaActual.getFullYear();
      
      const diaAnterior = fechaAnterior.getDate();
      const mesAnterior = fechaAnterior.getMonth() + 1;
      const anioAnterior = fechaAnterior.getFullYear();
      
      if (anioActual === anioAnterior && mesActual === mesAnterior && diaActual === diaAnterior) {
        console.log("Las fechas son iguales, no hay likes");
      } else {
        await store.collection('usuarios').doc(docid).update({'dayLikes': Timestamp.now() })
        await store.collection('usuarios').doc(docid).update({'likes': 15 })
      }
  }
  
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
        latitud: latitud,
        longitud: longitud
      };
      
      const filtross = collection(store, 'filtros')
      const filtro = query(filtross, where("idmascota", "==", activepet)) 
      const queryfiltro = await getDocs(filtro)
      const doc = queryfiltro.docs[0];
      const data = doc.data();
      const {distancia, edadMaxima, edadMinima, especie, raza, sexo} = data;
      const mascotas = collection(store, 'mascotas');
      const matchesc = collection(store, 'matchesfallidos');
      const matchesp = collection(store, 'matchespendientes')
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
          const {edad} = doc.data(); 
          return edad >= edadMinima && edad <= edadMaxima;
        });

        mascotasFiltradass.forEach(async (doc) => {
          const mascota = doc.data();
          const distanciaf = Math.round(calcularDistancia(
            distanciaMascotaActual.latitud,
            distanciaMascotaActual.longitud,
            mascota.latitud, 
            mascota.longitud 
          ));

          const querymf1 = query(matchesc,
            where("idmascota1", "==", mascota.idmascota), 
            where("idmascota2", "==", activepet) 
          );
  
          const querymf2 = query(matchesc,
            where("idmascota2", "==", mascota.idmascota),
            where("idmascota1", "==", activepet)
          );

          const queryme1 = query(matchese,
            where("idmascota1", "==", mascota.idmascota), 
            where("idmascota2", "==", activepet) 
          );
  
          const queryme2 = query(matchese,
            where("idmascota2", "==", mascota.idmascota),
            where("idmascota1", "==", activepet)
          );

          const querymp = query(matchesp,
            where("idmascotaliker", "==", activepet),
            where("idmascotapending", "==", mascota.idmascota))

          const querySnapshotmf1 = await getDocs(querymf1);
          const querySnapshotmf2 = await getDocs(querymf2);
          const querySnapshotme1 = await getDocs(queryme1);
          const querySnapshotme2 = await getDocs(queryme2);
          const querySnapshotmp = await getDocs(querymp)
          

          if (distanciaf <= distancia) {
            const {idmascota, nombre, edad, especie, raza, sexo, descripcion, color, imagenUrl, likesrecibidos} = mascota
            if(querySnapshotmf1.empty && querySnapshotmf2.empty && querySnapshotme1.empty && querySnapshotme2.empty && querySnapshotmp.empty && !mascotasAgregadas.has(idmascota)){
              mascotasFiltradasNuevas.push({ ...mascota, id:idmascota, nombre:nombre, edad:edad, especie:especie,
                raza:raza, sexo:sexo, descripcion:descripcion,color:color, distancia:distanciaf, imagenUrl:imagenUrl, likesrecibidos:likesrecibidos });
            }
            mascotasAgregadas.add(idmascota);
          }       
        });

        setTimeout(() => {
          setMascotasFiltradas(mascotasFiltradasNuevas);
            if(mascotasFiltradasNuevas.length == 0)
            {
              setHayMascotasDisponibles(false)
            }
            else
            {
              ordenarMascotas(mascotasFiltradasNuevas, activepet)
              setButtons(true)
            }
          setIsLoading(false);
        }, 5000)
        
      }

      catch(e)
      {
        console.log("No se encontraron mascotas! Error: ", e)
      }
  }

  const ordenarMascotas = async (mascotasFiltradas:any, activepet:any) => {
      
      const sug = collection(store,'sugerencias')
      const petcolor = query(sug, where("idmascota", "==", activepet))
      const querySnapshotsc = await getDocs(petcolor)
      const docc = querySnapshotsc.docs[0]
      const {coloresLikes} = docc.data()   
      const { xs: xsNuevasMascotas } = convertirDatosMascotasEnTensores(mascotasFiltradas, coloresLikes);
      console.log('Forma de xsNuevasMascotas:', xsNuevasMascotas.shape);
      console.log('Datos de entrada para predicción:', xsNuevasMascotas.arraySync());

      const modeloCargado = await tf.loadLayersModel('/assets/modelo.json');
      
      const recomendaciones = modeloCargado.predict(xsNuevasMascotas) as tf.Tensor;
      
      // Obtiene las puntuaciones de recomendación como un arreglo
      const puntuaciones = recomendaciones.arraySync() as number[];

      // Ordena las nuevas mascotas en función de las puntuaciones
      console.log(mascotasFiltradas.sort((a:any, b:any) => puntuaciones[mascotasFiltradas.indexOf(b)] - puntuaciones[mascotasFiltradas.indexOf(a)]))
      setMascotasFiltradas(mascotasFiltradas.sort((a:any, b:any) => puntuaciones[mascotasFiltradas.indexOf(b)] - puntuaciones[mascotasFiltradas.indexOf(a)]));
  }

  function convertirDatosMascotasEnTensores(mascotas:any, coloresLikes:any) {
    const xs: number[][] = [];
    const ys: number[][] = [];
  
    mascotas.forEach((mascota: any) => {
      const coloresCodificados = coloresLikes.map((colorLike: any) =>
        mascota.color.includes(colorLike.color) ? 1 : 0
      );
      const features = [...coloresCodificados, mascota.likesrecibidos]; // Solo incluir las codificaciones de colores y los "likes" de las mascotas
      xs.push(features);
      ys.push([calcularPuntuacion(features, coloresLikes)]);
    });
  
    const numFilas = xs.length;
    const numColumnas = coloresLikes.length + 1; // Suma 1 para los "likes" de las mascotas
    
    return {
      xs: tf.tensor2d(xs, [numFilas, numColumnas]),
      ys: tf.tensor2d(ys, [numFilas, 1]),
    };
  }

  function calcularPuntuacion(features:any[], coloresLikes:any) {
    const likesMascotas = features[coloresLikes.length + 1];
    const likesColores = coloresLikes.reduce((total: any, colorLike: any, index: number) => {
      return total + (features[index] ? colorLike.likes : 0);
    }, 0);
    return likesMascotas + likesColores;
  }

  useIonViewWillEnter (() => {
    authUser();
    setDisplayAd(true)
  })

  useEffect(() => {
    // Código de configuración de anuncio
    window.googletag.cmd.push(function() {
      window.googletag.display('div-gpt-ad-123456789-0'); //
    });

    // Activa la carga de anuncios
    window.googletag.cmd.push(function() {
      window.googletag.enableServices();
    });
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

      <IonAlert
      isOpen={showMatchPopup}
      onDidDismiss={() => setShowMatchPopup(false)}
      header="¡Match exitoso!"
      message= {mensajeMatch}
      buttons={['OK']}/>
      
      <div className='generic'>
        {isLoading ? (
        <div className='loading'>
          <IonSpinner color={'primary'}></IonSpinner>
          <br></br>
          <br></br>
          <p>Buscando mascotas cerca de tu zona...</p>
        </div>
        )
        : 
        (
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
              <div style={{ backgroundImage: `url(${character.imagenUrl ? character.imagenUrl : firulais})`}} className='card'></div>
            </TinderCard>)):
            (
              <div className='nopets'>
                <IonImg src={triste}></IonImg>
                <p className='text'>No hay más mascotas disponibles. Prueba cambiando los filtros.</p>
              </div>
            )
          }
          </div>
        )}

        {lastDirection ? <h2 className='infoText'>You swiped {lastDirection}</h2> : <h2 className='infoText' />}  
        </div>

        {
          buttons ? (        
          <div className='buttons'>
            <IonButton shape='round' color={'danger'} size='large' onClick={handleSwipeLeft}>
              <IonIcon aria-hidden="true" icon={closeSharp}/>
            </IonButton>
            <IonButton shape='round' color={'success'} size='large' className='likebutton' onClick={handleSwipeRight}>
              <IonIcon aria-hidden="true" icon={heartSharp} />
            </IonButton>
          </div>) 
          : 
          (
          <span></span>
          )
        }

    <em className='ad centrar-texto'>Anuncio</em>
    <div id="div-gpt-ad-123456789-0" style={{ width: '300px', height: '250px' }} className='ad'>
    </div>
    
    
      <IonAlert
        isOpen={showAdAlert}
        header="¡Sin Likes!"
        message="¡Te has quedado sin likes! ¿Deseas ver una publicidad para obtener más?"
        buttons={[
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Publicidad cancelada');
              setShowAdAlert(false);
            },
          },
          {
            text: 'Ver',
            role: 'confirm',
            handler: () => {
              showAd()
              setShowAdAlert(false);
            },
          },
        ]}
      ></IonAlert>

      <IonAlert
        isOpen={showRewardAlert}
        message="¡Has obtenido más likes!"
        buttons={[
          {
            text: 'Ok',
            role: 'confirm',
            handler: () => {
              setShowRewardAlert(false);
            },
          },
        ]}
      ></IonAlert>

      <div>
          {isLoading ? (
            <span></span>
          ) : (
            <div> 
              {
                hayMascotasDisponibles ? (
                <IonCard key={mascotasFiltradas[currentPetIndex].nombre} className={`cards`}>
                  <IonCardHeader>
                    <IonCardTitle>{mascotasFiltradas[currentPetIndex].nombre}, {mascotasFiltradas[currentPetIndex].edad} años</IonCardTitle>
                    <IonCardSubtitle>{mascotasFiltradas[currentPetIndex].distancia} Km</IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <div>
                      <IonBadge style={{ marginRight: '4px' }} color={speciesColors[mascotasFiltradas[currentPetIndex].especie]}>
                        {mascotasFiltradas[currentPetIndex].especie}
                      </IonBadge>
                      <IonBadge style={{ '--background': raceColors[mascotasFiltradas[currentPetIndex].especie], marginRight: '4px' }}>
                        {mascotasFiltradas[currentPetIndex].raza}
                      </IonBadge>
                      <IonBadge className={mascotasFiltradas[currentPetIndex].sexo === 'Macho' ? 'macho' : 'hembra'}>
                        {mascotasFiltradas[currentPetIndex].sexo}
                        <IonIcon style={{ marginLeft: '3px' }} icon={mascotasFiltradas[currentPetIndex].sexo === 'Masculino' ? femaleSharp : maleSharp} />
                      </IonBadge>
                    </div>
                    <hr className="divider" />
                    <div className='section'>
                      <h1 className="section-title">Descripción</h1>
                      <p style={{ marginBottom: '10px' }}>{mascotasFiltradas[currentPetIndex].descripcion}</p>
                    </div>
                    <hr className="divider" />
                    <div className='section'>
                      <h1 className="section-title">Colores</h1>
                      {mascotasFiltradas[currentPetIndex].color.map((color, index) => (
                         <IonChip key={index} style={{ '--background': coloresMap[color].background, color: coloresMap[color].text }}>
                           <IonLabel><b>{color}</b></IonLabel>
                         </IonChip>
                      ))}
                    </div>
                  </IonCardContent>
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
