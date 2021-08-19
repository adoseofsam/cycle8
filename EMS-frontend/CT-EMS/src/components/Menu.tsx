import {
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonMenuToggle,
    IonItem,
    IonLabel,
    IonButtons,
    IonMenuButton,
    IonIcon,
    IonToggle,

} from "@ionic/react";
import { moon } from "ionicons/icons";

import React, {useState} from "react";
import Tabs from "./NavTabs";

const toggleDarkModeHandler = () => {
    document.body.classList.toggle("dark");
  };


export const Menu =(props:any)=> {
    const [show, setShow] = useState<boolean>(props.userInfo.role == 'Admin' ? false : true);
    console.log(props.userInfo.role);
    console.log(props.userInfo.role === 'Admin');
    console.log("show - ",show);
    return (
        <>
        {/* {props.userInfo? setShow(true) : setShow(false)} */}
        <IonMenu side = "end" contentId = "main">
            <IonHeader>
                <IonToolbar>
                   <IonTitle> Menu </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
            <IonList className="ion-margin-top">
                <IonItem>
                    <IonIcon slot="start" icon={moon} />
                    <IonLabel>Dark Mode</IonLabel>
                    <IonToggle
                    slot="end"
                    name="darkMode"
                    onIonChange={toggleDarkModeHandler}
                    />
                </IonItem>
                </IonList>
                <IonList>
                    <IonMenuToggle auto-hide="false">
                        <IonItem button routerLink = {"/Home"} routerDirection="none">
                            <IonLabel>Home</IonLabel>
                        </IonItem>
                    </IonMenuToggle>

                    <IonMenuToggle auto-hide="false">
                        <IonItem button routerLink = {"/createEvent"} routerDirection="none">
                            <IonLabel>Create Event</IonLabel>
                        </IonItem>
                    </IonMenuToggle>

                   { show && props.userInfo.role === 'Admin'?
                        // props.userInfo.role? === "Admin"{

                    <IonMenuToggle  auto-hide="false">
                        <IonItem button routerLink = {"/reviewEvent"} routerDirection="none">
                            <IonLabel>Review Event</IonLabel>
                        </IonItem>
                    </IonMenuToggle>
                        

                     : ""}

                    <IonMenuToggle auto-hide="false">
                        <IonItem button routerLink = {"/login"} routerDirection="none">
                            <IonLabel>Logout</IonLabel>
                        </IonItem>
                    </IonMenuToggle>
                </IonList>
            </IonContent>
        </IonMenu>
        
        </>
    )
};


