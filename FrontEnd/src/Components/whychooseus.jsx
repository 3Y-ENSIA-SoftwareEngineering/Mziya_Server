import React from "react";
import "./../CSSFiles/whychooseus.css";
import empoweringIcon from "./images/empowering-icon.png";
import safetyIcon from "./images/safety-icon.png";
import appointmentsIcon from "./images/appointments-icon.png";
import affordableIcon from "./images/affordable-icon.png";
import fastServiceIcon from "./images/fast-service-icon.png";
import transparencyIcon from "./images/transparency-icon.png";

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
    <section className="why-choose-us">
      <div className="container">
        <h2 className="why-title">Why choose us?</h2>
        <div className="why-items">
          {items.map((item, index) => (
            <div className="why-item" key={index}>
              <div className="why-item-title-photo">
                <img src={item.icon} alt={item.title} className="why-icon" />
                <h3 className="why-item-title">{item.title}</h3>
              </div>

              <p className="why-item-description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
