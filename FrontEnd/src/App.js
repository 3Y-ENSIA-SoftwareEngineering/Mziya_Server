import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './screens/Login.jsx';
import { SignUp } from './Components/SignUpScreen.jsx';
import { FindJob } from './screens/FindJob.jsx';

function App() {
  return (
    <Router>
      <div className="App">
      <Header />
    <MainContent />
    <Service />
    <WhyChooseUs />
    <HowItWorks />
    <ContactUs />
    <Footer />
        {/* Define routes for different screens */}
        <Routes>
          <Route path="/" element={<FindJob />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          {/* <Route path="/findjob" element={<FindJob />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

