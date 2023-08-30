import React, {useEffect, useState} from 'react';
import { IonContent, IonLabel, IonButton, IonItem, IonHeader, IonToolbar, IonRange, IonSelect, IonSelectOption,
IonButtons,IonTitle } from '@ionic/react';


const Filtros: React.FC = () => {

  const[Especie, setEspecie] = useState<string>('')
  const[Raza, setRaza] = useState<string>('')
  const[distancia, setDistancia] = useState<number>(10)
  const[edadMinima, setEdadMinima] = useState<number>(5)
  const[edadMaxima, setEdadMaxima] = useState<number>(9)

  const [flag, setFlag] = useState(0)
  const opcionesRazaPorEspecie: Record<string, string[]> = {
    Perro: ['Opción 1', 'Opción 2', 'Opción 3'],
    Gato: ['Opción A', 'Opción B', 'Opción C'],
    Roedor: ['Opción X', 'Opción Y', 'Opción Z'],
    // Agrega opciones para las otras especies
  };

  const [rangeValue, setRangeValue] = useState<{ lower: number; upper: number }>({
      lower: 2,
      upper: 8
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
      setRangeValue({ lower: edadMinima, upper: edadMaxima }); // set default values as required
  },[])

  const handleEspecieChange = (e: CustomEvent) => {
    const nuevaEspecie = e.detail.value!;
    setEspecie(nuevaEspecie);

    // Cuando cambia la especie, reinicia la raza
    setRaza('');
  };

  return (
          <IonContent className="ion-padding">
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
          </IonContent>
  );
};

export default Filtros;
