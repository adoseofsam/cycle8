import React from "react";
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs, IonRouterOutlet } from "@ionic/react";
import { Redirect, Route } from "react-router-dom";

import { Home, Bag, Heart2, Notification } from "react-iconly";
import Homepage from '../pages/Home';

const Tabs = (props:any) => {

	return (
		<IonTabs>
			<IonRouterOutlet>
                {/* <Route exact path="/tabs/home" render={ (props) => <Homepage{ ...props } /> } /> */}
                {/* <Route exact path="/tabs/cart" render={ (props) => <Cart { ...props } /> } />
                <Route exact path="/tabs/favourites" render={ (props) => <Favourites { ...props } /> } /> */}
			</IonRouterOutlet>

			<IonTabBar slot="bottom">
                
                <IonTabButton tab="tab1" href="/home">
                    <Home set="bold" />
                </IonTabButton>
                
                <IonTabButton tab="tab2" href= "/createEvent">
                    <Bag set="bold" />
                </IonTabButton>
                
                <IonTabButton tab="tab3" href="/home">
                    <Heart2 set="bold" />
                </IonTabButton>
			</IonTabBar>
		</IonTabs>
	);
}

export default Tabs;