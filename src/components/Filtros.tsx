import React, {useEffect, useState} from 'react';
import { IonContent, IonLabel, IonButton, IonItem, IonHeader, IonToolbar, IonRange, IonSelect, IonSelectOption,
IonButtons,IonTitle } from '@ionic/react';
import {auth, store} from '../firebase'
import { collection, query, where, getDocs } from "firebase/firestore";

const Filtros: React.FC <{onClose: () => void }> = ({
  onClose
}) =>  {

  const[Especie, setEspecie] = useState<string>('')
  const[Raza, setRaza] = useState<string>('')
  const[sexo, setSexo] = useState<string>('')
  const[distancia, setDistancia] = useState<number>()
  const[edadMinima, setEdadMinima] = useState<number>(5)
  const[edadMaxima, setEdadMaxima] = useState<number>(9)

  const opcionesRazaPorEspecie: Record<string, string[]> = {
    Perro: ['Opción 1', 'Opción 2', 'Opción 3'],
    Gato: ['Opción A', 'Opción B', 'Opción C'],
    Roedor: ['Opción X', 'Opción Y', 'Opción Z'],
    // Agrega opciones para las otras especies
  };

  const [rangeValue, setRangeValue] = useState<{ lower: number; upper: number }>({
      lower: edadMinima,
      upper: edadMaxima
  });
    

  const handleDualRangeChange = (event: CustomEvent) => {
      const newValue = event.detail.value;
      setRangeValue(newValue);
  };
  
  const handleRangeChange = (event: CustomEvent) => {
    const newValue = event.detail.value;
    setDistancia(newValue);
  };

  useEffect(() => {

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
        setRangeValue({ lower: edadMinima, upper: edadMaxima }); // set default values as required
      }
    }
    getpetid()
  },[])

  const handleEspecieChange = (e: CustomEvent) => {
    const nuevaEspecie = e.detail.value!;
    setEspecie(nuevaEspecie);
    // Cuando cambia la especie, reinicia la raza
    setRaza('');
  };

  const confirm = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const idpet = 'llzlmpck'
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
  }

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
              <IonRange min={0} max={80} value={distancia} onIonChange={handleRangeChange}></IonRange>

              <div>
              Distancia: {distancia} KM
              </div>
            </IonItem>
            
            <IonItem>
              <IonLabel position="stacked">Edad</IonLabel>
              <IonRange min={0} max={10} step={1} dualKnobs={true} ticks={true} snaps={true} onIonChange={handleDualRangeChange} value={{lower: rangeValue.lower, upper: rangeValue.upper}} ></IonRange>
              <div>
                Edad: {rangeValue.lower} - {rangeValue.upper} años
              </div>
            </IonItem>    
          </form>      
        </IonContent>
  );
};

export default Filtros;
