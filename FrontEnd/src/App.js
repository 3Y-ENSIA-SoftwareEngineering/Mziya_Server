
import React from "react";
import Header from "../components/Header";
import MainContent from "../components/MainContent";
import Service from '../components/Service';
import WhyChooseUs from "../components/whychooseus";
import HowItWorks from "../components/HowItWorks";
import ContactUs from "../components/ContactUs";
import Footer from "../components/footer";
import "./App.css";

const App = () => (
  <div className="app">
    <Header />
    <MainContent />
    <Service />
    <WhyChooseUs />
    <HowItWorks />
    <ContactUs />
    <Footer />
  </div>
);

export default App;
