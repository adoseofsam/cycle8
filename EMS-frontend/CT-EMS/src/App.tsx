import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Homepage from './pages/Home';
import Login from './pages/Login';
import ReviewEvent from './pages/ReviewEvent';
import CreateEvent from './pages/CreateEvent';
import SignUp from './pages/SignUp';

import Tabs from "./components/NavTabs";

import { Menu } from './components/Menu';

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
import { useState } from 'react';
import { Toast } from './toast';
import { useHistory } from "react-router";
import { withRouter } from 'react-router-dom';

interface user {
  id?: string;
  role?: string;
  photo: string;
  token: string;


}




const App: React.FC = () => {

  
  const [userInfo, setUserInfo] = useState<any>([]);
  
  // ------------- LOGIN FUNCTIONS -----------------
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setErrors] = useState<string>();
    
  const history = useHistory();

  //console.log("History - ",useHistory())
  
 const n = "Tesing";
  
  
  async function login(){

    
    let res = true;
    let form_data = new FormData();
    //let history = useHistory();
    
    form_data.append("email",email);
    form_data.append("password",password);
  
    const response = await fetch("http://127.0.0.1:5000/api/login", {
        method : 'POST',
        body : form_data
    });
  
    const results = await response.json();
    //console.log(response.status);
    //console.log(results);
    //console.log(history);

    if (response.status === 200){
        Toast('You have logged in successfully!')
        //console.log(useHistory());
        setUserInfo(results.data[0])
        // console.log("results",results.data[0].photo);
        history.push("/");
        //  window.history.pushState('/');

        //console.log(n);
    }else{
        setErrors(results.errors[0])
        console.log(results.errors[0])
  
        Toast(results.errors[0]);
    }
    // console.log(results);
    // console.log(`${res ? 'Login successful' : 'Logon failed'}`)
    if(res){
        //Toast('You have logged in!')
        //history.push("/home");
    }
  }
  return (
  <IonApp>
    {/* <IonReactRouter> */}
      <Menu userInfo ={userInfo}/>
      <IonRouterOutlet id = "main">
        <Route exact path="/home">
          <Homepage userInfo ={userInfo}/>
        </Route>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        {/* <Route path="/tabs" render={ () => <Tabs />} /> */}
        <Route exact path = "/login">
          <Login history = {history}loginUser = {login} setUserInfo = {setUserInfo} setEmail = {setEmail}  setPassword = {setPassword} email = {email} password = {password}/>
        </Route>
        <Route exact path = "/reviewEvent" component = {ReviewEvent}><ReviewEvent userInfo ={userInfo}/></Route>
        <Route exact path = "/createEvent" component = {CreateEvent}><CreateEvent userInfo ={userInfo}/></Route>
        <Route exact path = "/signup" component = {SignUp}></Route>
        
      </IonRouterOutlet>
      
    {/* </IonReactRouter> */}
  </IonApp>
  )
};

export default (App);
