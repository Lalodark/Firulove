import React, { useEffect, useState } from 'react';

import { IonContent, IonPage, useIonToast, IonImg, IonLabel, IonInput, IonItem, IonButton, IonText  } from '@ionic/react';
import { alertCircleOutline } from 'ionicons/icons';

import { auth } from '../firebase'
import { sendPasswordResetEmail } from 'firebase/auth';

import './Recover.css'
import logo from '../images/logofirulove2.png'
import letra from  '../images/logoletras.png'

const Recover: React.FC = () => {
    
    const [present] = useIonToast();
    const [email, setEmail] = useState<string>('');
    const [emailError, setEmailError] = useState(false);
    const [msgerror, setMsgError] = useState<string>('')

    const presentToast = () => {
        present({
          message: msgerror,
          duration: 1500,
          position: 'top',
          icon: alertCircleOutline,
          color: 'danger'
        });
    };

    const presentSuccessToast = () => {
      present({
        message: "¡Mail enviado con éxito!",
        duration: 1500,
        position: 'top',
        icon: alertCircleOutline,
        color: 'success'
      });
  };

    const sendMail = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setEmailError(false);

        if(email != '')
        {
          try{
            await sendPasswordResetEmail(auth, email);
            presentSuccessToast()
          }
          catch{
            setMsgError('El mail ingresado no es válido.')
            presentToast();
            setEmailError(true);
          }
        }
        else
        {
          setMsgError('Por favor complete todos los campos para continuar.')
          presentToast();
          setEmailError(true);
        }
        
    }

    useEffect(() => {
        if(msgerror != '')
        {
          presentToast()
        }
    }, [msgerror])

    return (
      <IonPage>
        <IonContent className='background'>
          <div className='container'>
              <IonImg className="logo" src={logo}></IonImg>
              <div className="container">
                <IonImg className="letra" src={letra}></IonImg>
              </div>
          </div>
          <form className='form' onSubmit={sendMail}> 
            <div className='container con-input'>
            <IonText color={'primary'}>
                <h1>
                    Recuperar Contraseña
                </h1>
            </IonText>
              <IonItem className={`loginput ${emailError ? 'error' : ''}`}>
                <IonLabel position="floating">Email</IonLabel>
                <IonInput type="email" onIonChange={(e) => setEmail(e.detail.value!)} />
              </IonItem>
            </div>
            <div className='container con-bttn'>
                <IonButton size="large" shape="round" routerDirection='root' expand='block' type='submit'>Recuperar</IonButton>
                <p>¿Recordaste tu contraseña? <a href="/login">Intentá logearte.</a></p>
            </div>
          </form>
        </IonContent>
      </IonPage>
    );
  };
  
  export default Recover;
  