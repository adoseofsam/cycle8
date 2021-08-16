import { useIonViewWillEnter, IonRow, IonCol, IonCard, IonCardTitle, IonCardHeader, IonCardSubtitle, IonCardContent, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonImg, IonButtons, IonButton, IonIcon, IonSplitPane, IonMenuButton } from '@ionic/react';
import React, { useState } from 'react';
import './Home.css';

import { Link } from 'react-router-dom';
import { star } from 'ionicons/icons';
import { Toast } from '../toast';
import { useHistory } from "react-router-dom";
import { Menu } from '../components/Menu';

var Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSIsIm5hbWUiOiJKb2huIERvZSJ9.ei0eGg3aZqEoaQ7UOe6WvXodb6chhu6RnoS--fpfcMM";

// Here we create a Typescript Interface
interface Event {
    created_at: string;
    description: string;
    end_date: string;
    id: number;
    photo: string;
    start_date: string;
    status: string;
    title: string;
    uid: number;
    url: string;
    venue: string;
  }

const ReviewEvent: React.FC = () => {
    const [result, setResult] = useState<any>([]);
    const history = useHistory();
    let apiKey = Token;

    useIonViewWillEnter(() => {
        // console.log('ionViewDidEnter event fired');
        getData();
    
        // we will use async/await to fetch this data
        async function getData() {
          const response = await fetch("http://127.0.0.1:5000/api/events/pending", {
            headers: {
              "Authorization": `Bearer ${apiKey}`
            }
          });
    
          // 'Content-Type': 'application/json',
          //   'Accept': 'application/json'
          const results = await response.json();
          console.log(results);
          // store the results into our news state variable
          setResult(results.data.events);

        }
        // this is the cleanup function
        return () => {setResult([]);}
      }, []);

    async function publishEvent(id:number){
        const response = await fetch(`http://127.0.0.1:5000/api/events/publish/${id}`, {
          method : 'PUT',
            headers: {
              "Authorization": `Bearer ${apiKey}`
            }
        });

        const results = await response.json();
        console.log(response.status);
        if (response.status === 200){
          Toast('Event status updated!')
          history.push("/ReviewEvent");
      }else{
        console.log(results.errors[0])
        Toast(results.errors[0]);
    }

    }

    async function rejectEvent(id:number){
      const response = await fetch(`http://127.0.0.1:5000/api/events/reject/${id}`, {
        method : 'PUT',
          headers: {
            "Authorization": `Bearer ${apiKey}`
          }
      });

      const results = await response.json();
      console.log(response.status);
      if (response.status === 200){
        Toast('Event status updated!')
        history.push("/ReviewEvent");
    }else{
      console.log(results.errors[0])
      Toast(results.errors[0]);
  }

  }

  async function deleteEvent(id:number){
    const response = await fetch(`http://127.0.0.1:5000/api/events/${id}`, {
      method : 'DELETE',
        headers: {
          "Authorization": `Bearer ${apiKey}`
        }
    });

    const results = await response.json();
    console.log(response.status);
    if (response.status === 200){
      Toast('Event status updated!')
      history.push("/ReviewEvent");
  }else{
    console.log(results.errors[0])
    Toast(results.errors[0]);
}

}


  return (
    <IonContent>
    <IonSplitPane contentId="main">
    <Menu/>
    <IonPage id="main">
      <IonHeader>
        <IonToolbar>
        <IonButtons slot="end">
          <IonMenuButton></IonMenuButton>
        </IonButtons>
          <IonTitle>Review</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRow>
          {result.map((ev:Event, index:number)=>(
            <IonCol size="4" key={ index }>
              <IonCard>
              {/* <img src="{{ev.url || 'http://placehold.it/280x180?text=Placeholder+Image'}}" /> */}
              <img src={'http://placehold.it/280x180?text=Placeholder+Image'} />
              {/* <img src={ ev.url } alt="Image not found" (ionError) = "this.onerror=null;this.src='http://placehold.it/280x180?text=Placeholder+Image'; /> */}
              <IonCardHeader>
                <IonCardSubtitle>{ ev.status }</IonCardSubtitle>
                <IonCardTitle>{ ev.title }</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                { ev.description }
              </IonCardContent>
              <IonButtons>
              <IonButton color = "success" onClick = {() => publishEvent(ev.id)}>Publish</IonButton>
              <IonButton color = "warning" onClick = {() => rejectEvent(ev.id)}>Reject</IonButton>
              <IonButton color = "danger" onClick = {() => deleteEvent(ev.id)}>Delete</IonButton>
              </IonButtons>
            </IonCard>
            </IonCol>
          ))}
        </IonRow>
      </IonContent>
    </IonPage>
    </IonSplitPane>
    </IonContent>
  );
};

export default ReviewEvent;
