import { IonRow,IonGrid,IonImg,IonButtons,IonBackButton,IonCardTitle,IonCardSubtitle,IonCardHeader,IonCard,IonContent, IonList, IonHeader, IonPage, IonTitle, IonToolbar, IonText, IonInput, IonButton, IonIcon, IonItem, IonLabel, IonDatetime, IonMenu, IonSplitPane, IonCol, IonCardContent } from '@ionic/react';
import './Home.css';
import './Signup.css';
import eventPhoto from '../imgs/event.jpg';

import { Toast } from '../toast';
// import { Link } from 'react-router-dom';
import { useHistory,Link } from "react-router-dom";
import { useState } from 'react';


const SignUp: React.FC = () => {
  const [FullName, setFullName] = useState<string>("")
  const [Email, setEmail] = useState<string>("")
  const [Password, setPassword] = useState<string>("")
  const [Confirm, setConfirm] = useState<string>("")
  const [Role, setRole] = useState<string>("")
  const [Photo, setPhoto] = useState<any>()
  const history = useHistory();
  
  


  async function HandleSubmit(form:any){

    let form_data = new FormData();



    //PLEASE VALIDATE FORM

    if(!Photo && (Password !== Confirm)){
      console.log("no file");

    }else{
      console.log("file exist");
      console.log(Password);
      form_data.append("Fullname", FullName);
      form_data.append("email", Email);
      form_data.append("password",Password);
      form_data.append("role", "Regular");

      form_data.append("Profile_Photo",Photo);

      const response = await fetch("http://127.0.0.1:5000/api/signup", {
            method : 'POST',
            body : form_data,
        });

        const results = await response.json();
        console.log(response.status);

        if (response.status === 200){
          Toast('Event Created Successful!')
          history.push("/login");
      }else{
          console.log(results.errors[0])
          Toast(results.errors[0]);
      }

    }
    //console.log(form);
  }


  return (
    <IonContent fullscreen className = "signupPage">
        <IonPage className="signupMain">
      <IonHeader>
        <IonToolbar>
          <IonTitle className="signupMain">Sign Up</IonTitle>
          <IonButtons slot="end" className="signUpHeader"  >
              <IonButton  routerLink="/login">
                  Home
              </IonButton>
          </IonButtons>
        </IonToolbar>

      </IonHeader>
      <IonContent>
      
      <IonCard className= "signupCard">
        <IonGrid>
          <IonRow>
            <IonCol class="ion-hide-sm-down">
            <img className="photo" src={eventPhoto} alt="Event" />
            </IonCol>

        <IonCol>
        <IonCardHeader >
              <IonCardTitle className ="signupTitle">Let's Get Started</IonCardTitle>
        </IonCardHeader> 
        <IonCardContent className="cardContent">

        <IonItem>
          <IonLabel className ="signupLabel" position="stacked">Full Name </IonLabel>
          <IonInput value={FullName} placeholder="Jane Doe" onIonChange={(e:any) => setFullName(e.target.value)}></IonInput>
        </IonItem>

        <IonItem>
          <IonLabel className="signupLabel" position="stacked">Email</IonLabel>
          <IonInput value={Email} placeholder="sample@example.com" onIonChange={e => setEmail(e.detail.value!)}></IonInput>
        </IonItem>

        <IonItem>
          <IonLabel className="signupLabel" position="stacked">Password</IonLabel>
          <IonInput value = {Password} onIonChange = {(e:any) => setPassword(e.target.value)} id = "input" placeholder = "**********" type = "password"></IonInput> 

        </IonItem>

        <IonItem>
          <IonLabel className="signupLabel" position="stacked">ConfirmPassword</IonLabel>
          <IonInput value = {ConfirmPassword} onIonChange = {(e:any) => setPassword(e.target.value)} id = "input" placeholder = "**********" type = "password"></IonInput>
          </IonItem>


        <IonItem>
          <IonLabel className="signupLabel" position="stacked">Profile Picture </IonLabel>
          <input type = "file" onChange = {(e:any) => setPhoto(e.target.files[0])}/>
        </IonItem>
          <br></br>
          <IonButton color="warning" className="submitBtn"onClick={ (e) => HandleSubmit(e) }>CREATE ACCOUNT</IonButton>
          <br></br>
          <p>Already have an account?<Link to="/login">Login</Link></p> 


          </IonCardContent>
          </IonCol>
          </IonRow>
          </IonGrid>
      </IonCard>
    
          

      </IonContent>
    </IonPage>
    </IonContent>
  );
};

export default SignUp;
