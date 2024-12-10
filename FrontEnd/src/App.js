import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './screens/Login.jsx';
import { SignUp } from './Components/SignUpScreen.jsx';
import { FindJob } from './screens/FindJob.jsx';
import { Header } from './Components/Header.jsx';
import { MainContent } from './Components/MainContent.jsx';
import { Service } from './Components/Service.jsx';
import { WhyChooseUs } from './Components/whychooseus.jsx';
import { HowItWorks } from './Components/HowItWorks.jsx';
import { ContactUs } from './Components/ContactUs.jsx';
import { Footer } from './Components/Footer.jsx';
import { Navbar } from './Components/NavBar.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Common Header */}
        <Navbar />

        {/* Define routes for different screens */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <MainContent />
                <Service />
                <WhyChooseUs />
                <HowItWorks />
                <ContactUs />
                <Footer />
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/findjob" element={<FindJob />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

