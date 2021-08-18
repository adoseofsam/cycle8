import { IonContent, IonList, IonHeader, IonPage,
         IonTitle, IonToolbar, IonText, IonInput,
         IonButton,IonButtons, IonIcon, IonItem, IonLabel,IonBackButton,
         IonSplitPane, IonMenu ,IonGrid,IonRow,
         IonCol,IonFooter,IonCardTitle,IonRouterLink, IonAlert} from '@ionic/react';
import { arrowBack, shapesOutline } from "ionicons/icons";
         import React, { useState, useEffect } from 'react';
import './Login.scss';


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
    const [error, setErrors] = useState<string>();

    const history = useHistory();

    useIonViewWillEnter(() => {
        // console.log('ionViewDidEnter event fired');
        getData();
    
        // we will use async/await to fetch this data
        async function getData() {
          console.log("here");
          const response = await fetch("http://127.0.0.1:5000/api/logout", {
          });

          const data = await response.json();
          console.log(data);
          
        }
        
        
      }, []);

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
            setErrors(results.errors[0])
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

        <React.Fragment>
            { /** 
            <IonAlert 
            isOpen={!!error} 
            message={error}
            buttons={[{text:'Ok',handler: ()=> setErrors("")}]}
            />  
          */}
        <IonPage >
            <IonHeader>
            <IonToolbar>
                    <IonButtons slot="start" >
                        <IonButton className="custom-back" routerLink = "/home">
                            <IonIcon icon={ arrowBack } />
                        </IonButton>

                        


                    </IonButtons>
                    <IonButtons slot="end" className="signUpHeader">
                            <IonButton  routerLink="/home/">
                                Home
                            </IonButton>
                            <IonButton  routerLink="/signup/">
                                Sign Up
                            </IonButton>

                    </IonButtons>
				</IonToolbar>            
            </IonHeader>

            <IonContent  fullscreen className="ion-padding">
                     
                
                <IonGrid className="ion-padding">
                        <IonRow>
                            <IonCol>
                                <IonCardTitle>Log in</IonCardTitle>
                                <h5>Please enter your login credentials</h5>
                            </IonCol>
                        </IonRow>
                        <IonRow className="ion-margin-top ion-padding-top">
                            <IonCol size="12">
                            <div className="form-field">
                                    <IonLabel >Email </IonLabel>
                                    <IonInput  value = {email} className="customInput" onIonChange = {(e:any) => setEmail(e.target.value)} id = "input" placeholder = "joh.doe@example.com" ></IonInput>
                            </div>
                            <div className="form-field">
                                    <IonLabel >Password</IonLabel>
                                    <IonInput value = {password} className="customInput" onIonChange = {(e:any) => setPassword(e.target.value)} id = "input" placeholder = "**********" type = "password"></IonInput>
                            </div>

                                <IonButton className="custom-button" expand="block" onClick={ login }>Login</IonButton>
                            </IonCol>
                    </IonRow>
                    <IonRow className="ion-text-center ion-justify-content-center" id="toup">
                        <IonCol size="12">
                            <p>Don't have an account?
                             <IonRouterLink color = "success"  className="custom-link"  routerLink = "/signup" > Sign Up </IonRouterLink>
                            </p>
                        </IonCol>
                    </IonRow>
                    
                </IonGrid>
            </IonContent >
            <IonFooter  >
                <IonGrid>
                    <IonRow className="ion-text-center ion-justify-content-center">
                        <IonCol size="12">
                            <p>Don't have an account?
                             <IonRouterLink color = "success"  className="custom-link"  routerLink = "/signup" > Sign Up </IonRouterLink>
                            </p>
                        </IonCol>
                    </IonRow>
                </IonGrid>
                
            </IonFooter>
        </IonPage>
        </React.Fragment>

    );

};

export default Login;


/**
 * 
 * <IonSplitPane contentId="main">
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
                        </IonSplitPane>

        

 */