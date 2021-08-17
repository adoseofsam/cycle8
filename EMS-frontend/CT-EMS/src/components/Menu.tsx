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

} from "@ionic/react";

import React from "react";

export const Menu =()=> {
    return (
        <IonMenu side = "end" contentId = "main">
            <IonHeader>
                <IonToolbar>
                   <IonTitle> Menu </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
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

                    <IonMenuToggle auto-hide="false">
                        <IonItem button routerLink = {"/reviewEvent"} routerDirection="none">
                            <IonLabel>Review Event</IonLabel>
                        </IonItem>
                    </IonMenuToggle>

                    <IonMenuToggle auto-hide="false">
                        <IonItem button routerLink = {"/login"} routerDirection="none">
                            <IonLabel>Logout</IonLabel>
                        </IonItem>
                    </IonMenuToggle>
                </IonList>
            </IonContent>
        </IonMenu>
    )
};