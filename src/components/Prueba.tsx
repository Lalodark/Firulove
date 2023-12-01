import React, {useEffect} from 'react';

import { IonContent, IonPage } from '@ionic/react';

import * as tf from '@tensorflow/tfjs';

const Prueba: React.FC = () => {
    
    useEffect(() => {
        // Supongamos que tienes un conjunto de datos de mascotas
        const mascotas = [
          { id: 1, color: ['Blanco', 'Negro'], likesrecibidos: 45 },
          { id: 2, color: ['Gris', 'Marron'], likesrecibidos: 32 },
          { id: 3, color: ['Naranja', 'Amarillo'], likesrecibidos: 18 },
          { id: 4, color: ['Atigrado'], likesrecibidos: 60 },
          { id: 5, color: ['Manchado'], likesrecibidos: 74 },
          { id: 6, color: ['Rojo'], likesrecibidos: 12 },
          { id: 7, color: ['Azul'], likesrecibidos: 85 },
          { id: 8, color: ['Verde'], likesrecibidos: 5 },
          { id: 9, color: ['Negro'], likesrecibidos: 41 },
          { id: 10, color: ['Marron'], likesrecibidos: 30 },
          { id: 11, color: ['Naranja'], likesrecibidos: 10 },
          { id: 12, color: ['Amarillo'], likesrecibidos: 25 },
          { id: 13, color: ['Atigrado', 'Manchado'], likesrecibidos: 70 },
          { id: 14, color: ['Rojo', 'Verde'], likesrecibidos: 15 },
          { id: 15, color: ['Azul', 'Marron'], likesrecibidos: 38 },
          { id: 16, color: ['Gris', 'Negro'], likesrecibidos: 42 },
          { id: 17, color: ['Gris', 'Blanco'], likesrecibidos: 20 },
          { id: 18, color: ['Naranja', 'Amarillo'], likesrecibidos: 8 },
          { id: 19, color: ['Atigrado', 'Manchado'], likesrecibidos: 65 },
          { id: 20, color: ['Rojo', 'Verde'], likesrecibidos: 55 },
          { id: 21, color: ['Azul', 'Negro'], likesrecibidos: 72 },
          { id: 22, color: ['Verde'], likesrecibidos: 48 },
          { id: 23, color: ['Blanco'], likesrecibidos: 9 },
          { id: 24, color: ['Marron'], likesrecibidos: 28 },
          { id: 25, color: ['Atigrado'], likesrecibidos: 58 },
          { id: 26, color: ['Manchado'], likesrecibidos: 68 },
          { id: 27, color: ['Rojo'], likesrecibidos: 14 },
          { id: 28, color: ['Azul'], likesrecibidos: 80 },
          { id: 29, color: ['Verde'], likesrecibidos: 35 },
          { id: 30, color: ['Naranja'], likesrecibidos: 22 },
          { id: 31, color: ['Rojo', 'Verde'], likesrecibidos: 2 },
          { id: 32, color: ['Azul'], likesrecibidos: 3 },
          { id: 33, color: ['Verde'], likesrecibidos: 1 },
          { id: 34, color: ['Negro'], likesrecibidos: 1 },
          { id: 35, color: ['Blanco'], likesrecibidos: 60 },
        ];
        
        // Supongamos que tienes un conjunto de datos de colores con sus likes únicos
        const coloresLikes = [
            { color: 'Blanco', likes: 37 },
            { color: 'Negro', likes: 30 },
            { color: 'Gris', likes: 34 },
            { color: 'Marron', likes: 40 },
            { color: 'Naranja', likes: 36 },
            { color: 'Amarillo', likes: 33 },
            { color: 'Atigrado', likes: 32 },
            { color: 'Manchado', likes: 31 },
            { color: 'Rojo', likes: 30 },
            { color: 'Azul', likes: 29 },
            { color: 'Verde', likes: 28 },
        ];
        

        // Convierte los datos de mascotas en tensores de TensorFlow.js
        // Función para convertir los datos de mascotas en tensores de TensorFlow.js
        function convertirDatosMascotasEnTensores(mascotas:any, coloresLikes:any) {
          const xs: number[][] = [];
          const ys: number[][] = [];
        
          mascotas.forEach((mascota: any) => {
            const coloresCodificados = coloresLikes.map((colorLike: any) =>
              mascota.color.includes(colorLike.color) ? 1 : 0
            );
            const features = [...coloresCodificados, mascota.likesrecibidos]; // Solo incluir las codificaciones de colores y los "likes" de las mascotas
            xs.push(features);
            ys.push([calcularPuntuacion(features)]);
          });
        
          const numFilas = xs.length;
          const numColumnas = coloresLikes.length + 1; // Suma 1 para los "likes" de las mascotas
          
          return {
            xs: tf.tensor2d(xs, [numFilas, numColumnas]),
            ys: tf.tensor2d(ys, [numFilas, 1]),
          };
        }

        // Convierte los datos de mascotas en tensores de TensorFlow.js
        const { xs, ys } = convertirDatosMascotasEnTensores(mascotas, coloresLikes);

        // Crea un modelo de red neuronal densa
        
        const modelo = tf.sequential();
        
        modelo.add(tf.layers.dense({ units: 1, inputShape: [coloresLikes.length + 1], activation: 'relu' }));

        // Compila el modelo
        modelo.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

        // Entrena el modelo con los datos de mascotas
        modelo.fit(xs, ys, { epochs: 300 }).then(async () => {

          await modelo.save('downloads://modelo');          
        

        console.log('Modelo entrenado guardado con éxito.');



        // Supongamos que tienes datos de nuevas mascotas para las cuales deseas hacer recomendaciones
        const nuevasMascotas = [
          { color: ['Blanco', 'Negro'], likesrecibidos: 50 },
          { color: ['Gris', 'Marron'], likesrecibidos: 28 },
          { color: ['Naranja', 'Amarillo'], likesrecibidos: 15 },
          { color: ['Atigrado'], likesrecibidos: 55 },
          { color: ['Manchado'], likesrecibidos: 72 },
          { color: ['Rojo'], likesrecibidos: 9 },
          { color: ['Azul'], likesrecibidos: 68 },
          { color: ['Verde'], likesrecibidos: 7 },
          { color: ['Negro'], likesrecibidos: 44 },
          { color: ['Marron'], likesrecibidos: 34 },
          { color: ['Naranja'], likesrecibidos: 20 },
          { color: ['Amarillo'], likesrecibidos: 23 },
          { color: ['Atigrado', 'Manchado'], likesrecibidos: 63 },
          { color: ['Rojo', 'Verde'], likesrecibidos: 17 },
          { color: ['Azul', 'Marron'], likesrecibidos: 40 },
          { color: ['Gris', 'Negro'], likesrecibidos: 46 },
          { color: ['Gris', 'Blanco'], likesrecibidos: 22 },
          { color: ['Naranja', 'Amarillo'], likesrecibidos: 11 },
          { color: ['Atigrado', 'Manchado'], likesrecibidos: 66 },
          { color: ['Rojo', 'Verde'], likesrecibidos: 51 },
          { color: ['Azul', 'Negro'], likesrecibidos: 70 },
          { color: ['Verde'], likesrecibidos: 55 },
          { color: ['Blanco'], likesrecibidos: 13 },
          { color: ['Marron'], likesrecibidos: 31 },
          { color: ['Atigrado'], likesrecibidos: 60 },
          { color: ['Manchado'], likesrecibidos: 67 },
          { color: ['Rojo'], likesrecibidos: 18 },
          { color: ['Azul'], likesrecibidos: 77 },
          { color: ['Verde'], likesrecibidos: 40 },
          { color: ['Naranja'], likesrecibidos: 25 }
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
        function calcularPuntuacion(features:any[]) {
          const likesMascotas = features[coloresLikes.length + 1];
          const likesColores = coloresLikes.reduce((total: any, colorLike: any, index: number) => {
            return total + (features[index] ? colorLike.likes : 0);
          }, 0);
          return likesMascotas + likesColores;
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
  
  export default Prueba;
  