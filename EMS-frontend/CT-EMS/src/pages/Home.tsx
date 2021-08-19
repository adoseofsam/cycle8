import { IonToggle,useIonViewWillEnter, IonRow, IonCol, IonCard, IonCardTitle, IonCardHeader, IonCardSubtitle, IonCardContent, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonImg, IonSplitPane, IonItem, IonMenu, IonButtons, IonMenuButton, IonLabel, IonThumbnail, useIonRouter, IonGrid, IonSearchbar, IonFab, IonFabButton, IonIcon, IonAvatar, useIonViewDidEnter, IonRouterLink, IonModal, IonButton, IonDatetime } from '@ionic/react';
import React, { useRef, useState } from 'react';
import { moon } from "ionicons/icons";
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

import { Link } from 'react-router-dom';
import { Menu } from '../components/Menu';
import { NavButtons } from '../components/NavButtons';
import { add, arrowForwardCircle, search, searchSharp } from 'ionicons/icons';

import { Category, Filter, InfoSquare } from "react-iconly";
import NoEventsContainer from '../components/NoEventsContainer';
import ViewEvent from './ViewEvent';

var Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSIsIm5hbWUiOiJKb2huIERvZSJ9.ei0eGg3aZqEoaQ7UOe6WvXodb6chhu6RnoS--fpfcMM";
const img_url =  "http://127.0.0.1:5000/uploads/" // "http://0.0.0.0:5000/"
let url = "http://0.0.0.0:5000/" //http://127.0.0.1:5000/


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

type Item = {
  src: string;
  text: string;
};

const toggleDarkModeHandler = () => {
  document.body.classList.toggle("dark");
};

const items: Item[] = [{ src: 'http://placekitten.com/g/200/300', text: 'a picture of a cat' }];

// Api call
// style={{ width: '52px', height: '52px' }}

const Home: React.FC<any> = (props) => {

  const searchRef = useRef();


  const router = useIonRouter();
  const [event, setEvent] = useState<any>([]); //useState<any>();
  const [user, setUser] = useState<any>([]);
  const [curr_ev, setCurr_ev] = useState<any>([]);
  const [ results, setResults ] = useState<any>(event);
  const [showFilterModal, setshowFilterModal] = useState(false);
  const [showEventModal, setshowEventModal] = useState(false);
  const [queried, setQueried] = useState(false);

  let apiKey = Token; // Sign up on newsapi.org to get an API Key for this example


  const search = (e:any) => {

		const searchTerm = e.currentTarget.value;

		if (searchTerm !== "") {

			const searchTermLower = searchTerm.toLowerCase();
      // console.log(searchTermLower);

			const newResults = event.filter((e:any) => e.title.toLowerCase().includes(searchTermLower));
      // console.log(newResults);
			setResults(newResults);
		} else {

			setResults(event);
		}
	}


  useIonViewWillEnter(() => {
    // console.log('ionViewDidEnter event fired');
    getData();
    //getUserInfo();

    // we will use async/await to fetch this data
    async function getData() {
      // console.log("here");
      const response = await fetch("http://127.0.0.1:5000/api/events/published", {
        headers: {
          "Authorization": `Bearer ${apiKey}`
        }
      });
      // console.log("Here 2");

      // 'Content-Type': 'application/json',
      //   'Accept': 'application/json'
      const data = await response.json();
      // console.log(data);
      // store the data into our news state variable
      setEvent(data.data.events);
      
      // console.log(event);
      // console.log(event.length ? "true" : "false");
      

    }

    async function getUserInfo() {
      //attempt to get the login data
      let form_data = new FormData();
        form_data.append("email","Regular@example.com");
        form_data.append("password","Regularpassword");

      const Loginresponse = await fetch("http://127.0.0.1:5000/api/login", {
        method : 'POST',
        body : form_data
      });
      
      const Logindata = await Loginresponse.json();
      // console.log(Logindata);

      // console.log(Logindata.data? "True":"False");



      
    }
    
    // this is the cleanup function
    return () => {setEvent([]);}
  }, []);

  useIonViewDidEnter(() => {
    // console.log("entered")
    setResults(event)
  })
  // console.log(event);
  // console.log(event.length);
  // console.log(event.length ? "Yes" : "No");
  // console.log("queried - ",queried)
  // console.log(props.userInfo? props.userInfo.photo : "nope");

  const [StartDate, setStartDate] = useState<string>("")

  async function getEventByDate() {
    
    let date = StartDate.split("T")[0];


    // console.log("here");
    const response = await fetch(`http://127.0.0.1:5000/api/events/search/date/${date}`, {
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    });
    // console.log("Here 2");

    // 'Content-Type': 'application/json',
    //   'Accept': 'application/json'
    const data = await response.json();
    // console.log(data);
    // store the data into our news state variable
    setResults(data.data.events);
    
    // console.log(results);
    setQueried(true);
    // console.log(event.length ? "true" : "false");
  }

  function view(e:any){
    
    setshowEventModal(true);
    console.log("okay - ", e)
  }
  
  return (
    // <IonContent>
    // <IonSplitPane contentId="main">
    // <Menu/>
    // {/* <IonMenu contentId="main">
    //       <IonHeader>
    //         <IonToolbar>
    //           <IonTitle>Menu</IonTitle>
    //         </IonToolbar>
    //       </IonHeader>
    //       <IonContent>
    //         <IonList>
    //           <IonItem routerLink="/home">Home</IonItem>
    //           <IonItem routerLink="/createEvent">Create Event</IonItem>
    //           <IonItem routerLink="/reviewEvent">Review Event</IonItem>
    //         </IonList>
    //       </IonContent>
    //     </IonMenu> */}
    <IonPage >
      <IonHeader>
        <IonToolbar>
        <IonButtons slot="end">
          <NavButtons userInfo ={props.userInfo}/>{/* <IonMenuButton></IonMenuButton> */}
        </IonButtons>
          <IonTitle> {props.userInfo.role? `Home: ${props.userInfo.role}` : "Home"}</IonTitle>

          <IonButtons slot="start">
						{/* <div className="button-container-img">
							<img className = "profile_pic" src='http://placekitten.com/g/200/300' alt="avatar"  style={{ width: '32px', height: '32px' }}  /> 
						</div> */}
            <IonAvatar slot="start">
              {/* <img className = "profile_pic" src='http://placekitten.com/g/200/300' alt="avatar"    /> */}

              <img onError={(event:any)=> event.target.src = 'http://placehold.it/280x180?text=Placeholder+Image'} 
              src={ props.userInfo.photo? img_url + props.userInfo.photo : img_url +"pic.jpg"  }/> 
              {/* img_url +"pic.jpg" */}
            </IonAvatar>
					</IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
      <IonGrid>
      <IonList className="ion-margin-top">
          <IonItem class = "ion-hide-sm-down">
            <IonIcon slot="start" icon={moon} />
            <IonLabel>Dark Mode</IonLabel>
            <IonToggle
              slot="end"
              name="darkMode"
              onIonChange={toggleDarkModeHandler}
            />
          </IonItem>
        </IonList>
      <IonToolbar className="inner-toolbar">
						<IonRow className="ion-no-padding ion-no-margin" class = "ion-hide-sm-down">
							<IonCol size="9" >
								<h1 className="main-heading">Find the best event near you!</h1>
							</IonCol>
						</IonRow>
            <IonRow class = "ion-hide-sm-up">
            <div className = "center" >
              <h1 > Find the best event near you !</h1>
            </div>
            </IonRow>
					</IonToolbar>


					<IonRow className="search-container">
						<IonCol size="12">
            <IonSearchbar onIonChange={ e => search(e) } id="searchbar"  searchIcon={ searchSharp } placeholder="Search for Title" />
						</IonCol>
					</IonRow>

          <IonRow className="outer-heading ion-justify-content-between ion-align-items-center">
						<h4 className="heading">Upcoming Events !</h4>
						
						{/* <IonRouterLink color="main" routerLink="/coffees"> */}
							 <IonButtons onClick = { () => setshowFilterModal(true)}> <div >Filter Event By Date </div> <Filter/>   </IonButtons>  
						{/* </IonRouterLink> */}
					</IonRow>


        <IonRow>
          {results.length !== 0 ? results.map((ev:Events, index:number)=>(
            <IonCol size="4" key={ index }>
              <IonCard>
              {/* { ev.url ? <img src={ ev.url } alt="Image" /> : <img src="https://via.placeholder.com/150" alt="Image not Found" /> } */}
              {/* <img src="{{ev.url || 'http://placehold.it/280x180?text=Placeholder+Image'}}" /> */}
              {/* <IonImg src={ev.url} onIonError={ (e:any) => {<img src={'http://placehold.it/280x180?text=Placeholder+Image'} />} }></IonImg> */}
              <img onError={(event:any)=> results.target.src = 'http://placehold.it/280x180?text=Placeholder+Image'} 
              src={ img_url + ev.photo}/> 
              {/* <img src={'http://placehold.it/280x180?text=Placeholder+Image'} /> */}
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
          )) :  (event.length && !queried) ? event.map((ev:Events, index:number)=>(
            <IonCol size="3" key={ index }>
              <IonCard>
              {/* { ev.url ? <img src={ ev.url } alt="Image" /> : <img src="https://via.placeholder.com/150" alt="Image not Found" /> } */}
              {/* <img src="{{ev.url || 'http://placehold.it/280x180?text=Placeholder+Image'}}" /> */}
              {/* <IonImg src={ev.url} onIonError={ (e:any) => {<img src={'http://placehold.it/280x180?text=Placeholder+Image'} />} }></IonImg> */}
              <img onError={(event:any)=> event.target.src = 'http://placehold.it/280x180?text=Placeholder+Image'} 
              src={ img_url + ev.photo}/> 
              {/* <img src={'http://placehold.it/280x180?text=Placeholder+Image'} /> */}
              {/* <img src={ ev.url } alt="Image not found" (ionError) = "this.onerror=null;this.src='http://placehold.it/280x180?text=Placeholder+Image'; /> */}
              <IonCardHeader>
                <IonCardSubtitle>{ ev.status }</IonCardSubtitle>
                <IonCardTitle>{ ev.title }</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                { ev.description }
                <IonCol size="8">
                    <IonButton  onClick ={ () => {setCurr_ev(ev);setshowEventModal(true);}} >View &rarr;
                    {/* <ViewEvent userInfo = {props.userInfo} event = {ev} />  routerLink={ `/viewEvent/${ev.id}`}*/}
                    </IonButton>
                </IonCol>
              </IonCardContent>
            </IonCard>
            </IonCol>
          )) : <NoEventsContainer/>}
        </IonRow>
        </IonGrid>

         {/*-- fab placed to the bottom end --*/}
         <IonFab class = "ion-hide-sm-up" vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton>
            <IonIcon icon={add}  onClick={ () => router.push("/createEvent") }/>
          </IonFabButton>
        </IonFab>

        <IonModal
          isOpen={showFilterModal}
          onDidDismiss={() => {
            // results(getKids());
            setshowFilterModal(false);
          }}>
          {/* <searchByDate onClose={() => setShowAddKidModal(false)} /> */}
          
          <IonPage>
          
          <IonContent>
          <IonToolbar>
          <IonButtons slot ="end">
            <IonButton onClick = {() => setshowFilterModal(false)}>Close</IonButton>
          </IonButtons>
          </IonToolbar>
            {/* <p>Model body</p> */}
            <p>Filter for events that occurs on : <strong>{StartDate.split("T")[0]}</strong></p>
          
          <IonItem>
              <IonLabel>Date: MM DD YY</IonLabel>
              <IonDatetime displayFormat="DDDD MMM D, YYYY" placeholder="Select Start Date" value={StartDate} onIonChange={e => setStartDate(e.detail.value!)}></IonDatetime>
          </IonItem>

          <IonButton color="primary" onClick={ (e) => {getEventByDate(); setshowFilterModal(false)}}>Submit Event</IonButton>
          </IonContent>
          </IonPage>

        </IonModal>

        <IonModal
          isOpen={showEventModal}
          onDidDismiss={() => {
            // results(getKids());
            setshowEventModal(false);
          }}>
          {/* <searchByDate onClose={() => setShowAddKidModal(false)} /> */}
          
          <IonPage>
          <IonHeader collapse="condense" className="custom-margin-left animate__animated animate__fadeIn">
					
						
					
				</IonHeader>
          <IonContent className ="viewEvent">

          <IonToolbar>
          <IonButtons slot ="end">
            <IonButton onClick = {() => setshowFilterModal(false)}>Close</IonButton>
          </IonButtons>
          </IonToolbar>

          
          
          <IonRow >
							<IonCol size="9" >
								<h1 className="main-heading">{ curr_ev.title }</h1>
								{/* <IonCardSubtitle>{ curr_ev.description }</IonCardSubtitle> */}
							</IonCol>
						</IonRow>


            <IonRow className="search-container">
						<IonCol size="6">

							<IonCard className="coffee-card">
								<img src={img_url + curr_ev.photo } alt="coffee type" />
							</IonCard>
						</IonCol>

						
					</IonRow>

          <IonCol size="6" className="ion-margin-top ion-padding-top ion-padding-end">
								<IonCardSubtitle>Description</IonCardSubtitle>
								<p>{  curr_ev.description }</p>
								<InfoSquare set="bold"  />
						</IonCol>

          	<p>{  curr_ev.description }</p>
            <p>{  curr_ev.start_date }</p>
            <p>{  curr_ev.end_date }</p>
            <p>{  curr_ev.venue }</p>
            <p>{  curr_ev.url }</p>
            <p>{  curr_ev.status }</p>



          </IonContent>
          </IonPage>

        </IonModal>


        

      </IonContent>
    {/* <IonContent>
    <IonList>
      {items.map((image, i) => (
        <IonItem key={i}>
          <IonThumbnail slot="start">
            <IonImg src={image.src} />
          </IonThumbnail>
          <IonLabel>{image.text}</IonLabel>
        </IonItem>
      ))}
    </IonList>
  </IonContent> */}


    </IonPage>
    // {/* </IonSplitPane>
    // </IonContent> */}
  );
};

export default Home;
  

