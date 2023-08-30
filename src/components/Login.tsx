import React, {useState} from 'react';
import { IonContent, IonInput, IonItem, IonLabel, IonPage, IonButton, IonImg } from '@ionic/react';
import {useHistory} from 'react-router-dom'
import './Login.css'
import {auth} from '../firebase'
import logo from '../images/logofirulove.png'
import letra from  '../images/logoletras.png'
import { FirebaseError } from 'firebase/app';

const Login: React.FC = () => {
  const[email, setEmail] = useState<string>('')
  const[pass, setPass] = useState<string>('')
  const[msgerror, setMsgError] = useState<string>('')
  const history = useHistory();

  const LoginUsuario = async (e:React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault()
    try {
      await auth.signInWithEmailAndPassword(email, pass);
      // La autenticación fue exitosa, redirigir al usuario
      history.push('/menu');
    } catch (error:any) {
      if (error.code === 'auth/wrong-password') {
        setMsgError('El password ingresado no es correcto.');
      }
    }
  }

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
            <IonItem className='loginput'>
              <IonLabel position="floating">Email</IonLabel>
              <IonInput type="email" onIonChange={(e) => setEmail(e.detail.value!)} />
            </IonItem>
            <IonItem className='loginput'>
              <IonLabel position="floating">Password</IonLabel>
              <IonInput type="password" onIonChange={(e) => setPass(e.detail.value!)} />
            </IonItem>
          </div>
          <div className='container con-bttn'>
              <IonButton size="large" shape="round" routerDirection='root' expand='block' type='submit'>Login</IonButton>
              <p>¿No tienes una cuenta? <a href="/register">¡Create una!</a></p>
          </div>
        </form>
        {
            msgerror != null ? (
              <div>
                {msgerror}
              </div>
            )
            :
            (
              <span></span>
            )
        }
      </IonContent>
    </IonPage>
  );
};

export default Login;
