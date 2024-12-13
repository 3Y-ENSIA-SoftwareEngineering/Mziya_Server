import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './screens/Login.jsx';
import { SignUp } from './Components/SignUpPage.jsx';
import { FindJob } from './screens/FindJob.jsx';
import { Header } from './Components/Header.jsx';
import { MainContent } from './Components/MainContent.jsx';
import { Service } from './Components/Service.jsx';
import { WhyChooseUs } from './Components/whychooseus.jsx';
import { HowItWorks } from './Components/HowItWorks.jsx';
import { ContactUs } from './Components/ContactUs.jsx';
import { FooterUp } from './Components/FooterUp.jsx';
import { FooterDown } from './Components/FooterDown.jsx';
import { PostingPage } from './Components/PostingPage.jsx';
import { Profile } from './Components/profile.jsx';
import { CheckEmail } from './screens/check_email.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Common Header */}
        

        {/* Define routes for different screens */}
        <Routes>
          <Route
            path="/"
            element={
              <>
              <Header/>
                <MainContent />
                <Service />
                <WhyChooseUs />
                <HowItWorks />
                <ContactUs />
                <FooterUp />
                <FooterDown/>
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/findjob" element={<FindJob />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/makepost" element={<PostingPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/check_email" element={<CheckEmail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

