import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'

import { IonContent, IonInput, IonItem, IonLabel, IonPage, IonButton, IonImg, useIonToast } from '@ionic/react';
import { alertCircleOutline } from 'ionicons/icons';

import { auth, store } from '../firebase'
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

import './Login.css'
import logo from '../images/logofirulove2.png'
import letra from  '../images/logoletras.png'

const Login: React.FC = () => {

  //Variables & Declaraciones
  const history = useHistory();
  const [present] = useIonToast();

  const[email, setEmail] = useState<string>('')
  const[pass, setPass] = useState<string>('')
  
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const[msgerror, setMsgError] = useState<string>('')
  
  //Funciones

  const LoginUsuario = async (e:React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault()
    setEmailError(false);
    setPasswordError(false);

    if(email != '' && pass != '')
    {
      
      try {
        await auth.signInWithEmailAndPassword(email, pass);
        setMsgError('')
        const usuarioss = collection(store,'usuarios')
        const user = query(usuarioss, where("email", "==", email))
        const querySnapshots = await getDocs(user)
        if (!querySnapshots.empty) {
            const doc = querySnapshots.docs[0];
            const data = doc.data()
            const {activepet } = data;

            if(activepet != '')
            {
              history.push('/menu')
            }
            else
            {
              history.push('/welcome')
            }
          }
      } catch (error:any) {
        if (error.code === 'auth/wrong-password' ) { 
          setMsgError('El password ingresado no es correcto.');
          setPasswordError(true);
          presentToast()
        }
        if (error.code === 'auth/user-not-found' ) { 
          setMsgError('No se ha encontrado el email ingresado.');
          setEmailError(true);
          presentToast()
        }
      }
    }
    else
    {
      setMsgError('Por favor complete todos los campos para continuar.');
      presentToast()
      if(pass == '')
      {
        setPasswordError(true);
      }
      if(email == '')
      {
        setEmailError(true);
      }
    }
    
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
        <form className='form' onSubmit={LoginUsuario}>
          <div className='container con-input'>
            <IonItem className={`loginput ${emailError ? 'error' : ''}`}>
              <IonLabel position="floating">Email</IonLabel>
              <IonInput type="email" onIonChange={(e) => setEmail(e.detail.value!)} />
            </IonItem>
            <IonItem className={`loginput ${passwordError ? 'error' : ''}`}>
              <IonLabel position="floating">Password</IonLabel>
              <IonInput type="password" onIonChange={(e) => setPass(e.detail.value!)} />
            </IonItem>
          </div>
          <div className='container con-bttn'>
              <IonButton size="large" shape="round" routerDirection='root' expand='block' type='submit'>Login</IonButton>
              <p>¿No tienes una cuenta? <a href="/register">¡Create una!</a></p>
              <p>¿Olvidaste tu contraseña? <a href="/recover">¡Recupérala!</a></p>
          </div>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Login;
