import React from 'react';
import { useHistory } from 'react-router-dom'

import { IonContent, IonPage, IonImg, IonButton } from '@ionic/react';

import { Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react';

import './Welcome.css'
import 'swiper/css';
import 'swiper/css/pagination';

import bienvenido from '../images/Welcome.png'
import match from '../images/Match_2.png'
import happy from '../images/Contento.png'

const Welcome: React.FC = () => {
    const history = useHistory();
  
    return (
      <IonPage>
        <IonContent fullscreen>
        <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
            <SwiperSlide>
              <div className='content'>
                <IonImg src={bienvenido}></IonImg>
                <h2>¡Bienvenido!</h2>
                <p>
                  Te damos la bienvenida a <b>Firulove</b>, donde todas las mascotas son aceptadas y las ayudamos para que
                  puedan encontrar compañeros o pareja.
                </p>
              </div>
            </SwiperSlide>
            <SwiperSlide>
            <div className='content'>
            <IonImg src={match}></IonImg>
              <h2>Encuentra su compañero ideal</h2>
              <p>
                En <b>Firulove</b> vas a poder encontrar un compañero ideal para tu mascota, teniendo en cuenta su especie, raza
                y distancia.
              </p>
            </div> 
            </SwiperSlide>
            <SwiperSlide>
            <div className='content'>
            <IonImg src={happy}></IonImg>
              <h2>¿Empezamos?</h2>
              <p>
                ¡Registra tu primera mascota ahora!
              </p>
              <br></br>
              <br></br>
              <div>
                <IonButton size="large" shape="round" routerDirection='root' expand='block' href="/mascotas/create">Empezar</IonButton>
              </div>
            </div>
            </SwiperSlide>
        </Swiper>
        </IonContent>
      </IonPage>
    );
  };
  
  export default Welcome;
  