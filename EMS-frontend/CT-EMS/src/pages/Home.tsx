import { useIonViewWillEnter, IonRow, IonCol, IonCard, IonCardTitle, IonCardHeader, IonCardSubtitle, IonCardContent, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonImg, IonSplitPane, IonItem, IonMenu, IonButtons, IonMenuButton } from '@ionic/react';
import React, { useState } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

import { Link } from 'react-router-dom';
import { Menu } from '../components/Menu';

var Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSIsIm5hbWUiOiJKb2huIERvZSJ9.ei0eGg3aZqEoaQ7UOe6WvXodb6chhu6RnoS--fpfcMM";

// Here we create a Typescript Interface
interface Events {
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


// Api call

const Home: React.FC = () => {
  const [event, setEvent] = useState<any>([]); //useState<any>();
  let apiKey = Token; // Sign up on newsapi.org to get an API Key for this example

  useIonViewWillEnter(() => {
    // console.log('ionViewDidEnter event fired');
    getData();

    // we will use async/await to fetch this data
    async function getData() {
      console.log("here");
      const response = await fetch("http://127.0.0.1:5000/api/events/published", {
        headers: {
          "Authorization": `Bearer ${apiKey}`
        }
      });
      console.log("Here 2");

      // 'Content-Type': 'application/json',
      //   'Accept': 'application/json'
      const data = await response.json();
      console.log(data);
      // store the data into our news state variable
      setEvent(data.data.events);
      console.log(event);
    }
    // this is the cleanup function
    return () => {setEvent([]);}
  }, []);
  console.log(event);
  return (
    <IonContent>
    <IonSplitPane contentId="main">
    <Menu/>
    {/* <IonMenu contentId="main">
          <IonHeader>
            <IonToolbar>
              <IonTitle>Menu</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem routerLink="/home">Home</IonItem>
              <IonItem routerLink="/createEvent">Create Event</IonItem>
              <IonItem routerLink="/reviewEvent">Review Event</IonItem>
            </IonList>
          </IonContent>
        </IonMenu> */}
    <IonPage id="main">
      <IonHeader>
        <IonToolbar>
        <IonButtons slot="end">
            <IonMenuButton></IonMenuButton>
        </IonButtons>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRow>
          {event.map((ev:Events, index:number)=>(
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

export default Home;
  

