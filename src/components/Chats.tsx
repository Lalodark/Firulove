import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { IonContent, IonLabel, IonPage, IonButton, IonImg, IonHeader, IonToolbar, IonIcon, IonTabBar, IonTabButton, IonModal,
IonTitle, IonButtons, IonItem, IonAvatar, useIonViewWillEnter, useIonLoading } from '@ionic/react';
import { searchOutline, pawOutline, chatbubbleEllipsesOutline, filter, personCircleOutline, ellipse } from 'ionicons/icons';

import { auth, store } from '../firebase'
import { collection, query, where, getDocs } from "firebase/firestore";

import Filtros from './Filtros';
import Perfil from './Perfil';

import './Chats.css'
import logo from '../images/logofirulove2.png'
import firulais from '../images/firulais.jpg'
import confundido from '../images/Confundido_1.png'

const Chats: React.FC = () => {

  //Variables & Declaraciones
  
  const history = useHistory();
  const [presentload, dismiss] = useIonLoading();
  const modal3 = useRef<HTMLIonModalElement>(null);
  const modal4 = useRef<HTMLIonModalElement>(null);
  const [datosUsuario, setDatosUsuario] = useState({
    nombre: '',
    apellido: '',
    email: '',
    activepet: ''
  });
  interface Mascota {
    id:string,
    nombre:string,
    idchat:string,
    ultimomensaje:string,
    leido:number,
    ultimosender:string,
    idultimomsg:string,
    timestamp:any
  }
  const [mascotasMensajes, setMascotasMensajes] = useState<Mascota[]>([]);
  const [hayMascotas, setHayMascotas] = useState(true);
  const [mostrarModalcf, setMostrarModalcf] = useState(false);
  const [mostrarModalcp, setMostrarModalcp] = useState(false);


  //Funciones

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

  const presentLoading = () => {
    presentload({
      message: 'Cargando tus chats',
      duration: 4500,
    })
  }

  const marcarLeido = async(idchat: any, idultimomsg:any) => {
    const chatscol = collection(store, 'chats')
    const chatsenv = query(chatscol, where("chatid", "==", idchat))
    const querySnapshots = await getDocs(chatsenv)
    const chat = querySnapshots.docs[0]
    const mensajeb = chat.data()
    const mensajes = mensajeb.messages
    const mensajeIndex = mensajes.findIndex((mensaje:any) => mensaje.messageId === idultimomsg);
    mensajes[mensajeIndex].isread = 0;
    store.collection('chats').doc(chat.id).update({'messages': mensajes})
  }

  const abrirChat = (idchat:any, idmascota:any, idultimomsg:any, leido:any) => {
    if(leido == 1 && idmascota != datosUsuario.activepet)
    {
      marcarLeido(idchat, idultimomsg);
    } 
    history.push(`/chats/chat?idchat=${idchat}&mascotaid=${idmascota}`);
  }

  function formatTimestamp(timestamp:any) {
    const date = new Date(timestamp.seconds * 1000);
    const options = { hour: 'numeric', minute: 'numeric' } as Intl.DateTimeFormatOptions; 
  
    return new Intl.DateTimeFormat('es-ES', options).format(date);
  }

  // Función para comparar dos objetos por su timestamp
  function compararPorTimestamp(a:any, b:any) {
    // Si el timestamp es una cadena vacía, colócalos al principio
    if (a.timestamp === '') {
      return -1;
    } else if (b.timestamp === '') {
      return 1;
    }

    // Compara los timestamps en orden descendente (más reciente a más antiguo)
    return b.timestamp - a.timestamp;
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
              const { nombre, apellido, activepet } = data;
              setDatosUsuario({ nombre, apellido, email, activepet });
              cargarMatches(activepet)
            }
          }
      }
    })
  }

  const cargarMatches = async (activepet:string) => {
    const mascotasAgregadas = new Set();
    const mascotasFiltradasNuevas:Mascota[] = [];
    const idChatMap: Record<string, string> = {};
    const matchese = collection(store, 'matchesexitosos')
    const mascotaactual1 = query(matchese, where("idmascota1", "==", activepet)) 
    const mascotaactual2 = query(matchese, where("idmascota2", "==", activepet)) 
    
    const querymascota1 = await getDocs(mascotaactual1)
    const querymascota2 = await getDocs(mascotaactual2)

    const idsNoIgualesAActivePet: string[] = [];

    querymascota1.forEach(doc => {
      const id = doc.data().idmascota2;
      if (id !== activepet && !idsNoIgualesAActivePet.includes(id)) {
        idsNoIgualesAActivePet.push(id);
      }
    });
  
    querymascota2.forEach(doc => {
      const id = doc.data().idmascota1;
      if (id !== activepet && !idsNoIgualesAActivePet.includes(id)) {
        idsNoIgualesAActivePet.push(id);
      }
    });

    if(idsNoIgualesAActivePet.length > 0)
    {
      presentLoading();
      const mascotass = collection(store, 'mascotas')
      const matchesmascota = query(mascotass, where("idmascota", "in", idsNoIgualesAActivePet))
      const querySnapshotc = await getDocs(matchesmascota)
      const mascotasc = querySnapshotc.docs;

      for (const id of idsNoIgualesAActivePet) {
        const matchQuery = query(matchese, where("idmascota1", "==", activepet),where("idmascota2", "==", id));
        const matchQuerySnapshot = await getDocs(matchQuery);
      
        if (!matchQuerySnapshot.empty) {
          const matchDoc = matchQuerySnapshot.docs[0];
          const idchat = matchDoc.data().idchat; 
          idChatMap[id] = idchat;
        }
      }

      for (const id of idsNoIgualesAActivePet) {
        const matchQuery = query(matchese, where("idmascota1", "==", id),where("idmascota2", "==", activepet));
        const matchQuerySnapshot = await getDocs(matchQuery);
      
        if (!matchQuerySnapshot.empty) {
          const matchDoc = matchQuerySnapshot.docs[0];
          const idchat = matchDoc.data().idchat; 
          idChatMap[id] = idchat;
        }
      }

      mascotasc.forEach(async (doc) => {
        const mascotachat = doc.data();
        const {nombre, idmascota} = mascotachat;
        const idchat = idChatMap[idmascota];

        const chatscol = collection(store, 'chats')
        const chatsenv = query(chatscol, where("chatid", "==", idchat))
        const querySnapshots = await getDocs(chatsenv)
        const chat = querySnapshots.docs[0]
        const datoschat = chat.data()
        const {messages} = datoschat

        if(!mascotasAgregadas.has(idmascota))
        {
          if(messages.length > 0)
          mascotasFiltradasNuevas.push({ ...mascotachat, id:idmascota, nombre:nombre, idchat:idchat, ultimomensaje:messages[messages.length -1].content, leido: messages[messages.length -1].isread, ultimosender:messages[messages.length -1].senderId, idultimomsg:messages[messages.length -1].messageId, timestamp:messages[messages.length -1].timestamp})
          else
          mascotasFiltradasNuevas.push({ ...mascotachat, id:idmascota, nombre:nombre, idchat:idchat, ultimomensaje:'', leido: 2, ultimosender:'', idultimomsg:'', timestamp:''})
        }
        mascotasAgregadas.add(idmascota);
      })


      setTimeout(() => {
        mascotasFiltradasNuevas.sort((a, b) => compararPorTimestamp(a, b));
        setMascotasMensajes(mascotasFiltradasNuevas);
      }, 5000)
    }
    else{
      setHayMascotas(false)
    }
  }

  useIonViewWillEnter (() => {
    authUser();
  })

  useEffect(() => {
    console.log("e")
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

            {!hayMascotas ? 
            (
              <div className='nopets'>
                <IonImg src={confundido}></IonImg>
                <p className='text'>No hay matches disponibles.</p>
              </div>
            ) 
            : 
            (
              <div className='chats'>
              {mascotasMensajes.map((character) =>
                <IonItem button key={character.nombre} onClick={() => abrirChat(character.idchat, character.id, character.idultimomsg, character.leido)} detail={false}>
                  <IonIcon slot="end" color="primary" className="small-icon" icon={character.leido == 1 && character.ultimosender != datosUsuario.activepet ? ellipse : ''}></IonIcon>
                  <IonAvatar slot="start">
                    <img src={firulais} />
                  </IonAvatar>
                  <IonLabel>
                    <h2><strong>{character.nombre}</strong></h2>
                    <div>
                      { character.ultimomensaje != '' ? 
                      (
                        <div>
                          {
                            character.ultimosender === datosUsuario.activepet ?
                            (
                              <p>Tú: {character.ultimomensaje} <span className="timestamp">{character.timestamp ? formatTimestamp(character.timestamp):''}</span></p>
                            )
                            :
                            (
                              <p>{character.ultimomensaje} <span className="timestamp">{character.timestamp ? formatTimestamp(character.timestamp):''}</span></p>
                            )
                          }
                        </div>
                      ) 
                      :
                      (
                        <p><i>¡Nuevo!</i></p>
                      )
                      }
                    </div>
                  </IonLabel>
                </IonItem>
              )}
              </div>
            )}
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
