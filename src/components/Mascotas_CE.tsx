import React, {useState, useRef, useEffect } from 'react';
import {useHistory} from 'react-router-dom'
import { IonContent, IonLabel, IonPage, IonButton, IonImg, IonHeader, IonToolbar, IonIcon, IonTabBar, IonTabButton, IonModal,
IonTitle, IonButtons,IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonFab, IonFabButton, IonItem, IonInput,
IonSelect, IonSelectOption, IonTextarea } from '@ionic/react';
import {auth, store} from '../firebase'
import { collection, query, where, getDocs } from "firebase/firestore";
import uniqid from 'uniqid';


const Mascotas_CE: React.FC = () => {
  const history = useHistory();
  const[nombre, setNombre] = useState<string>('')
  const[edad, setEdad] = useState<string>('')
  const[Especie, setEspecie] = useState<string>('')
  const[Raza, setRaza] = useState<string>('')
  const[Color, setColor] = useState<string>('')
  const[Descripcion, setDescripcion] = useState<string>('')
  const [userID, setUserID] = useState({
    id: '',
  });

  const[msgerror, setMsgError] = useState<string>('')

  const opcionesRazaPorEspecie: Record<string, string[]> = {
    Perro: ['Opción 1', 'Opción 2', 'Opción 3'],
    Gato: ['Opción A', 'Opción B', 'Opción C'],
    Roedor: ['Opción X', 'Opción Y', 'Opción Z'],
    // Agrega opciones para las otras especies
  };

    // Función para manejar el cambio de especie
    const handleEspecieChange = (e: CustomEvent) => {
      const nuevaEspecie = e.detail.value!;
      setEspecie(nuevaEspecie);
  
      // Cuando cambia la especie, reinicia la raza
      setRaza('');
    };

  const confirm = async (e:React.FormEvent<HTMLFormElement>) => {
    console.log(Descripcion);
        e.preventDefault()
    try{
      const mascota = {
        idmascota:uniqid(),
        idusuario: userID,
        nombre:nombre,
        edad:edad,
        especie:Especie,
        raza:Raza,
        color:Color,
        descripcion:Descripcion
      }
      try{
        const data = await store.collection('mascotas').add(mascota)
        history.push('/mascotas')
      }
      catch(e){
        console.log(e)
      }
    }
    catch(error:any){
      console.log(error)
    }
  }

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
                const { id } = data;
                setUserID({ id });
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
      <form className='form' onSubmit={confirm}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton href='/mascotas'>Cancelar</IonButton>
            </IonButtons>
            <IonTitle>Agregar mascota</IonTitle>
            <IonButtons slot="end">
              <IonButton strong={true} type='submit'>
                Agregar
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonItem>
          <IonInput label="Nombre" label-placement="floating" onIonChange={(e) => setNombre(e.detail.value!)}></IonInput>
        </IonItem>
        <IonItem>
          <IonInput label="Edad" type="number" label-placement="floating" onIonChange={(e) => setEdad(e.detail.value!)}></IonInput>
        </IonItem>

            <IonItem>
              <IonLabel>Especie</IonLabel>
              <IonSelect placeholder="Seleccione una especie" onIonChange={handleEspecieChange}>
                <IonSelectOption value="Perro">Perro</IonSelectOption>
                <IonSelectOption value="Gato">Gato</IonSelectOption>
                <IonSelectOption value="Roedor">Roedor</IonSelectOption>
                <IonSelectOption value="Pajaro">Pájaro</IonSelectOption>
                <IonSelectOption value="Reptil">Reptil</IonSelectOption>
                <IonSelectOption value="Anfibio">Anfibio</IonSelectOption>
                <IonSelectOption value="Pez">Pez</IonSelectOption>
                <IonSelectOption value="Otro">Otro</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel>Raza</IonLabel>
              <IonSelect placeholder="Seleccione una raza" onIonChange={(e) => setRaza(e.detail.value!)} value={Raza}>
                  {Especie &&
                opcionesRazaPorEspecie[Especie].map((opcion, index) => (
                  <IonSelectOption key={index} value={opcion}>
                    {opcion}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel>Color</IonLabel>
              <IonSelect placeholder="Seleccione un color" multiple={true} onIonChange={(e) => setColor(e.detail.value!)}>
                <IonSelectOption value="Blanco">Blanco</IonSelectOption>
                <IonSelectOption value="Negro">Negro</IonSelectOption>
                <IonSelectOption value="Gris">Gris</IonSelectOption>
                <IonSelectOption value="Marron">Marrón</IonSelectOption>
                <IonSelectOption value="Naranja">Naranja</IonSelectOption>
                <IonSelectOption value="Amarillo">Amarillo</IonSelectOption>
                <IonSelectOption value="Atigrado">Atigrado</IonSelectOption>
                <IonSelectOption value="Manchado">Manchado</IonSelectOption>
                <IonSelectOption value="Rojo">Rojo</IonSelectOption>
                <IonSelectOption value="Azul">Azul</IonSelectOption>
                <IonSelectOption value="Verde">Verde</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonTextarea onIonChange={(e) => setDescripcion(e.detail.value!)} autoGrow={true} label="Descripción" label-placement="floating" placeholder="Introduzca una descripción"></IonTextarea>
            </IonItem>            
          </form>
      </IonContent>
    </IonPage>
  );
};

export default Mascotas_CE;
