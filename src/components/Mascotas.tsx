import React, {useState, useRef, useEffect } from 'react';
import { IonContent, IonLabel, IonPage, IonButton, IonImg, IonHeader, IonToolbar, IonIcon, IonTabBar, IonTabButton, IonModal,
IonTitle, IonButtons,IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonFab, IonFabButton, IonGrid,
IonRow, IonCol } from '@ionic/react';
import './Mascotas.css'

import { searchOutline, pawOutline, chatbubbleEllipsesOutline, filter, personCircleOutline, createOutline, trashOutline, addOutline } from 'ionicons/icons';
import logo from '../images/logofirulove2.png'

import {auth, store} from '../firebase'
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useHistory } from 'react-router-dom';

import Filtros from './Filtros';
import Perfil from './Perfil';

import firulais from '../images/firulais.jpg'
import fido from '../images/fido.jpg'
import dido from '../images/dido.jpg'
import cuscus from '../images/cuscus.jpg'
import yamila from '../images/yamila.jpg'


const Mascotas: React.FC = () => {
  const history = useHistory();
  const modal5 = useRef<HTMLIonModalElement>(null);
  const modal6 = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);
  const [datosUsuario, setDatosUsuario] = useState({
    nombre: '',
    apellido: '',
    email: '',
  });
  const[arraymascotas, setArrayMascotas] = useState<any[]>([]);
  const[userid, setUserID] = useState<string>('')
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

  const handleEditarClick = (mascota:any) => {
    // Aquí redirigimos a la página de edición y pasamos los datos de la mascota en la URL
    history.push(`/mascotas/create?id=${mascota.idmascota}`);
    //&nombre=${mascota.nombre}&edad=${mascota.edad}
  };

  const handleBorrarClick = async (mascota:any) =>  {
    try{
      let nuevoac = ''
      const cambioac = collection(store,'mascotas')
      const petac = query(cambioac, where("idmascota", "!=", mascota.idmascota))
      const queryac = await getDocs(petac)
        if(!queryac.empty)
        {
          const docs = queryac.docs[0];
          const data = docs.data();
          const {idmascota} = data;
          nuevoac = idmascota;
        }

      auth.onAuthStateChanged(async (usuarioActual) => {
        if (usuarioActual) {
          const email = usuarioActual.email;
          const usuarioss = collection(store,'usuarios')
          const user = query(usuarioss, where("email", "==", email))
          const querySnapshots = await getDocs(user)
          if (!querySnapshots.empty) {
              const doc = querySnapshots.docs[0];
              const data = doc.data()
              const {apellido, email, fecha, id, nombre, activepet } = data;
              const userr = {
                nombre:nombre,
                apellido:apellido,
                fecha:fecha,
                email:email,
                id:id,
                activepet:nuevoac
              }
              await store.collection('usuarios').doc(doc.id).set(userr)
          }}})

    const filtross = collection(store, 'filtros')
    const filtrosborrar = query(filtross, where("idmascota", "==", mascota.idmascota))
    const queryFiltros = await getDocs(filtrosborrar)
    if(!queryFiltros.empty)
    {
      const docs = queryFiltros.docs[0];
      await deleteDoc(doc(store, 'filtros', docs.id));
    }

    const mascotass = collection(store,'mascotas')
    const petborrar = query(mascotass, where("idmascota", "==", mascota.idmascota))
    const querySnapshots = await getDocs(petborrar)
      if(!querySnapshots.empty)
      {
        const docs = querySnapshots.docs[0];
        await deleteDoc(doc(store, 'mascotas', docs.id));
      }

    const pet = query(mascotass, where("idusuario", "==", userid))
    const querySnapshots1 = await getDocs(pet)
      if(!querySnapshots1.empty)
      {
        const docs = querySnapshots1.docs;
        const arraypets = docs.map(item => (item.data()));
        setArrayMascotas(arraypets);
      }
    }
    catch(error:any){
      console.log("No se pudo borrar la mascota", error);
    }
  }
  
  useEffect(() => {

    const listamascotas = async (userid:any) =>  {
      const mascotass = collection(store,'mascotas')
      const pet = query(mascotass, where("idusuario", "==", userid))
      const querySnapshots = await getDocs(pet)
      if(!querySnapshots.empty)
      {
        const docs = querySnapshots.docs;
        const arraypets = docs.map(item => (item.data()));
        setArrayMascotas(arraypets);
      }
    }

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
                const { id, nombre, apellido } = data;
                setDatosUsuario({ nombre, apellido, email });
                setUserID(id);
                listamascotas(id);
              }
            }
        }
      })
    }
    authUser()
  }, []);
  
  const cambioActual = (idpet:any) => {
    auth.onAuthStateChanged(async (usuarioActual) => {
      if (usuarioActual) {
        const email = usuarioActual.email;
        const usuarioss = collection(store,'usuarios')
        const user = query(usuarioss, where("email", "==", email))
        const querySnapshots = await getDocs(user)
        if (!querySnapshots.empty) {
            const doc = querySnapshots.docs[0];
            const data = doc.data()
            const {apellido, email, fecha, id, nombre, activepet } = data;
            const userr = {
              nombre:nombre,
              apellido:apellido,
              fecha:fecha,
              email:email,
              id:id,
              activepet:idpet
            }
            await store.collection('usuarios').doc(doc.id).set(userr)
    }}})
  }

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
            {arraymascotas.map(character =>
              <IonCard key={character.idmascota} button onClick={() => cambioActual(character.idmascota)}>
                <IonCardHeader>
                  <img src={firulais} />
                  <IonCardTitle>{character.nombre}</IonCardTitle>
                  <IonCardSubtitle>Edad: {character.edad}</IonCardSubtitle>
                </IonCardHeader>

                <IonCardContent>{character.descripcion}</IonCardContent>

                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonButton expand="block" color="secondary" onClick={() => handleEditarClick(character)} > 
                        <IonIcon aria-hidden="true" icon={createOutline}></IonIcon>
                      </IonButton>
                    </IonCol>
                    <IonCol>
                      <IonButton expand="block" onClick={() => {handleBorrarClick(character)}}>
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
          <Filtros onClose={cerrarModalmaf}></Filtros>
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
