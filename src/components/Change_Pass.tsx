import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'

import { IonContent, IonPage, useIonToast, IonImg, IonItem, IonLabel, IonInput, IonButton } from '@ionic/react';
import { alertCircleOutline } from 'ionicons/icons';

import { auth } from '../firebase'
import { confirmPasswordReset } from 'firebase/auth';

import './Change_Pass.css'
import logo from '../images/logofirulove2.png'
import letra from  '../images/logoletras.png'

const Change_Pass: React.FC = () => {
    
    const history = useHistory();
    const [present] = useIonToast();
    const [pass, setPass] = useState<string>('')
    const [rpass, setRpass] = useState<string>('')

    const [passwordError, setPasswordError] = useState(false);
    const [rpasswordError, setRpasswordError] = useState(false);
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
        message: "¡Contraseña cambiada con éxito!",
        duration: 1500,
        position: 'top',
        icon: alertCircleOutline,
        color: 'success'
      });
    };

    const cambiarContraseña = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setPasswordError(false);
        setRpasswordError(false);

        const actionCode = new URLSearchParams(window.location.search).get('oobCode');

        if(pass != '' && rpass != '' && pass == rpass)
        {
          try {
            if(actionCode)
            {
              await confirmPasswordReset(auth, actionCode, pass);
              presentSuccessToast()
              await setTimeout(() => {
                console.log("Redirigiendo al Login");
              }, 3000);
              history.push('/login')
            }
          } catch {
            setMsgError('La contraseña debe tener 6 carácteres o más.')
            setRpasswordError(true);
            setPasswordError(true);
            presentToast()
          }
        }
        else if (pass == '' || rpass == '') 
        {
          setMsgError('Por favor complete todos los campos para continuar.')
          if(rpass == '')
          {
            setRpasswordError(true);
          }
          if(pass == '')
          {
            setPasswordError(true);
          }
          presentToast()
        }
        else if (pass != rpass)
        {
          setMsgError('Las contraseñas ingresadas no coinciden.')
          setPasswordError(true);
          setRpasswordError(true);
          presentToast()
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
          <form className='form' onSubmit={cambiarContraseña}>
            <div className='container con-input'>
              <IonItem className={`loginput ${passwordError ? 'error' : ''}`}>
                <IonLabel position="floating">Contraseña</IonLabel>
                <IonInput type="password" onIonChange={(e) => setPass(e.detail.value!)} />
              </IonItem>
              <IonItem className={`loginput ${rpasswordError ? 'error' : ''}`}>
                <IonLabel position="floating">Repetir Contraseña</IonLabel>
                <IonInput type="password" onIonChange={(e) => setRpass(e.detail.value!)} />
              </IonItem>
            </div>
            <div className='container con-bttn'>
                <IonButton size="large" shape="round" routerDirection='root' expand='block' type='submit'>Cambiar Contraseña</IonButton>
            </div>
          </form>
          
        </IonContent>
      </IonPage>
    );
  };
  
  export default Change_Pass;