import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'

import { IonContent, IonInput, IonItem, IonLabel, IonPage, IonDatetime, IonButton,
IonPopover, IonText, useIonToast, IonHeader } from '@ionic/react';
import { alertCircleOutline } from 'ionicons/icons';

import { auth, store } from '../firebase'
import { Timestamp } from "firebase/firestore";

import { format } from 'date-fns';
import uniqid from 'uniqid';

import './Register.css'

const Register: React.FC = () => {

  //Variables & Declaraciones
  
  const history = useHistory();
  const [present] = useIonToast();
  const[nombre, setNombre] = useState<string>('')
  const[apellido, setApellido] = useState<string>('')
  const[fecha, setFecha] = useState<string>('')
  const[email, setEmail] = useState<string>('')
  const[pass, setPass] = useState<string>('')
  const[rpass, setRpass] = useState<string>('')

  const [nombreError, setNombreError] = useState(false);
  const [apellidoError, setApellidoError] = useState(false);
  const [fechaError, setFechaError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [rpasswordError, setRpasswordError] = useState(false);
  const[msgerror, setMsgError] = useState<string>('')
  const dia = Timestamp.now()
  //Funciones

  const handleFechaChange = (e: CustomEvent) => {
    const selectedDate = e.detail.value; 
    setFecha(selectedDate); 
  };

  const formatDate = (dateString:string) => {
    if(fecha){
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy');
    }
    return '';
  };

  const chequearMayoria = () => {
    if(fecha)
    {
      const dateOfBirth = new Date(fecha);
      const today = new Date();
      let age = today.getFullYear() - dateOfBirth.getFullYear();
      if (
        today.getMonth() < dateOfBirth.getMonth() ||
        (today.getMonth() === dateOfBirth.getMonth() &&
          today.getDate() < dateOfBirth.getDate())
      ) {
        age--;
      }

      if(age >= 18)
      {
        return true;
      }
      else
      {
        return false;
      }
    }
    return '';
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

  const RegistrarUsuario = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setNombreError(false);
    setApellidoError(false);
    setFechaError(false);
    setEmailError(false);
    setPasswordError(false);
    setRpasswordError(false);

    if(nombre != '' && apellido != '' && fecha != '' && email != '' && pass != '' && rpass != '' && pass == rpass && chequearMayoria())
    {
      try{
        await auth.createUserWithEmailAndPassword(email, pass)
        const usuario = {
          id:uniqid(),
          nombre:nombre,
          apellido:apellido,
          fecha:formatDate(fecha),
          email:email,
          activepet:'',
          dayLikes: dia,
          likes: 15
        }
        try{
          await store.collection('usuarios').add(usuario)
          setMsgError('')
          history.push('/welcome')
        }
        catch(e){
          console.log(e)
        }
      }
      catch(error:any){
        console.log(error)
        if(error.code == 'auth/invalid-email'){
          setMsgError('Formato de Email Inválido.')
          presentToast()
          setEmailError(true);
        }
        if(error.code == 'auth/weak-password')
        {
          setMsgError('La contraseña debe tener 6 carácteres o más.')
          presentToast()
          setRpasswordError(true);
          setPasswordError(true);
        }
        if(error.code == 'auth/email-already-in-use')
        {
          setMsgError('El Email ingresado ya se encuentra en uso.')
          presentToast()
          setEmailError(true);
        }
      }
    }
    else if (nombre == '' || apellido == '' || fecha == '' || email == '' || pass == '' || rpass == '') 
    {
      setMsgError('Por favor complete todos los campos para continuar.')
      presentToast()
      if(rpass == '')
      {
        setRpasswordError(true);
      }
      if(pass == '')
      {
        setPasswordError(true);
      }
      if(email == '')
      {
        setEmailError(true);
      }
      if(fecha == '')
      {
        setFechaError(true);
      }
      if(apellido == '')
      {
        setApellidoError(true);
      }
      if(nombre == '')
      {
        setNombreError(true);
      }
    }
    else if (pass != rpass)
    {
      setMsgError('Las contraseñas ingresadas no coinciden.')
      presentToast();
      setRpasswordError(true);
      setPasswordError(true);
    }
    else {
      setMsgError('Debes ser mayor de edad para continuar.')
      presentToast();
      setFechaError(true);
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
        <form className='form' onSubmit={RegistrarUsuario}>
          <div className='container con-input'>
          <IonText color={'primary'}>
            <h1>
              Registrarse
            </h1>
          </IonText>

          <IonItem className={`loginput ${nombreError ? 'error' : ''}`}>
            <IonLabel position="floating">Nombre <IonText color="danger">*</IonText></IonLabel>
            <IonInput type="text" onIonChange={(e) => setNombre(e.detail.value!)} />
          </IonItem>
          
          <IonItem className={`loginput ${apellidoError ? 'error' : ''}`}>
            <IonLabel position="floating">Apellido <IonText color="danger">*</IonText></IonLabel>
            <IonInput type="text" onIonChange={(e) => setApellido(e.detail.value!)} />
          </IonItem>

          <IonItem className={`loginput ${fechaError ? 'error' : ''}`}>
            <IonLabel position="floating">Fecha de Nacimiento <IonText color="danger">*</IonText></IonLabel>
            <IonInput id="date" value={formatDate(fecha)}>
              <IonPopover trigger='date'>
                <IonDatetime presentation="date" showDefaultButtons={true} onIonChange={handleFechaChange} ></IonDatetime>
              </IonPopover>
            </IonInput>
          </IonItem>

          <IonItem className={`loginput ${emailError ? 'error' : ''}`}>
            <IonLabel position="floating">Email <IonText color="danger">*</IonText></IonLabel>
            <IonInput type="email" onIonChange={(e) => setEmail(e.detail.value!)}/>
          </IonItem>

          <IonItem className={`loginput ${passwordError ? 'error' : ''}`}>
            <IonLabel position="floating">Contraseña <IonText color="danger">*</IonText></IonLabel>
            <IonInput type="password" onIonChange={(e) => setPass(e.detail.value!)}/>
          </IonItem>
          <IonItem className={`loginput ${rpasswordError ? 'error' : ''}`}>
            <IonLabel position="floating">Repetir contraseña <IonText color="danger">*</IonText></IonLabel>
            <IonInput type="password" onIonChange={(e) => setRpass(e.detail.value!)}/>
          </IonItem>
          </div>

          <div className="container con-bttn">
            <IonButton size="large" shape="round" routerDirection='root' expand='block' type='submit'>Registrarse</IonButton>
            <p>¿Ya tenés una cuenta? <a href="/login">Intentá logearte.</a></p>
          </div>  
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Register;