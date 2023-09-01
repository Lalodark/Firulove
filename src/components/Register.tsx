import React, {useState} from 'react';
import {useHistory} from 'react-router-dom'
import { IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonDatetime, IonButton,
IonPopover, IonText } from '@ionic/react';
import {auth, store} from '../firebase'
import { format } from 'date-fns';
import uniqid from 'uniqid';

const Register: React.FC = () => {
  // interface UserData {
  //   nombre: string,
  //   apellido: string,
  //   fecha: string
  //   email: string;
  //   pass: string;
  //   prevState: null
  // }
  const history = useHistory();
  const[nombre, setNombre] = useState<string>('')
  const[apellido, setApellido] = useState<string>('')
  const[fecha, setFecha] = useState<string>('')
  const[email, setEmail] = useState<string>('')
  const[pass, setPass] = useState<string>('')
  const[msgerror, setMsgError] = useState<string>('')

  const handleFechaChange = (e: CustomEvent) => {
    const selectedDate = e.detail.value; // Obtiene la fecha seleccionada
    setFecha(selectedDate); // Actualiza el estado fecha con la fecha seleccionada
  };

  const formatDate = (dateString:string) => {
    if(fecha){
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy');
    }
    return '';
  };

  const RegistrarUsuario = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try{
      await auth.createUserWithEmailAndPassword(email, pass)
      const usuario = {
        id:uniqid(),
        nombre:nombre,
        apellido:apellido,
        fecha:formatDate(fecha),
        email:email,
        activepet:''
      }
      try{
        const data = await store.collection('usuarios').add(usuario)
        history.push('/menu')
      }
      catch(e){
        console.log(e)
      }
    }
    catch(error:any){
      if(error.code == 'auth/invalid-email'){
        setMsgError('Formato de Email Inválido.')
      }
      if(error.code == 'auth/weak-password')
      {
        setMsgError('La contraseña debe tener 6 carácteres o más.')
      }
      if(error.code == 'auth/email-already-exists')
      {
        setMsgError('El Email ingresado ya se encuentra en uso.')
      }
    
    }
  }

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

          <IonItem className='loginput'>
            <IonLabel position="floating">Nombre</IonLabel>
            <IonInput type="text" onIonChange={(e) => setNombre(e.detail.value!)} />
          </IonItem>
          
          <IonItem className='loginput'>
            <IonLabel position="floating">Apellido</IonLabel>
            <IonInput type="text" onIonChange={(e) => setApellido(e.detail.value!)} />
          </IonItem>

          <IonItem className='loginput'>
            <IonLabel position="floating">Fecha de Nacimiento</IonLabel>
            <IonInput id="date" value={formatDate(fecha)}>
              <IonPopover trigger='date'>
                <IonDatetime presentation="date" showDefaultButtons={true} onIonChange={handleFechaChange} ></IonDatetime>
              </IonPopover>
            </IonInput>
          </IonItem> 
          <IonItem className='loginput'>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput type="email" onIonChange={(e) => setEmail(e.detail.value!)}/>
          </IonItem>

          <IonItem className='loginput'>
            <IonLabel position="floating">Password</IonLabel>
            <IonInput type="password" onIonChange={(e) => setPass(e.detail.value!)}/>
          </IonItem>
          </div>
          <div className="container con-bttn">
            <IonButton size="large" shape="round" routerDirection='root' expand='block' type='submit'>Login</IonButton>
            <p>¿Ya tenés una cuenta? <a href="/login">Intentá logearte.</a></p>
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

export default Register;