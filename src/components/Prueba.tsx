import React, {useEffect} from 'react';

import { IonContent, IonPage } from '@ionic/react';

import * as tf from '@tensorflow/tfjs';

const Welcome: React.FC = () => {
    
    useEffect(() => {
        // Supongamos que tienes un conjunto de datos de mascotas
        const mascotas = [
          { id: 1, colores: ['Blanco', 'Negro'], likes: 45 },
          { id: 2, colores: ['Gris', 'Marrón'], likes: 32 },
          { id: 3, colores: ['Naranja', 'Amarillo'], likes: 18 },
          { id: 4, colores: ['Atigrado'], likes: 60 },
          { id: 5, colores: ['Manchado'], likes: 74 },
          { id: 6, colores: ['Rojo'], likes: 12 },
          { id: 7, colores: ['Azul'], likes: 85 },
          { id: 8, colores: ['Verde'], likes: 5 },
          { id: 9, colores: ['Negro'], likes: 41 },
          { id: 10, colores: ['Marrón'], likes: 30 },
          { id: 11, colores: ['Naranja'], likes: 10 },
          { id: 12, colores: ['Amarillo'], likes: 25 },
          { id: 13, colores: ['Atigrado', 'Manchado'], likes: 70 },
          { id: 14, colores: ['Rojo', 'Verde'], likes: 15 },
          { id: 15, colores: ['Azul', 'Marrón'], likes: 38 },
          { id: 16, colores: ['Gris', 'Negro'], likes: 42 },
          { id: 17, colores: ['Gris', 'Blanco'], likes: 20 },
          { id: 18, colores: ['Naranja', 'Amarillo'], likes: 8 },
          { id: 19, colores: ['Atigrado', 'Manchado'], likes: 65 },
          { id: 20, colores: ['Rojo', 'Verde'], likes: 55 },
          { id: 21, colores: ['Azul', 'Negro'], likes: 72 },
          { id: 22, colores: ['Verde'], likes: 48 },
          { id: 23, colores: ['Blanco'], likes: 9 },
          { id: 24, colores: ['Marrón'], likes: 28 },
          { id: 25, colores: ['Atigrado'], likes: 58 },
          { id: 26, colores: ['Manchado'], likes: 68 },
          { id: 27, colores: ['Rojo'], likes: 14 },
          { id: 28, colores: ['Azul'], likes: 80 },
          { id: 29, colores: ['Verde'], likes: 35 },
          { id: 30, colores: ['Naranja'], likes: 22 },
          { id: 31, colores: ['Rojo', 'Verde'], likes: 2 },
          { id: 32, colores: ['Azul'], likes: 3 },
          { id: 33, colores: ['Verde'], likes: 1 },
        ];
        
        // Supongamos que tienes un conjunto de datos de colores con sus likes únicos
        const coloresLikes = [
            { color: 'Blanco', likes: 50 },
            { color: 'Negro', likes: 75 },
            { color: 'Gris', likes: 34 },
            { color: 'Marron', likes: 27 },
            { color: 'Naranja', likes: 16 },
            { color: 'Amarillo', likes: 13 },
            { color: 'Atigrado', likes: 9 },
            { color: 'Manchado', likes: 18 },
            { color: 'Rojo', likes: 2 },
            { color: 'Azul', likes: 1 },
            { color: 'Verde', likes: 0 },
            // Agrega más colores con likes únicos según sea necesario
        ];
        

        // Convierte los datos de mascotas en tensores de TensorFlow.js
        // Función para convertir los datos de mascotas en tensores de TensorFlow.js
        function convertirDatosMascotasEnTensores(mascotas:any, coloresLikes:any) {
          const xs: number[][] = []; // Anotación de tipo explícita
          const ys: number[][] = []; // Anotación de tipo explícita

          mascotas.forEach((mascota:any) => {
            const coloresCodificados = coloresLikes.map((colorLike:any) =>
              mascota.colores.includes(colorLike.color) ? 1 : 0
            );
            xs.push(coloresCodificados);
            ys.push([calcularPuntuacion(mascota)]);
          });

          return {
            xs: tf.tensor2d(xs),
            ys: tf.tensor2d(ys),
          };
        }

        // Convierte los datos de mascotas en tensores de TensorFlow.js
        const { xs, ys } = convertirDatosMascotasEnTensores(mascotas, coloresLikes);

        // Crea un modelo de red neuronal densa
        
        const modelo = tf.sequential();
        
        modelo.add(tf.layers.dense({ units: 1, inputShape: [coloresLikes.length] }));

        // Compila el modelo
        modelo.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

        // Entrena el modelo con los datos de mascotas
        modelo.fit(xs, ys, { epochs: 100 }).then(async () => {

          await modelo.save('downloads://modelo');          
            // const modeloJSON = modelo.toJSON();          
            // // Convierte el modelo a formato JSON y descárgalo como un archivo
            // const modeloJSONString = JSON.stringify(modeloJSON);
            // const blob = new Blob([modeloJSONString], { type: 'application/json' });
            // const url = URL.createObjectURL(blob);

            // // Crea un enlace de descarga invisible
            // const a = document.createElement('a');
            // a.style.display = 'none';
            // a.href = url;
            // a.download = 'modelo.json';

            // // Agrega el enlace al documento y haz clic en él para descargar el modelo
            // document.body.appendChild(a);
            // a.click();

            // // Libera recursos
            // URL.revokeObjectURL(url);
            // document.body.removeChild(a);
        

        console.log('Modelo entrenado guardado con éxito.');



        // Supongamos que tienes datos de nuevas mascotas para las cuales deseas hacer recomendaciones
        const nuevasMascotas = [
          { colores: ['Blanco', 'Negro'], likes: 50 },
          { colores: ['Gris', 'Marrón'], likes: 28 },
          { colores: ['Naranja', 'Amarillo'], likes: 15 },
          { colores: ['Atigrado'], likes: 55 },
          { colores: ['Manchado'], likes: 72 },
          { colores: ['Rojo'], likes: 9 },
          { colores: ['Azul'], likes: 68 },
          { colores: ['Verde'], likes: 7 },
          { colores: ['Negro'], likes: 44 },
          { colores: ['Marrón'], likes: 34 },
          { colores: ['Naranja'], likes: 20 },
          { colores: ['Amarillo'], likes: 23 },
          { colores: ['Atigrado', 'Manchado'], likes: 63 },
          { colores: ['Rojo', 'Verde'], likes: 17 },
          { colores: ['Azul', 'Marrón'], likes: 40 },
          { colores: ['Gris', 'Negro'], likes: 46 },
          { colores: ['Gris', 'Blanco'], likes: 22 },
          { colores: ['Naranja', 'Amarillo'], likes: 11 },
          { colores: ['Atigrado', 'Manchado'], likes: 66 },
          { colores: ['Rojo', 'Verde'], likes: 51 },
          { colores: ['Azul', 'Negro'], likes: 70 },
          { colores: ['Verde'], likes: 55 },
          { colores: ['Blanco'], likes: 13 },
          { colores: ['Marrón'], likes: 31 },
          { colores: ['Atigrado'], likes: 60 },
          { colores: ['Manchado'], likes: 67 },
          { colores: ['Rojo'], likes: 18 },
          { colores: ['Azul'], likes: 77 },
          { colores: ['Verde'], likes: 40 },
          { colores: ['Naranja'], likes: 25 }
        ];

        // Convierte los datos de las nuevas mascotas en un tensor
        const { xs: xsNuevasMascotas } = convertirDatosMascotasEnTensores(nuevasMascotas, coloresLikes);
        console.log(xsNuevasMascotas)
        // Realiza predicciones de recomendación utilizando el modelo cargado
        
        const modeloCargado = await tf.loadLayersModel('/assets/modelo.json');

        const recomendaciones = modeloCargado.predict(xsNuevasMascotas) as tf.Tensor;
        
        // Obtiene las puntuaciones de recomendación como un arreglo
        const puntuaciones = recomendaciones.arraySync() as number[];

        // Ordena las nuevas mascotas en función de las puntuaciones
        nuevasMascotas.sort((a, b) => puntuaciones[nuevasMascotas.indexOf(b)] - puntuaciones[nuevasMascotas.indexOf(a)]);

        // Ahora 'nuevasMascotas' contiene las nuevas mascotas ordenadas en función de la puntuación de recomendación
        console.log(nuevasMascotas);

        });

        // Función para calcular la puntuación de recomendación de una mascota
        function calcularPuntuacion(mascota:any) {
          return mascota.likes + coloresLikes.reduce((total, colorLike) => {
            const tieneColor = mascota.colores.includes(colorLike.color);
            return total + (tieneColor ? colorLike.likes : 0);
          }, 0);
        }
      })

    return (
      <IonPage>
        <IonContent fullscreen>
        Prueba
        </IonContent>
      </IonPage>
    );
  };
  
  export default Welcome;
  