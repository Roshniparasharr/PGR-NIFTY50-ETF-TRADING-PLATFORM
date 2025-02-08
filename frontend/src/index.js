import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import './assets/styles/index.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";
import "assets/styles/index.css";
// Layouts
import Admin from "./layouts/Admin";
import Auth from "./layouts/Auth.js";
import { Link } from "react-router-dom";

// Views without layouts
import Profile from "./views/user/Profile.js";
import Index from "./views/user/Index.js";
import AboutHero from "components/User/About/AboutHero.js";
import ContactPage from "components/User/Contact/ContactPage";
import ServicesPage from "components/User/Service/ServicesPage";
import CompanyDetailsPage from "./views/admin/CompanyDetail.js";
// Use ReactDOM.render instead of createRoot (since React 17 is likely being used)
ReactDOM.render(
  <BrowserRouter>
    <Switch>
      {/* Routes with layouts */}
      <Route path="/admin" component={Admin} />
      <Route path="/auth" component={Auth} />

      {/* Routes without layouts */}
      <Route path="/profile" exact component={Profile} />
      <Route path="/" exact component={Index} />
      <Route path="/about" exact component={AboutHero} />
      <Route path="/contact" exact component={ContactPage} />
      <Route path="/services" exact component={ServicesPage} />


      {/* Route for company details page */}
      <Route path="/company/:symbol" component={CompanyDetailsPage} />
      {/* Redirect for unknown routes */}
      <Redirect from="*" to="/" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);