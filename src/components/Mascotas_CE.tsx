import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'

import { IonContent, IonLabel, IonPage, IonButton, IonHeader, IonToolbar, IonTitle, IonButtons, 
IonItem, IonInput, IonSelect, IonSelectOption, IonTextarea, useIonToast, useIonViewWillEnter, useIonLoading,
IonSearchbar, IonModal, IonFooter, IonText } from '@ionic/react';
import { alertCircleOutline } from 'ionicons/icons';
import { Geolocation } from '@ionic-native/geolocation';

import { auth, store, storage } from '../firebase'
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { collection, query, where, getDocs } from "firebase/firestore";

import './Mascotas_CE.css'

import uniqid from 'uniqid';



const Mascotas_CE: React.FC = () => {
  
  //Variables & Declaraciones

  const history = useHistory();
  const [present] = useIonToast();
  const [presentload, dismiss] = useIonLoading();
  const[modoEdicion, setModoEdicion] = useState(false)
  const[activepet, setActivePet] = useState<string>('')

  const [mostrarModal, setMostrarModal] = useState(false);
  const [filtroRazas, setFiltroRazas] = useState<string[]>([]);

  const[nombre, setNombre] = useState<string>('')
  const[edad, setEdad] = useState<string>('')
  const[sexo, setSexo] = useState<string>('')
  const[Especie, setEspecie] = useState<string>('')
  const[Raza, setRaza] = useState<string>('')
  const[Color, setColor] = useState<string>('')
  const[Descripcion, setDescripcion] = useState<string>('')
  const[imagen, setImagen] = useState<string>('')
  const[userID, setUserID] = useState({
    id: '',
  });
  const[editpetid, setEditID] = useState<any>('')
  const opcionesRazaPorEspecie: Record<string, string[]> = {
    Perro: ['Akita', 'Alaskan Malamute', 'American Bulldog', 'American Staffordshire Terrier', 'Australian Shepherd',
    'Australian Terrier', 'Basset Hound', 'Beagle', 'Belgian Malinois', 'Bichon Frise', 'Bichón Maltés', 'Bloodhound',
    'Border Collie', 'Boston Terrier', 'Boxer', 'Bullmastiff', 'Bulldog', 'Bulldog Francés', 'Cairn Terrier', 'Cavalier King Charles Spaniel',
    'Chihuahua', 'Chow Chow', 'Cocker Spaniel', 'Dálmata', 'Doberman Pinscher', 'Golden Retriever', 'Gran Danés', 'Irish Setter',
    'Labrador Retriever', 'Miniature Schnauzer', 'Norwegian Elkhound', 'Papillon', 'Pastor Alemán', 'Pembroke Welsh Corgi', 'Perro de Agua Portugués',
    'Pomeranian (Pomerania)', 'Poodle Miniatura', 'Pug', 'Rhodesian Ridgeback', 'Rottweiler', 'Samoyedo', 'Scottish Terrier', 'Shetland Sheepdog',
    'Shiba Inu', 'Shih Tzu', 'Siberian Husky', 'Staffordshire Bull Terrier', 'Teckel', 'Terranova', 'Tibetan Mastiff', 'Weimaraner',
    'Westie', 'Whippet', 'Yorkshire Terrier', 'Otro'],
    Gato: ['Abisinio', 'American Curl', 'American Shorthair', 'Angora Turco', 'Azul Ruso', 'Bengal', 'Birmana', 'Bombay', 'British Shorthair', 
    'Bosque de Noruega', 'Burmilla', 'Burmés', 'Chartreux', 'Cornish Rex', 'Cymric', 'Devon Rex', 'Exótico de Pelo Corto', 'German Rex', 'Gato del Chausie', 
    'Highlander', 'Khao Manee', 'Khao Manee', 'Korat', 'LaPerm', 'Maine Coon', 'Manx', 'Mau Egipcio', 'Munchkin', 'Neva Masquerade', 'Noruego del Bosque', 
    'Ojos Azules', 'Ojos Impares', 'Oriental Shorthair', 'Persa', 'Peterbald', 'Ragdoll', 'Scottish Fold', 'Selkirk Rex', 'Selkirk Rex', 'Siamesa', 
    'Siamés Moderno', 'Singapura', 'Skookum', 'Sokoke', 'Somali', 'Sphynx', 'Serengeti', 'Snowshoe', 'Sokoke', 'Sphynx', 'Tonkinés', 'Toyger', 'Otro'],
    Roedor: ['Ardilla de tierra', 'Ardilla de tierra común', 'Ardilla de tierra sudafricana', 'Cobaya de pelo corto',
    'Cobaya de pelo largo angora', 'Cobaya de pelo largo peruana', 'Cobaya de pelo rizado', 'Conejillo de Indias americano',
    'Conejillo de Indias de pelo rizado', 'Conejillo de Indias peruano', 'Chinchilla brevicaudata', 'Chinchilla de cola corta',
    'Chinchilla de cola larga', 'Chinchilla lanigera', 'Degú', 'Gerbo de la India', 'Gerbo de Four-Toes', 'Hámster campbell',
    'Hámster chino', 'Hámster enano ruso', 'Hámster roborovski', 'Hámster sirio', 'Jerbo de Mongolia', 'Jerbo de orejas de pincel',
    'Jerbo pigmeo', 'Jerbo de Four-Toes', 'Paca', 'Puercoespín enano africano', 'Rata de laboratorio', 'Rata gigante de Gambian',
    'Ratón doméstico', 'Ratón dumbo', 'Ratón gerbo', 'Ratón rex', 'Otro'],
    Pajaro: ['Agapornis', 'Ave exótica', 'Ave ornamental', 'Ave rapaz', 'Canario', 'Codorniz', 'Faisan', 'Gallina', 'Ganso', 'Loro', 'Paloma', 'Pato', 
    'Pavo', 'Periquito', 'Tórtola', 'Otro'],
    Reptil: ['Camaleón de Jackson', 'Camaleón pantera', 'Dragón acuático australiano', 'Dragón barbudo', 'Dragón de agua chino', 'Dragón de agua de Filipinas',
    'Gecko crestado de Nueva Caledonia', 'Gecko de cola de hoja', 'Gecko de cola gorda', 'Iguana verde', 'Pogona', 'Serpiente boa constrictora', 
    'Serpiente de árbol verde', 'Serpiente de bola', 'Serpiente de leche', 'Serpiente de liga', 'Serpiente de maíz', 'Serpiente de milhojas', 'Serpiente de rata', 
    'Serpiente rey', 'Tortuga de caparazón blando', 'Tortuga de caja', 'Tortuga de espolones', 'Tortuga de caparazón blando', 'Tortuga de orejas rojas',
    'Tortuga rusa', 'Otro'],
    Anfibio: ['Axolote', 'Newt crestado', 'Newt de vientre de fuego', 'Rana Pacman', 'Rana arbórea', 'Rana dardo venenoso', 'Salamandra de cola de algodón', 
    'Salamandra de dedos delgados', 'Salamandra tigre', 'Sapo común', 'Sapo de vientre de fuego', 'Tritón vientre de fuego', 'Otro'],
    Pez: ["Barbos", "Betta", "Cíclidos", "Corydora", "Pez Ángel", "Pez Ángel Coral", "Pez Arco Iris", "Pez Arlequín", "Pez Betta Dragón", "Pez Cirujano", 
    "Pez Cirujano", "Pez Conejo", "Pez Damisela", "Pez Disco", "Pez Dorado", "Pez Dottyback", "Pez Escorpión", "Pez Globo", "Pez Gourami", "Pez Guppys", "Pez Killi", 
    "Pez Killi Dorado", "Pez León", "Pez Lobo", "Pez Mandarín", "Pez Mandarín Verde", "Pez Mariposa", "Pez Mariposa Raya", "Pez Murciélago", "Pez Payaso", "Pez Platy",
    "Pez Ramirezi", "Pez Tetra Diamante", "Pez Tigre", "Pez Unicornio", "Pez de Cola de Espada", "Otro"],
    Otro: ['Hurón', 'Insecto', 'Otro']
  };
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [nombreError, setNombreError] = useState(false);
  const [edadError, setEdadError] = useState(false);
  const [sexoError, setSexoError] = useState(false);
  const [especieError, setEspecieError] = useState(false);
  const [razaError, setRazaError] = useState(false);
  const [colorError, setColorError] = useState(false);
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

    setNombreError(false);
    setEdadError(false);
    setSexoError(false);
    setEspecieError(false);
    setRazaError(false);
    setColorError(false);

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
        disponible: 1,
        ...imageUrl ? { imagenUrl: imageUrl } : {imagenUrl: imagen}

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
      if(Color.length <= 0)
      {
        setColorError(true);
      }
      if(Raza == '')
      {
        setRazaError(true);
      }
      if(Especie == '')
      {
        setEspecieError(true);
      }
      if(sexo == '')
      {
        setSexoError(true);
      }
      if(edad == '')
      {
        setEdadError(true);
      }
      if(nombre == '')
      {
        setNombreError(true);
      }
    }
    
  }

  const handleFileChange = async (e:any) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAbrirModal = (e: React.MouseEvent) => {
    e.preventDefault();
    actualizarFiltroRazas();
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
  };

  const handleSeleccionarRaza = (razaSeleccionada: string) => {
    setRaza(razaSeleccionada);
    setMostrarModal(false);
  };

  const handleBuscarRaza = (e: CustomEvent) => {
    const filtro = e.detail.value?.toLowerCase() || '';
    setFiltroRazas(opcionesRazaPorEspecie[Especie]?.filter(opcion => opcion.toLowerCase().includes(filtro)) || []);
  };

  const actualizarFiltroRazas = () => {
    // Mostrar todas las opciones disponibles al abrir el modal
    setFiltroRazas(opcionesRazaPorEspecie[Especie] || []);
  };
  
  const confirm = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const position = await Geolocation.getCurrentPosition();
    const { latitude, longitude } = position.coords;

    setNombreError(false);
    setEdadError(false);
    setSexoError(false);
    setEspecieError(false);
    setRazaError(false);
    setColorError(false);

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
          imagenUrl: imageUrl,
          disponible: 1
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
      if(Color.length <= 0)
      {
        setColorError(true);
      }
      if(Raza == '')
      {
        setRazaError(true);
      }
      if(Especie == '')
      {
        setEspecieError(true);
      }
      if(sexo == '')
      {
        setSexoError(true);
      }
      if(edad == '')
      {
        setEdadError(true);
      }
      if(nombre == '')
      {
        setNombreError(true);
      }
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
      const {nombre, edad, sexo, especie, raza, color, descripcion, imagenUrl} = data;
      setNombre(nombre);
      setEdad(edad);
      setSexo(sexo);
      setEspecie(especie);
      setRaza(raza);
      setColor(color);
      setDescripcion(descripcion);
      setImagen(imagenUrl)
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

        <IonItem className={`${nombreError ? 'error' : ''}`}>
          <IonInput label="Nombre *" label-placement="floating" value={nombre} onIonChange={(e) => setNombre(e.detail.value!)}></IonInput>
        </IonItem>

        <IonItem className={`${edadError ? 'error' : ''}`}>
          <IonInput label="Edad *" type="number" label-placement="floating" value={edad} onIonChange={(e) => setEdad(e.detail.value!)}></IonInput>
        </IonItem>

        <IonItem className={`${sexoError ? 'error' : ''}`}>
              <IonLabel>Sexo *</IonLabel>
              <IonSelect placeholder="Seleccione una especie" onIonChange={(e) => setSexo(e.detail.value!)} value={sexo}>
                <IonSelectOption value="Macho">Macho</IonSelectOption>
                <IonSelectOption value="Hembra">Hembra</IonSelectOption>
              </IonSelect>
        </IonItem>

        <IonItem className={`${especieError ? 'error' : ''}`}>
          <IonLabel>Especie *</IonLabel>
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

        <IonItem className={`${razaError ? 'error' : ''}`} onClick={handleAbrirModal} detail={true}>
          <IonLabel>Raza *</IonLabel>
          {Raza}
        </IonItem>

        <IonItem className={`${colorError ? 'error' : ''}`}>
          <IonLabel>Color *</IonLabel>
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

          <IonModal isOpen={mostrarModal} onDidDismiss={handleCerrarModal}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>Seleccionar Raza</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <IonSearchbar onIonChange={handleBuscarRaza} />
              {/* Lista de razas filtradas */}
              {filtroRazas.map((opcion, index) => (
                <IonItem key={index} button onClick={() => handleSeleccionarRaza(opcion)}>
                  <IonLabel>{opcion}</IonLabel>
                </IonItem>
              ))}
            </IonContent>
            <IonFooter>
              <IonToolbar>
                <IonButton expand="full" onClick={handleCerrarModal}>
                  Cancelar
                </IonButton>
              </IonToolbar>
            </IonFooter>
          </IonModal>

        </form>
      </IonContent>
    </IonPage>
  );
};

export default Mascotas_CE;
