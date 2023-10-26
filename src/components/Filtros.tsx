import React, { useEffect, useState } from 'react';

import { IonContent, IonLabel, IonButton, IonItem, IonHeader, IonToolbar, IonRange, IonSelect, IonSelectOption,
IonButtons,IonTitle, useIonViewWillEnter } from '@ionic/react';

import { auth, store } from '../firebase'
import { collection, query, where, getDocs } from "firebase/firestore";

const Filtros: React.FC <{onClose: () => void }> = ({
  onClose
}) =>  {

  //Variables & Declaraciones

  const[Especie, setEspecie] = useState<string>('')
  const[Raza, setRaza] = useState<string>('')
  const[sexo, setSexo] = useState<string>('')
  const[distancia, setDistancia] = useState<number>()
  const[edadMinima, setEdadMinima] = useState<number>(5)
  const[edadMaxima, setEdadMaxima] = useState<number>(9)

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
          </form>      
        </IonContent>
  );
};

export default Filtros;
