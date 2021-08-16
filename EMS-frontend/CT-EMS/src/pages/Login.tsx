import { IonContent, IonList, IonHeader, IonPage, IonTitle, IonToolbar, IonText, IonInput, IonButton, IonIcon, IonItem, IonLabel, IonSplitPane, IonMenu } from '@ionic/react';
import { star } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

import { Toast } from '../toast';
import { useHistory } from "react-router-dom";

var Token = "";

// Here we create a Typescript Interface
interface response {
    id?: string;
    role?: string;
    token: string;

}

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [result, setResult] = useState<any>([]);
    const history = useHistory();

    async function login(){
        let res = true;
        let form_data = new FormData();
        form_data.append("email",email);
        form_data.append("password",password);

        const response = await fetch("http://127.0.0.1:5000/api/login", {
            method : 'POST',
            body : form_data
        });

        const results = await response.json();
        console.log(response.status);

        if (response.status === 200){
            Toast('You have logged in!')
            history.push("/home");
        }else{
            console.log(results.errors[0])
            Toast(results.errors[0]);
        }
        // console.log(results);
        // console.log(`${res ? 'Login successful' : 'Logon failed'}`)
        // if(res){
        //     //Toast('You have logged in!')
        //     //history.push("/home");
        // }
    }

    return (
        <IonContent>
        <IonSplitPane contentId="main">
        <IonMenu contentId="main">
          <IonHeader>
            <IonToolbar>
              <IonTitle>Menu</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem routerLink="/home">Home</IonItem>
              <IonItem routerLink="/signup">Sign Up</IonItem>
            </IonList>
          </IonContent>
        </IonMenu>
        <IonPage id="main">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>
                        Login
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className ="ion-padding">
                <p>Please enter your login credentials:</p>
                <IonItem>
                <IonLabel>Email</IonLabel>
                <IonInput className ="ion-padding" value = {email} onIonChange = {(e:any) => setEmail(e.target.value)} id = "input" placeholder = "Enter email " ></IonInput>
                </IonItem>
                <IonItem>
                <IonLabel>Password</IonLabel>
                <IonInput className ="ion-padding" value = {password} onIonChange = {(e:any) => setPassword(e.target.value)} id = "input" placeholder = "Enter password " type = "password"></IonInput>
                </IonItem>

                {/* routerLink = "/home" */}
                <IonButton  expand = "full" color = "primary"  onClick = {login}> 
                    <IonIcon slot="start" icon={star} ></IonIcon>
                    Login</IonButton>

                <p>Not a member? Sign Up!</p>
                <IonButton color = "success" routerLink = "/signup">Signup</IonButton>

            </IonContent >
        </IonPage>
        </IonSplitPane>
    </IonContent>
    );

};

export default Login;

