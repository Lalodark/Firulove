import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'

import { IonContent, IonLabel, IonPage, IonButton, IonHeader, IonToolbar, IonTitle, IonButtons, 
IonItem, IonInput, IonSelect, IonSelectOption, IonTextarea, useIonToast, useIonViewWillEnter, useIonLoading } from '@ionic/react';
import { alertCircleOutline } from 'ionicons/icons';
import { Geolocation } from '@ionic-native/geolocation';

import { auth, store, storage } from '../firebase'
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { collection, query, where, getDocs } from "firebase/firestore";

import uniqid from 'uniqid';



const Mascotas_CE: React.FC = () => {
  
  //Variables & Declaraciones

  const history = useHistory();
  const [present] = useIonToast();
  const [presentload, dismiss] = useIonLoading();
  const[modoEdicion, setModoEdicion] = useState(false)
  const[activepet, setActivePet] = useState<string>('')

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
    Perro: ['Labrador Retriever', 'Pastor Alemán', 'Golden Retriever', 'Bulldog', 'Beagle', 'Caniche', 'Rottweiler',
     'Yorkshire Terrier', 'Boxer', 'Teckel', 'Siberian Husky', 'Bulldog Francés', 'Pug', 'Border Collie', 
     'Shih Tzu', 'Gran Danés', 'Australian Shepherd', 'Doberman Pinscher', 'Shiba Inu', 'Chihuahua', 'Cocker Spaniel', 
     'Boston Terrier', 'Miniature Schnauzer', 'Bichon Frise', 'Scottish Terrier', 'Papillon', 'Bichón Maltés', 
     'Staffordshire Bull Terrier', 'Pomeranian (Pomerania)', 'Rhodesian Ridgeback', 'Weimaraner', 'Basset Hound', 'Terranova', 
     'Shetland Sheepdog', 'Bullmastiff', 'Samoyedo', 'Poodle Miniatura', 'Irish Setter', 'Dálmata', 'Alaskan Malamute', 'Pembroke Welsh Corgi', 
     'Chinese Shar-Pei', 'Belgian Malinois', 'Perro de Agua Portugués', 'Cavalier King Charles Spaniel', 'American Staffordshire Terrier', 
     'Australian Terrier', 'Norwegian Elkhound', 'Bloodhound', 'Westie', 'Akita', 'Whippet', 'Cairn Terrier', 'American Bulldog', 
     'Chow Chow', 'Saluki', 'Tibetan Mastiff', 'Afghan Hound', 'Basenji', 'Otro'],
    Gato: [ 'Persa', 'Siamesa', 'Maine Coon', 'Ragdoll', 'British Shorthair', 'Sphynx', 'Abisinio', 'Scottish Fold', 'Bengal', 'Birmana', 'Korat', 
    'Devon Rex', 'Cornish Rex', 'American Shorthair', 'Oriental Shorthair', 'Exótico de Pelo Corto', 'Tonkinés', 'Manx', 'Siamés Moderno', 'Peterbald', 
    'Bombay', 'Azul Ruso', 'Somali', 'Angora Turco', 'Burmés', 'Noruego del Bosque', 'Neva Masquerade', 'American Curl', 'Selkirk Rex', 'LaPerm', 
    'Singapura', 'Selkirk Rex', 'Sokoke', 'Khao Manee', 'American Wirehair', 'Chartreux', 'Mau Egipcio', 'Australian Mist', 'Munchkin', 'Highlander',
     'Skookum', 'Serengeti', 'Bosque de Noruega', 'Gato del Chausie', 'Cymric', 'Snowshoe', 'Toyger', 'Burmilla', 'Khao Manee', 'Ojos Azules', 
     'German Rex', 'Ojos Impares', 'Otro'],
    Roedor: ['Cobaya de pelo corto', 'Cobaya de pelo largo peruana', 'Cobaya de pelo largo angora', 'Cobaya de pelo rizado',
    'Hámster sirio', 'Hámster enano ruso', 'Hámster chino', 'Hámster roborovski', 'Hámster campbell',
    'Ratón doméstico', 'Ratón dumbo', 'Ratón rex','Rata de laboratorio', 'Rata gigante de Gambian',
    'Jerbo pigmeo', 'Jerbo de orejas de pincel', 'Jerbo de Mongolia',
    'Conejillo de Indias peruano', 'Conejillo de Indias americano', 'Chinchilla de cola corta', 'Chinchilla de cola larga', 'Degú',
    'Ardilla de tierra común', 'Ardilla de tierra sudafricana','Puercoespín enano africano',
    'Ratón Gerbo', 'Gerbo de la India','Jerbo de Four-Toes', 'Conejillo de Indias de pelo rizado', 
    'Chinchilla lanigera', 'Chinchilla brevicaudata', 'Ardilla de tierra', 'Paca', 'Otro'],
    Pajaro: [
      'Gallina', 'Pato', 'Pavo', 'Ganso', 'Periquito', 'Canario', 'Loro', 'Paloma', 'Ave exótica', 'Codorniz', 
      'Faisan', 'Agapornis', 'Tórtola','Ave ornamental', 'Ave rapaz', 'Otro'],
    Reptil: ['Iguana verde', 'Gecko leopardo', 'Dragón barbudo', 'Tortuga rusa', 'Pogona', 'Tortuga de orejas rojas', 'Serpiente de maíz', 
    'Tortuga de caja', 'Serpiente de leche', 'Camaleón velado', 'Serpiente de bola', 'Dragón de agua chino', 'Camaleón de Jackson', 
    'Serpiente rey', 'Tortuga de espolones', 'Serpiente de árbol verde', 'Gecko crestado de Nueva Caledonia', 'Serpiente de milhojas', 'Dragón acuático australiano', 
    'Gecko de cola gorda', 'Serpiente de liga', 'Tortuga de caparazón blando', 'Camaleón pantera', 'Serpiente de rata', 'Dragón de agua de Filipinas', 
    'Gecko de cola de hoja', 'Serpiente boa constrictora', 'Otro'],
    Anfibio: ['Rana dardo venenoso', 'Rana Pacman', 'Sapo común', 'Rana arbórea', 'Sapo de vientre de fuego', 'Salamandra de dedos delgados', 
    'Salamandra tigre', 'Salamandra de cola de algodón', 'Tritón vientre de fuego', 'Axolote', 'Newt crestado', 'Newt de vientre de fuego', 'Otro'],
    Pez: [
      "Guppys","Betta", "Tetra", "Cíclidos", "Pez Dorado", "Barbos", "Pez Gato", "Pez Killi", "Corydora", "Pez Arco Iris", "Pez Payaso",
      "Pez Ángel", "Pez Cirujano", "Pez Loro", "Pez Mandarín", "Pez León", "Pez Damisela", "Pez Cirujano", "Pez Ángel de Agua Dulce", "Pez Mariposa",
      "Pez Betta Dragón", "Pez Globo", "Pez Disco", "Pez Arlequín", "Pez Ramirezi", "Pez Platy", "Pez Gourami", "Pez de Cola de Espada",
      "Pez Tetra Diamante", "Pez Killi Dorado", "Pez Ángel Coral", "Pez Mariposa Raya", "Pez Tigre", "Pez Murciélago", "Pez Conejo",
      "Pez Dottyback", "Pez Lobo", "Pez Mandarín Verde", "Pez Unicornio", "Pez Escorpión" , "Otro"],
    Otro: ['Hurón', 'Insecto', 'Otro']
  };
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const[msgerror, setMsgError] = useState<string>('')
  

  //Funciones

  const goBack = () => {
    window.history.back()
  }

  const presentToast = () => {
    present({
      message: msgerror,
      duration: 1500,
      position: 'top',
      icon: alertCircleOutline,
      color: 'danger'
    });
  };

  const presentLoading = () => {
    presentload({
      message: 'Cargando datos',
      duration: 1500,
    })
  }

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

    if(nombre != '' && edad != '' && sexo != '' && Especie != '' && Raza != '' && Color.length > 0)
    {
      let imageUrl = ''
      if (selectedFile) {
        const storageRef = ref(storage, '/' + selectedFile.name);
        try {
          await uploadBytes(storageRef, selectedFile);

          imageUrl = await getDownloadURL(storageRef);
        }
        catch (error) {
          console.error('Error al subir la imagen:', error);
        }
      }

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
        longitud: longitude,
        ...imageUrl ? { imagenUrl: imageUrl } : {}
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
    else{
      setMsgError('Por favor complete todos los campos para continuar.')
      presentToast()
    }
    
  }

  const handleFileChange = async (e:any) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  
  const confirm = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const position = await Geolocation.getCurrentPosition();
    const { latitude, longitude } = position.coords;
    let imageUrl = ''
    if (selectedFile) {
      const storageRef = ref(storage, '/' + selectedFile.name);
      try {
        await uploadBytes(storageRef, selectedFile);

        imageUrl = await getDownloadURL(storageRef);
      }
      catch (error) {
        console.error('Error al subir la imagen:', error);
      }
    }
    if(nombre != '' && edad != '' && sexo != '' && Especie != '' && Raza != '' && Color.length > 0)
    {
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
          longitud: longitude,
          likesrecibidos: 0,
          imagenUrl: imageUrl
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

        const sugerencias = {
          idmascota: mascota.idmascota,
          coloresLikes: [
            { color: 'Blanco', likes: 0 },
            { color: 'Negro', likes: 0 },
            { color: 'Gris', likes: 0 },
            { color: 'Marron', likes: 0 },
            { color: 'Naranja', likes: 0 },
            { color: 'Amarillo', likes: 0 },
            { color: 'Atigrado', likes: 0 },
            { color: 'Manchado', likes: 0 },
            { color: 'Rojo', likes: 0 },
            { color: 'Azul', likes: 0 },
            { color: 'Verde', likes: 0 },
          ]
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
                  await store.collection('usuarios').doc(doc.id).update({'activepet': mascota.idmascota})
              }}})
          await store.collection('mascotas').add(mascota)
          await store.collection('filtros').add(deffilters)
          await store.collection('sugerencias').add(sugerencias)
          setMsgError('')
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
    else{
      setMsgError('Por favor complete todos los campos para continuar.')
      presentToast()
    }
  }

  const authUser = (editid:any) =>{
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
              const { id, activepet } = data;
              setUserID(id);
              setActivePet(activepet)
              if(editid !== '' && editid !== null && editid !== undefined){
                seteditarmascota(editid);
              }
            }
          }
      }
    })
  }

  const seteditarmascota = async (editid:any) =>
  {
    const mascotass = collection(store,'mascotas')
    const petborrar = query(mascotass, where("idmascota", "==", editid))
    const querySnapshots = await getDocs(petborrar)
    if(!querySnapshots.empty)
    {
      presentLoading();
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

  useIonViewWillEnter (() => {
    const searchParams = new URLSearchParams(location.search);
    const editid = searchParams.get('id');
    setEditID(editid);
    authUser(editid)
    
  })

  useEffect(() => {
    if(msgerror != '')
    {
      presentToast()
    }
  }, [location.search, msgerror]);

  return (
    <IonPage>
      <IonContent fullscreen>
      <form className='form' onSubmit={modoEdicion ? setupdate:confirm}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              {activepet != '' ? <IonButton onClick={() => goBack()}>Cancelar</IonButton> : ''}
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
            <IonItem>
              <IonItem>
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </IonItem>
            </IonItem>
          </form>

      </IonContent>
    </IonPage>
  );
};

export default Mascotas_CE;
