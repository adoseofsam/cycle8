import { IonButtons,IonBackButton,IonCardTitle,IonCardSubtitle,IonCardHeader,IonCard,IonContent, IonList, IonHeader, IonPage, IonTitle, IonToolbar, IonText, IonInput, IonButton, IonIcon, IonItem, IonLabel, IonDatetime, IonMenu, IonSplitPane } from '@ionic/react';
import './Home.css';
import './Signup.css'
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
    <IonContent className = "signupPage">
      
    {/* <IonSplitPane contentId="main">
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
        </IonMenu> */}
        <IonPage id="main">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sign Up</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
      <IonCard className ="card-center">
      
        <IonCardHeader >
          {/* <IonCardSubtitle >ems</IonCardSubtitle> */}
              <IonCardTitle className ="signupTitle">Sign Up</IonCardTitle>
        </IonCardHeader>
        <IonButtons slot="start">
          <IonBackButton text="buttonText" icon="buttonIcon" />
        </IonButtons>
        <IonItem>
          <IonLabel>Full Name</IonLabel>
          <IonInput value={FullName} placeholder="Enter FullName" onIonChange={(e:any) => setFullName(e.target.value)}></IonInput>
        </IonItem>

        <IonItem>
          <IonLabel>Email</IonLabel>
          <IonInput value={Email} placeholder="Enter Email" onIonChange={e => setEmail(e.detail.value!)}></IonInput>
        </IonItem>

        <IonItem>
          <IonLabel>Profile Picture </IonLabel>
          <input type = "file" onChange = {(e:any) => setPhoto(e.target.files[0])}/>
        </IonItem>

        <IonItem>
          <IonLabel>Password</IonLabel>
          <input type = "password" placeholder="Enter Password" onChange = {(e) => setPassword(e.target.value)}/>
        </IonItem>

        <IonItem>
          <IonLabel>Re-Password</IonLabel>
          <input type = "password" placeholder="Confirm Password" onChange = {(e) => setConfirm(e.target.value)}/>
        </IonItem>


          <IonButton color="primary" onClick={ (e) => HandleSubmit(e) }>CREATE ACCOUNT</IonButton>
          <p>Already have an account?<Link to="/login">Login</Link></p>


          </IonCard>

      </IonContent>
    </IonPage>
    </IonContent>
  );
};

export default SignUp;
