import React, {useState, useRef, useEffect } from 'react';
import {useHistory} from 'react-router-dom'
import { IonContent, IonLabel, IonPage, IonButton, IonImg, IonHeader, IonToolbar, IonIcon, IonTabBar, IonTabButton, IonModal,
IonTitle, IonButtons,IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonFab, IonFabButton, IonItem, IonInput,
IonSelect, IonSelectOption, IonTextarea } from '@ionic/react';
import {auth, store} from '../firebase'
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { collection, query, where, getDocs } from "firebase/firestore";
import uniqid from 'uniqid';
import { Geolocation } from '@ionic-native/geolocation';

const Mascotas_CE: React.FC = () => {
  
  const history = useHistory();
  const[modoEdicion, setModoEdicion] = useState(false)

  const[nombre, setNombre] = useState<string>('')
  const[edad, setEdad] = useState<string>('')
  const[sexo, setSexo] = useState<string>('')
  const[Especie, setEspecie] = useState<string>('')
  const[Raza, setRaza] = useState<string>('')
  const[Color, setColor] = useState<string>('')
  const[Descripcion, setDescripcion] = useState<string>('')
  const[userID, setUserID] = useState({
    id: '',
  });
  const[editpetid, setEditID] = useState<any>('')
  const opcionesRazaPorEspecie: Record<string, string[]> = {
    Perro: ['Opción 1', 'Opción 2', 'Opción 3'],
    Gato: ['Opción A', 'Opción B', 'Opción C'],
    Roedor: ['Opción X', 'Opción Y', 'Opción Z'],
    // Agrega opciones para las otras especies
  };


  const[msgerror, setMsgError] = useState<string>('')
  const handleEspecieChange = (e: CustomEvent) => {
      const nuevaEspecie = e.detail.value!;
      setEspecie(nuevaEspecie);
  
      // Cuando cambia la especie, reinicia la raza
      setRaza('');
  };

  const setupdate = async (e:React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault()
    const position = await Geolocation.getCurrentPosition();
    const { latitude, longitude } = position.coords;
    const editmascota = {
      idmascota: editpetid,
      idusuario: userID,
      nombre:nombre,
      edad:edad,
      sexo:sexo,
      especie:Especie,
      raza:Raza,
      color:Color,
      descripcion:Descripcion,
      latitud: latitude,
      longitud: longitude
    }
    try{
      const mascotass = collection(store,'mascotas')
      const pet = query(mascotass, where("idmascota", "==", editpetid))
      const querySnapshots = await getDocs(pet)
      const doc = querySnapshots.docs[0]
      await store.collection('mascotas').doc(doc.id).set(editmascota)
    }
    catch(e){
      console.log(e)
    }
    history.push('/mascotas')
  }

  
  const confirm = async (e:React.FormEvent<HTMLFormElement>) => {
    console.log(Descripcion);
    e.preventDefault()
    const position = await Geolocation.getCurrentPosition();
    const { latitude, longitude } = position.coords;
    try{
      const mascota = {
        idmascota:uniqid(),
        idusuario: userID,
        nombre:nombre,
        edad:edad,
        sexo:sexo,
        especie:Especie,
        raza:Raza,
        color:Color,
        descripcion:Descripcion,
        latitud: latitude,
        longitud: longitude
      }

      const sexoc = sexo === 'Macho' ? 'Hembra' : 'Macho';

      const deffilters ={
        idmascota:mascota.idmascota,
        especie:Especie,
        raza:Raza,
        sexo:sexoc,
        distancia:10,
        edadMinima:3,
        edadMaxima:6
      }
      try{
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
                  activepet:mascota.idmascota
                }
                await store.collection('usuarios').doc(doc.id).set(userr)
            }}})
        await store.collection('mascotas').add(mascota)
        await store.collection('filtros').add(deffilters)
        history.push('/mascotas')
        location.reload()
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
    const searchParams = new URLSearchParams(location.search);
    const editid = searchParams.get('id');
    setEditID(editid);

    const seteditarmascota = async () =>
    {
      const mascotass = collection(store,'mascotas')
      const petborrar = query(mascotass, where("idmascota", "==", editid))
      const querySnapshots = await getDocs(petborrar)
      if(!querySnapshots.empty)
      {
        setModoEdicion(true);
        const docs = querySnapshots.docs[0];
        const data = docs.data()
        const {nombre, edad, sexo, especie, raza, color, descripcion} = data;
        setNombre(nombre);
        setEdad(edad);
        setSexo(sexo);
        setEspecie(especie);
        setRaza(raza);
        setColor(color);
        setDescripcion(descripcion);
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
                const { id } = data;
                setUserID(id);
                if(editid !== '' && editid !== null && editid !== undefined){
                  seteditarmascota();
                }
              }
            }
        }
      })
    }
    authUser()
  }, [location.search]);

  return (
    <IonPage>
      <IonContent fullscreen>
      <form className='form' onSubmit={modoEdicion ? setupdate:confirm}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton href='/mascotas'>Cancelar</IonButton>
            </IonButtons>
            {modoEdicion ? <IonTitle>Editar mascota</IonTitle> : <IonTitle>Agregar mascota</IonTitle>}
            <IonButtons slot="end">
              {modoEdicion ? <IonButton strong={true} type='submit'>
                Actualizar
              </IonButton>
            :
            <IonButton strong={true} type='submit'>
              Agregar
            </IonButton>
            }
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonItem>
          <IonInput label="Nombre" label-placement="floating"  value={nombre} onIonChange={(e) => setNombre(e.detail.value!)}></IonInput>
        </IonItem>
        <IonItem>
          <IonInput label="Edad" type="number" label-placement="floating" value={edad} onIonChange={(e) => setEdad(e.detail.value!)}></IonInput>
        </IonItem>
        <IonItem>
              <IonLabel>Sexo</IonLabel>
              <IonSelect placeholder="Seleccione una especie" onIonChange={(e) => setSexo(e.detail.value!)} value={sexo}>
                <IonSelectOption value="Macho">Macho</IonSelectOption>
                <IonSelectOption value="Hembra">Hembra</IonSelectOption>
              </IonSelect>
        </IonItem>
            <IonItem>
              <IonLabel>Especie</IonLabel>
              <IonSelect placeholder="Seleccione una especie" onIonChange={handleEspecieChange} value={Especie}>
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
              <IonSelect placeholder="Seleccione un color" multiple={true} onIonChange={(e) => setColor(e.detail.value!)}  value={Color}>
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
              <IonTextarea value={Descripcion} onIonChange={(e) => setDescripcion(e.detail.value!)} autoGrow={true} label="Descripción" label-placement="floating" placeholder="Introduzca una descripción"></IonTextarea>
            </IonItem>
          </form>

      </IonContent>
    </IonPage>
  );
};

export default Mascotas_CE;
