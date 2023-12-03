import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { IonContent, IonLabel, IonPage, IonButton, IonImg, IonHeader, IonToolbar, IonIcon, IonTabBar, IonTabButton, IonModal,
IonTitle, IonButtons,IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonFab, IonFabButton, IonGrid,
IonRow, IonCol, IonChip, IonAlert, useIonViewWillEnter, useIonLoading } from '@ionic/react';
import { searchOutline, pawOutline, chatbubbleEllipsesOutline, filter, personCircleOutline, createOutline, trashOutline, addOutline,
checkmarkOutline, pauseCircleOutline, playCircleOutline } from 'ionicons/icons';

import { auth, store } from '../firebase'
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

import Filtros from './Filtros';
import Perfil from './Perfil';

import './Mascotas.css'
import firulais from '../images/firulais.jpg'
import logo from '../images/logofirulove2.png'


const Mascotas: React.FC = () => {

  //Variables & Declaraciones

  const history = useHistory();
  const [presentload, dismiss] = useIonLoading();
  const modal5 = useRef<HTMLIonModalElement>(null);
  const modal6 = useRef<HTMLIonModalElement>(null);
  const [datosUsuario, setDatosUsuario] = useState({
    nombre: '',
    apellido: '',
    email: '',
  });
  const[arraymascotas, setArrayMascotas] = useState<any[]>([]);
  const[userid, setUserID] = useState<string>('')
  const[active, setActive] = useState<string>('')

  const [mostrarModalmaf, setMostrarModalmaf] = useState(false);
  const [mostrarModalmap, setMostrarModalmap] = useState(false);
  const [openAlertIndex1, setOpenAlertIndex1] = useState(-1);
  const [openAlertIndex2, setOpenAlertIndex2] = useState(-1);
  const [openAlertIndex3, setOpenAlertIndex3] = useState(-1);

  //Funciones
  
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

  const presentLoading = () => {
    presentload({
      message: 'Cargando tus mascotas',
      duration: 1000,
    })
  }

  const handleEditarClick = (mascota:any) => {
    history.push(`/mascotas/create?id=${mascota.idmascota}`);
  };

  const goCreate = () =>  {
    history.push(`/mascotas/create`);
  }

  const handleBorrarClick = async (mascota:any) =>  {
    try{
      let nuevoac = ''
      const cambioac = collection(store,'mascotas')
      const petac = query(cambioac, where("idmascota", "!=", mascota.idmascota),
      where("idusuario", "==", userid))
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
              await await store.collection('usuarios').doc(doc.id).update({'activepet': nuevoac })
          }}})

      const filtross = collection(store, 'filtros')
      const filtrosborrar = query(filtross, where("idmascota", "==", mascota.idmascota))
      const queryFiltros = await getDocs(filtrosborrar)
      if(!queryFiltros.empty)
      {
        const docs = queryFiltros.docs[0];
        await deleteDoc(doc(store, 'filtros', docs.id));
      }

      const matchese = collection(store, 'matchesexitosos');

      const querymb1 = query(matchese,
        where("idmascota1", "==", mascota.idmascota)
      );

      const querymb2 = query(matchese,
        where("idmascota2", "==", mascota.idmascota)
      );

      const querySnapshotmp1 = await getDocs(querymb1);
      const querySnapshotmp2 = await getDocs(querymb2);

      querySnapshotmp1.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    
      querySnapshotmp2.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

  
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
  
  const cambioActual = (idpet:any) => {
    auth.onAuthStateChanged(async (usuarioActual) => {
      if (usuarioActual) {
        const email = usuarioActual.email;
        const usuarioss = collection(store,'usuarios')
        const user = query(usuarioss, where("email", "==", email))
        const querySnapshots = await getDocs(user)
        if (!querySnapshots.empty) {
            const doc = querySnapshots.docs[0];
            await store.collection('usuarios').doc(doc.id).update({'activepet': idpet })
            history.push('/menu')
            location.reload()
    }}})
    setTimeout(() => {
      setActive(idpet)
    }, 5000)
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
              const { id, nombre, apellido, activepet } = data;
              setDatosUsuario({ nombre, apellido, email });
              setUserID(id);
              setActive(activepet)
              listamascotas(id);
            }
          }
      }
    })
  }

  const listamascotas = async (userid:any) =>  {
    const mascotass = collection(store,'mascotas')
    const pet = query(mascotass, where("idusuario", "==", userid))
    const querySnapshots = await getDocs(pet)
    if(!querySnapshots.empty)
    {
      presentLoading()
      const docs = querySnapshots.docs;
      const arraypets = docs.map(item => (item.data()));
      setArrayMascotas(arraypets);
    }
  }

  const deshabilitarpet = async (mascota:any) => {
    const mascs = collection(store,'mascotas')

    let nuevoac = ''
    const petac = query(mascs, where("idmascota", "!=", mascota.idmascota),
    where("idusuario", "==", userid))
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
           await store.collection('usuarios').doc(doc.id).update({'activepet': nuevoac })
        }}})
    
    const pet = query(mascs, where("idmascota", "==", mascota.idmascota))
    const querySnapshotsl = await getDocs(pet)
    const docl = querySnapshotsl.docs[0]

    await store.collection('mascotas').doc(docl.id).update({'disponible': 0})

    location.reload()
  }

  const habilitarpet = async (mascota:any) => {
    const mascs = collection(store,'mascotas')
    
    const pet = query(mascs, where("idmascota", "==", mascota.idmascota))
    const querySnapshotsl = await getDocs(pet)
    const docl = querySnapshotsl.docs[0]

    await store.collection('mascotas').doc(docl.id).update({'disponible': 1})

    location.reload()
  }

  const openAlert1 = (index:any) => {
    setOpenAlertIndex1(index);
  };

  const closeAlert1 = () => {
    setOpenAlertIndex1(-1);
  };

  const openAlert2 = (index:any) => {
    setOpenAlertIndex2(index);
  };

  const closeAlert2 = () => {
    setOpenAlertIndex2(-1);
  };

  const openAlert3 = (index:any) => {
    setOpenAlertIndex3(index);
  };

  const closeAlert3 = () => {
    setOpenAlertIndex3(-1);
  };

  useIonViewWillEnter (() => {
    authUser()
  })  

  // useEffect(() => {
  //   console.log("e")
  // }, []);
  

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
            {arraymascotas.map((character, index) =>
              <IonCard key={character.idmascota} button onClick={() => 
                {
                  if(character.disponible == 1)
                  {
                    cambioActual(character.idmascota)
                  }
                }
              }>
                <IonCardHeader>
                  <img src={character.imagenUrl ? character.imagenUrl:firulais} />
                  <IonCardTitle>{character.nombre}</IonCardTitle>
                  <IonCardSubtitle>Edad: {character.edad}</IonCardSubtitle>
                </IonCardHeader>
                {
                  character.idmascota == active ? (
                    <IonChip color="tertiary">
                    <IonIcon aria-hidden="true" icon={checkmarkOutline}></IonIcon>
                    &#160;&#160;Seleccionada</IonChip>  
                  )
                  :
                  (
                    <span></span>
                  )
                }           
                <IonCardContent>{character.descripcion}</IonCardContent>
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonButton expand="block" disabled={character.disponible == 0} color="secondary" 
                      onClick={(e) =>{e.stopPropagation(); handleEditarClick(character);}} > 
                        <IonIcon aria-hidden="true" icon={createOutline}></IonIcon>
                      </IonButton>
                    </IonCol>
                    {character.disponible == 1 ?
                    (
                      <IonCol>
                        <IonButton color= 'success' disabled={arraymascotas.length == 1} expand="block" onClick={(e) => {e.stopPropagation(); 
                          openAlert1(index);}}>
                        <IonAlert
                          header="Confirmar"
                          isOpen={openAlertIndex1 === index}
                          message="¿Está seguro que desea deshabilitar esta mascota?"
                          buttons={[
                            {
                              text: 'Cancelar',
                              role: 'cancel',
                              handler: () => {
                                closeAlert1();
                              },
                            },
                            {
                              text: 'Confirmar',
                              role: 'confirm',
                              handler: () => { 
                                deshabilitarpet(character);
                              },
                            },
                          ]}
                          onDidDismiss={() => closeAlert1()}></IonAlert>
                          <IonIcon aria-hidden="true" icon={pauseCircleOutline}></IonIcon>
                        </IonButton>                      
                      </IonCol>
                    )
                    :  
                    (
                      <IonCol>
                        <IonButton color= 'success' disabled={arraymascotas.length == 1} expand="block" onClick={(e) => {e.stopPropagation(); 
                          openAlert2(index);}}>
                        <IonAlert
                          header="Confirmar"
                          isOpen={openAlertIndex2 === index}
                          message="¿Está seguro que desea habilitar esta mascota?"
                          buttons={[
                            {
                              text: 'Cancelar',
                              role: 'cancel',
                              handler: () => {
                                closeAlert2();
                              },
                            },
                            {
                              text: 'Confirmar',
                              role: 'confirm',
                              handler: () => { 
                                habilitarpet(character);
                              },
                            },
                          ]}
                          onDidDismiss={() => closeAlert2()}></IonAlert>
                          <IonIcon aria-hidden="true" icon={playCircleOutline}></IonIcon>
                        </IonButton>                      
                      </IonCol>
                    )
                    }
                    

                    <IonCol>
                      <IonButton disabled={arraymascotas.length == 1 || character.disponible == 0} expand="block" onClick={(e) => {e.stopPropagation(); 
                        openAlert3(index);}}>
                      <IonAlert
                         header="Confirmar"
                         isOpen={openAlertIndex3 === index}
                         message="¿Está seguro que desea eliminar esta mascota?"
                         buttons={[
                           {
                             text: 'Cancelar',
                             role: 'cancel',
                             handler: () => {
                              closeAlert3();
                             },
                           },
                           {
                             text: 'Confirmar',
                             role: 'confirm',
                             handler: () => { 
                              handleBorrarClick(character);
                             },
                           },
                         ]}
                         onDidDismiss={() => closeAlert3()}></IonAlert>
                        <IonIcon aria-hidden="true" icon={trashOutline}></IonIcon>
                      </IonButton>                      
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCard>
            )}
            </div>

            <IonFab slot="fixed" vertical="bottom" horizontal="end">
              <IonFabButton onClick={() => goCreate()}>
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
