import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { IonContent, IonPage, IonButton, IonHeader, IonToolbar, IonIcon, IonButtons, IonList,
IonItem, IonInput, IonFooter, IonAvatar, IonImg, IonAlert, useIonViewWillEnter, useIonLoading } from '@ionic/react';
import { chevronBackOutline, flagOutline } from 'ionicons/icons';

import { auth, store } from '../firebase'
import { collection, query, where, getDocs, deleteDoc, doc, Timestamp } from "firebase/firestore";

import uniqid from 'uniqid';

import './Chat_Personal.css'
import firulais from '../images/firulais.jpg'
import chati from '../images/Chat.png'

const Chat_Personal: React.FC = () => {

  //Variables & Declaraciones

  interface Mensaje {
    content:string,
    isread:number,
    messageId:string,
    senderId:string,
    timestamp:Timestamp
  }

  const history = useHistory();
  const [presentload, dismiss] = useIonLoading();
  const [activePet, setActivePet] = useState<string>('')
  const [chatId, setChatId] = useState<any>('')
  const [petId, setPetId] = useState<any>('')
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [hayMensajes, setHayMensajes] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [mensajeEnviar, setMensajeEnviar] = useState('')
  const [isOpen, setIsOpen] = useState(false);
  const [datosMascota, setDatosMascota] = useState({
    idmascota:'',
    nombre:'',
    imagenUrl:''
  });

  //Funciones

  const presentLoading = () => {
    presentload({
      message: 'Cargando chat',
      duration: 4500,
    })
  }

  const enviarMensaje = async () => {
    if(mensajeEnviar)
    {
      const chatscol = collection(store, 'chats')
      const chatsenv = query(chatscol, where("chatid", "==", chatId))
      const querySnapshots = await getDocs(chatsenv)
      const chat = querySnapshots.docs[0]
      const chatData = chat.data();
      const nuevoMensaje = {
        content: mensajeEnviar,
        isread: 1, //No se leyó
        messageId: uniqid(),
        senderId: activePet,
        timestamp: Timestamp.now(),
      };

      setMensajes([...mensajes, nuevoMensaje])
      chatData.messages.push(nuevoMensaje)
      
      await store.collection('chats').doc(chat.id).set(chatData)
    }
    setMensajeEnviar('')
  }

  const borrarMatch = async () => {
    const chatscol = collection(store, 'chats')
    const matchese = collection(store, 'matchesexitosos')

    const chatshow = query(chatscol, where("chatid", "==", chatId))
    const querySnapshots = await getDocs(chatshow)
    const docs = querySnapshots.docs[0];
    await deleteDoc(doc(store, 'chats', docs.id));

    const matchborrar = query(matchese, where("idchat", "==", chatId))
    const querySnapshotsm = await getDocs(matchborrar);
    const docsm = querySnapshotsm.docs[0];
    const data = docsm.data()
    const {idmascota1, idmascota2} = data;

    const matchf= {
      idmascota1: idmascota1,
      idmascota2: idmascota2
    }
    await store.collection('matchesfallidos').add(matchf)
    await deleteDoc(doc(store, 'matchesexitosos', docsm.id));
    history.push('/chats')
  }

  const goBack = () => {
    window.history.back()
  }

  function formatTimestamp(timestamp:any) {
    const date = new Date(timestamp.seconds * 1000);
    const options = { hour: 'numeric', minute: 'numeric' } as Intl.DateTimeFormatOptions; 
  
    return new Intl.DateTimeFormat('es-ES', options).format(date);
  }

  const authUser = (chat:any, pet:any) =>{
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
              const { activepet } = data;
              setActivePet(activepet);
              traerMensajes(chat, pet);
            }
          }
      }
    })
  }

  const traerMensajes = async (chat:any, pet:any) => {

    presentLoading();
    const maschat = collection(store, 'mascotas')
    const petshow = query(maschat, where("idmascota", "==", pet))
    const querySnapshotsm = await getDocs(petshow)
    const datosMascota = querySnapshotsm.docs[0]
    const datam = datosMascota.data()
    const {idmascota, nombre, imagenUrl} = datam;

    const chatscol = collection(store, 'chats')
    const chatshow = query(chatscol, where("chatid", "==", chat))
    const querySnapshots = await getDocs(chatshow)

    if(!querySnapshots.empty)
    {
      const datosChat = querySnapshots.docs[0]
      const data = datosChat.data()
      const { messages } = data;


    setTimeout(() => {
      setDatosMascota({idmascota, nombre, imagenUrl})
      if(messages.length > 0)
      {
        setMensajes(messages);
      }
      else
      {
        setHayMensajes(false);
      }
      setIsLoading(false);
      }, 3500)
    }
    else{
      setDatosMascota({idmascota, nombre, imagenUrl})
      setHayMensajes(false)
      setIsLoading(false)
    }
  }

  useIonViewWillEnter (() => {
    const searchParams = new URLSearchParams(location.search);
    const chat = searchParams.get('idchat');
    const pet = searchParams.get('mascotaid');
    setChatId(chat);
    setPetId(pet);
    
    authUser(chat, pet);
    
  })

  useEffect(() => {
    console.log("e")
  }, []);


  return (
    <IonPage>
      <IonContent fullscreen>
        <IonHeader>
          <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => goBack()}>
              <IonIcon slot="start" icon={chevronBackOutline}></IonIcon>
            </IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={() => setIsOpen(true)}>
            <IonAlert
                         header="Confirmar"
                         isOpen={isOpen}
                         message="¿Está seguro que desea cancelar este match?"
                         buttons={[
                           {
                             text: 'Cancelar',
                             role: 'cancel',
                             handler: () => {
                               console.log("e")
                             },
                           },
                           {
                             text: 'Confirmar',
                             role: 'confirm',
                             handler: () => { 
                              borrarMatch()
                             },
                           },
                         ]}
                         onDidDismiss={() => setIsOpen(false)}></IonAlert>
              <IonIcon slot="start" icon={flagOutline}></IonIcon>
            </IonButton>
          </IonButtons>
          <IonItem>
            <IonAvatar slot="start">
              <img src={datosMascota.imagenUrl ? datosMascota.imagenUrl:firulais} />
            </IonAvatar>
              {datosMascota.nombre}
          </IonItem>
          </IonToolbar>
        </IonHeader>

        {mensajes.length == 0 ? 
        (
          <div className='nopets'>
            <IonImg src={chati}></IonImg>
            <p className='text'>No hay mensajes. ¡Di Hola!</p>
          </div>
        ) 
        :
        (
          <IonList className='fondo'>
          {
            mensajes.map((mensaje) => (
              <IonItem key={mensaje.messageId} className={activePet === mensaje.senderId ? 'chat-message sent':'chat-message received'}>
              <div className="message-content">{mensaje.content}</div>
              <span className={activePet === mensaje.senderId ? 'timestamp timesent':'timestamp'}>{formatTimestamp(mensaje.timestamp)}</span>
            </IonItem>
            ))
          }
          </IonList>
        )}

        <IonFooter className='footer'>
            <IonItem className='chat'>
              <IonInput value={mensajeEnviar} onIonChange={(e) => setMensajeEnviar(e.detail.value!)} />
              <IonButton onClick={() => enviarMensaje()} expand="full">Enviar</IonButton>
            </IonItem>
          </IonFooter>
      </IonContent>
    </IonPage>
  );
};

export default Chat_Personal;
