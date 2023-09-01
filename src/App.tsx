import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import Landing from './components/Landing';
import Login from './components/Login';
import Menu from './components/Menu';
import Register from './components/Register';
import Mascotas from './components/Mascotas'
import Chats from './components/Chats';
import Mascotas_CE from './components/Mascotas_CE'
import Chat_Personal from './components/Chat_Personal';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/landing">
            <Landing />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/menu">
            <Menu />
          </Route>
          <Route exact path="/mascotas">
            <Mascotas />
          </Route>
          <Route path="/Chats">
            <Chats />
          </Route>
          <Route exact path="/">
            <Redirect to="/landing"/>
          </Route>
          <Route path="/mascotas/create">
              <Mascotas_CE />
          </Route>
          <Route path='/Chats/chat'>
            <Chat_Personal />
          </Route>
        </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
