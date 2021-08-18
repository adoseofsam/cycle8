import { IonBackButton,IonCardTitle,IonCardHeader,IonCard,IonContent, IonList, IonHeader, IonPage, IonTitle, IonToolbar, IonText, IonInput, IonButton, IonIcon, IonItem, IonLabel, IonDatetime, IonSplitPane, IonButtons, IonMenuButton } from '@ionic/react';
import './Home.css';
import './CreateEvent.css'


import { Toast } from '../toast';
import { useHistory } from "react-router-dom";
import { useState } from 'react';
import { Menu } from '../components/Menu';
import { NavButtons } from '../components/NavButtons';

var Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSIsIm5hbWUiOiJKb2huIERvZSJ9.ei0eGg3aZqEoaQ7UOe6WvXodb6chhu6RnoS--fpfcMM";


interface response {
  Title: string;
  Description: string;
  StartDate: string;
  EndDate: string;
  Venue: string;
  Url:string;
  photo: File;


}



const CreateEvent: React.FC = () => {
  const [form, setForm] = useState<response>()
  const [Title, setTitle] = useState<string>("")
  const [Desc, setDesc] = useState<string>("")
  const [StartDate, setStartDate] = useState<string>("")
  const [EndDate, setEndDate] = useState<string>("")
  const [Venue, setVenue] = useState<string>("")
  const [Url, setUrl] = useState<string>("")
  const [Photo, setPhoto] = useState<File>()

  const history = useHistory();


  async function HandleSubmit(form:any){

    let form_data = new FormData();
    let apiKey = Token;
    

    //PLEASE VALIDATE FORM

    if(!Photo){
      console.log("no file");

    }else{
      console.log("file exist");
      console.log(Photo);
      console.log(Title);
      console.log(EndDate.split("T")[0]);
      console.log(Url);
      form_data.append("title", Title);
      form_data.append("start_date",StartDate.split("T")[0]);
      form_data.append("end_date", EndDate.split("T")[0]);
      form_data.append("description", Desc);
      form_data.append("venue",Venue);
      form_data.append("website_url", Url);
      form_data.append("photo",Photo);

      const response = await fetch("http://127.0.0.1:5000/api/events", {
            method : 'POST',
            body : form_data,
            headers: {
              "Authorization": `Bearer ${apiKey}`
            }
        });

        const results = await response.json();
        console.log(response.status);

        if (response.status === 200){
          Toast('Event Created Successful!')
          history.push("/home");
      }else{
          console.log(results.errors[0])
          Toast(results.errors[0]);
      }

    }
    //console.log(form);
  }
  return (
    // <IonContent>
    // <IonSplitPane contentId="main">
    // <Menu/>
    <IonPage id="main">
      <IonHeader>
        <IonToolbar>
        <IonButtons slot="end">
          <NavButtons/> {/* <IonMenuButton></IonMenuButton> */}
        </IonButtons>
          <IonTitle>Create Event</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
      <IonCard className ="create-card-center">
      
      <IonCardHeader >
            <IonCardTitle className ="createTitle">Add a New Event</IonCardTitle>
      </IonCardHeader>

        <IonItem>
          <IonLabel position="stacked">Title </IonLabel>
          <IonInput value={Title} placeholder="Title" onIonChange={(e:any) => setTitle(e.target.value)}></IonInput>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Description </IonLabel>
          <IonInput value={Desc} placeholder="Description" onIonChange={e => setDesc(e.detail.value!)}></IonInput>
        </IonItem>

        <IonItem>
            <IonLabel position="stacked">Start Date </IonLabel>
            <IonDatetime displayFormat="DDDD MMM D, YYYY" placeholder="Select Start Date" value={StartDate} onIonChange={e => setStartDate(e.detail.value!)}></IonDatetime>
        </IonItem>

        <IonItem>
            <IonLabel position="stacked">End Date </IonLabel>
            <IonDatetime displayFormat="DDDD MMM D, YYYY" placeholder="Select End Date" value={EndDate} onIonChange={e => setEndDate(e.detail.value!)}></IonDatetime>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Venue </IonLabel>
          <IonInput value={Venue} placeholder="Venue" onIonChange={e => setVenue(e.detail.value!)}></IonInput>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Website Url </IonLabel>
          <IonInput value={Url} placeholder="Event's Website URL" onIonChange={e => setUrl(e.detail.value!)}></IonInput>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Event Flyer </IonLabel>
          <input type = "file" onChange = {(e:any) => setPhoto(e.target.files[0])}/>
        </IonItem>

          <br></br>
          <IonButtons slot = "start">
            <IonBackButton />
          </IonButtons>
          <IonButton className="text-center" color="primary" onClick={ (e) => HandleSubmit(e) }>Submit Event</IonButton>
          </IonCard>
      </IonContent>
    </IonPage>
    // </IonSplitPane>
    // </IonContent>
  );
};

export default CreateEvent;
