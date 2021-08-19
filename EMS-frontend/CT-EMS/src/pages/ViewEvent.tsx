import { IonBadge, IonButton, IonButtons, IonCard, IonCardSubtitle, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonPage, IonRow, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import { useParams } from 'react-router';
import { NavButtons } from '../components/NavButtons';

import './Home.css';




const ViewEvent: React.FC<any> = (props) => {

    const params = useParams();
    const n = params;
    console.log(n);
    return (
        <IonPage id="main">
        <IonHeader>
            <IonToolbar>
            <IonButtons slot="end">
            <NavButtons userInfo ={props.userInfo}/> {/*    <IonMenuButton></IonMenuButton> */}
            </IonButtons>
            <IonTitle>View Event</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
            {/* {params.event} */}
        </IonContent>
    </IonPage>

    );

};

export default ViewEvent;