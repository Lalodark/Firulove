import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom'
import { IonContent, IonLabel, IonButton, IonItem, IonHeader, IonToolbar, IonRange, IonSelect, IonSelectOption,
IonButtons,IonTitle, IonInput } from '@ionic/react';
import {auth, store} from '../firebase'
import { navigate } from 'ionicons/icons';

const Perfil: React.FC<{ datosUsuario: any; onClose: () => void }> = ({
  datosUsuario,
  onClose,
}) => {
  const { nombre, apellido, email } = datosUsuario;
  const history = useHistory();
  
  const CerrarSesion = () =>{
    auth.signOut();
    history.push('/landing');
    onClose();
}

  return (
          <IonContent className="ion-padding">
            <IonItem>
                <IonInput labelPlacement="stacked" label="Nombre" value={nombre} readonly={true}></IonInput>
            </IonItem>
            <IonItem>
                <IonInput labelPlacement="stacked" label="Apellido" value={apellido} readonly={true}></IonInput>
            </IonItem>
            <IonItem>
                <IonInput labelPlacement="stacked" label="Email" value={email} readonly={true}></IonInput>
            </IonItem>
            <IonButton expand="block" onClick={CerrarSesion}>Cerrar Sesión</IonButton>
          </IonContent>
  );
};

export default Perfil;
