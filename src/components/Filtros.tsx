import React, { useEffect, useState } from 'react';

import { IonContent, IonLabel, IonButton, IonItem, IonHeader, IonToolbar, IonRange, IonSelect, IonSelectOption,
IonButtons,IonTitle, useIonViewWillEnter, IonSearchbar, IonModal, IonFooter } from '@ionic/react';

import { auth, store } from '../firebase'
import { collection, query, where, getDocs } from "firebase/firestore";

const Filtros: React.FC <{onClose: () => void }> = ({
  onClose
}) =>  {

  //Variables & Declaraciones

  const[Especie, setEspecie] = useState<string>('')
  const[Raza, setRaza] = useState<string>('')
  const [mostrarModal, setMostrarModal] = useState(false);
  const [filtroRazas, setFiltroRazas] = useState<string[]>([]);
  
  const[sexo, setSexo] = useState<string>('')
  const[distancia, setDistancia] = useState<number>()
  const[edadMinima, setEdadMinima] = useState<number>(5)
  const[edadMaxima, setEdadMaxima] = useState<number>(9)

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

  const [rangeValue, setRangeValue] = useState<{ lower: number; upper: number }>({
      lower: edadMinima,
      upper: edadMaxima
  });
    

  //Funciones

  const handleDualRangeChange = (event: CustomEvent) => {
      const newValue = event.detail.value;
      setRangeValue(newValue);
  };
  
  const handleRangeChange = (event: CustomEvent) => {
    const newValue = event.detail.value;
    setDistancia(newValue);
  };

  const handleEspecieChange = (e: CustomEvent) => {
    const nuevaEspecie = e.detail.value!;
    setEspecie(nuevaEspecie);
    setRaza('');
  };

  const confirm = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const getpetid = async() =>{
      auth.onAuthStateChanged(async (usuarioActual) => {
        if (usuarioActual) {
          const email = usuarioActual.email;
          const usuarioss = collection(store,'usuarios')
          const user = query(usuarioss, where("email", "==", email))
          const querySnapshots = await getDocs(user)
          if (!querySnapshots.empty) {
              const doc = querySnapshots.docs[0];
              const data = doc.data()
              const {activepet} = data;
              guardarFiltros(activepet)
      }}})
    }
    const guardarFiltros = async(idpet:any) =>{
    const mascotass = collection(store,'filtros')
    const filtro = query(mascotass, where("idmascota", "==", idpet))
    const querySnapshots = await getDocs(filtro)
    if(!querySnapshots.empty)
      {
        const docs = querySnapshots.docs[0];
        const newfilters ={
          idmascota:idpet,
          especie:Especie,
          raza:Raza,
          sexo:sexo,
          distancia:distancia,
          edadMinima:rangeValue.lower,
          edadMaxima:rangeValue.upper
        }
        await store.collection('filtros').doc(docs.id).set(newfilters)
      }
      onClose()
      location.reload() 
    }
    getpetid()
  }

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

  const getpetid = async () =>{
    auth.onAuthStateChanged(async (usuarioActual) => {
      if (usuarioActual) {
        const email = usuarioActual.email;
        const usuarioss = collection(store,'usuarios')
        const user = query(usuarioss, where("email", "==", email))
        const querySnapshots = await getDocs(user)
        if (!querySnapshots.empty) {
            const doc = querySnapshots.docs[0];
            const data = doc.data()
            const {activepet} = data;
            setInitialFilters(activepet);
    }}})
  }

  const setInitialFilters = async (idpet:any) =>{
    const mascotass = collection(store,'filtros')
    const user = query(mascotass, where("idmascota", "==", idpet))
    const querySnapshots = await getDocs(user)

    if(!querySnapshots.empty)
    {
      const docs = querySnapshots.docs[0];
      const data = docs.data()
      const {especie, raza, sexo, distancia, edadMinima, edadMaxima} = data;
      setSexo(sexo);
      setEspecie(especie);
      setRaza(raza);
      setDistancia(distancia);
      setRangeValue({ lower: edadMinima, upper: edadMaxima });
    }
  }

  // useIonViewWillEnter (() => {
  //   console.log("e")
  // })

  useEffect(() => {
    getpetid()
  },[])


  return (
          <IonContent fullscreen>
            <form onSubmit={confirm}>
            <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => onClose()}>Cancelar</IonButton>
              </IonButtons>
              <IonTitle>Filtros</IonTitle>
              <IonButtons slot="end">
                <IonButton strong={true} type='submit'>
                  Aplicar
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
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
            
          <IonItem onClick={handleAbrirModal} detail={true}>
            <IonLabel>Raza</IonLabel>
            {Raza}
          </IonItem>

            <IonItem>
              <IonLabel>Sexo</IonLabel>
              <IonSelect placeholder="Seleccione una especie" onIonChange={(e) => setSexo(e.detail.value!)} value={sexo}>
                <IonSelectOption value="Macho">Macho</IonSelectOption>
                <IonSelectOption value="Hembra">Hembra</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Distancia</IonLabel>
              <IonRange min={1} max={80} value={distancia} onIonChange={handleRangeChange}></IonRange>

              <div>
              Distancia: {distancia} KM
              </div>
            </IonItem>
            
            <IonItem>
              <IonLabel position="stacked">Edad</IonLabel>
              <IonRange min={1} max={15} step={1} dualKnobs={true} ticks={true} snaps={true} onIonChange={handleDualRangeChange} value={{lower: rangeValue.lower, upper: rangeValue.upper}} ></IonRange>
              <div>
                Edad: {rangeValue.lower} - {rangeValue.upper} años
              </div>
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
  );
};

export default Filtros;
