import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import empoweringIcon from "./images/empowering-icon.png";
import safetyIcon from "./images/safety-icon.png";
import appointmentsIcon from "./images/appointments-icon.png";
import affordableIcon from "./images/affordable-icon.png";
import fastServiceIcon from "./images/fast-service-icon.png";
import transparencyIcon from "./images/transparency-icon.png";
import background from "./images/background.png";
const items = [
  {
    icon: empoweringIcon,
    title: "Empowering Everyone",
    description:
      "MZYA opens the door for everyone to contribute, whether you're highly skilled, have some experience, or simply know how to get the job done. All that matters is your willingness and ability to help others!",
  },
  {
    icon: safetyIcon,
    title: "Your Safety Matters",
    description:
      "At MZYA, your safety comes first. With verified profiles and private communication, we provide a secure and trusted environment for both workers and clients.",
  },
  {
    icon: appointmentsIcon,
    title: "Flexible Appointments",
    description:
      "We offer convenient appointment times that can accommodate your busy schedule, day or night, 7 days a week.",
  },
  {
    icon: affordableIcon,
    title: "Affordable and Accessible Services",
    description:
      "With a wide range of workers to choose from, you can always find someone who fits your budget. Flexibility and quality are guaranteed.",
  },
  {
    icon: fastServiceIcon,
    title: "Fast 24-Hour Service",
    description:
      "Whether it's fixing a leaky faucet or helping with a move, MZYA connects you with reliable, local workers for your home services.",
  },
  {
    icon: transparencyIcon,
    title: "Trust Built on Transparency",
    description:
      "We believe in honesty and transparency. MZYA ensures you know exactly what to expect before making a decision.",
  },
];

export const WhyChooseUs = () => {
  return (
    <section className="bg-white w-100 vh-100 d-flex justify-content-center align-items-center p-3">
     <div 
  className="container" 
  style={{
    backgroundImage: `url(${background})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    width: '100vw',
    height: '82vh',
    borderRadius: '3%' 
  }}
>
<h2 
  className="text-start text-white fw-bold "
  style={{ 
    fontSize: '4vh',
    margin: '2vh 0 0 4vw' // top, right, bottom, left
  }}
>
  Why choose us?
</h2>
        
        <div className="row row-cols-1 row-cols-md-2 g-4 text-white">
          {items.map((item, index) => (
            <div className="col" key={index}>
              <div className="ms-3 text-start p-2">
                <div className="d-flex flex-wrap" style={{ gap: '5%' }}>
                  <img 
                    src={item.icon} 
                    alt={item.title} 
                    style={{ 
                      width: '6vw', 
                      height: '6vh',
                      marginBottom: '2vh'
                    }}
                  />
                  <h3 
                    className="fw-bold mb-2"
                    style={{ fontSize: '3vh' }}
                  >
                    {item.title}
                  </h3>
                </div>
                <p 
                  className="text-wrap pe-1" 
                  style={{ 
                    fontSize: '2.3vh',
                    lineHeight: 1.6,
                    color: '#ddd'
                  }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};