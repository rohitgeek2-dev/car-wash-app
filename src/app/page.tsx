"use client";
import { Icon, Leaf, Phone, Users } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "react-bootstrap";
import { motion } from "framer-motion";

function page() {
  const features = [
    {
      Icon: Leaf,
      title: "Eco-Friendly",
      description:
        "We use biodegradable cleaning agents that are safe for the environment and your vehicle's finish.",
      iconWrapperClass: "eco-icon",
    },
    {
      Icon: Users,
      title: "Expert Staff",
      description:
        "Our certified technicians are trained in the latest detailing techniques for a showroom-quality finish.",
      iconWrapperClass: "expert-icon",
    },
    {
      Icon: Phone,
      title: "Mobile Booking",
      description:
        "Our intuitive app lets you schedule, modify, or track your service in real-time.",
      iconWrapperClass: "tech-icon",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="hero">
        <div className="overlay">
          <div className="container hero-content">
            <motion.h1
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}  
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-5xl font-bold text-blue-800"
    >
              ShineRide – Premium Car Care{" "}
              <span className="highlight">Redefined</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}  
          transition={{ duration: 0.8, ease: "easeInOut" }} className="hero-desc text-5xl">
              Drive clean, feel great. ShineRide offers top-tier car wash and
              detailing services with easy online booking, expert staff, and a
              commitment to making your car shine — inside and out.
            </motion.p>
            <div className="cta-group">
              <Link href="/services" className="hero-btn btn-primary">
                Our Services
              </Link>
              <Link href="/services" className="hero-btn btn-secondary">
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */} 
      <div className="why-choose-us py-5">
        <div className="container">
          <div className="section-header d-flex flex-column">
            <span className="section-tagline">Our Advantages</span>
            <h2>Why Choose ShineRide?</h2>
            <p className="section-intro">
              With eco-friendly products, skilled professionals, and a passion
              for perfection, we ensure your vehicle receives the best care
              possible.
            </p>
          </div>

          <div className="features-grid">

            {features.map((feature, index) => {
              const Icon = feature.Icon;
              return (
              
              <div key={index} className="feature-card">
                <div className={`feature-icon ${feature.iconWrapperClass}`}>
                  <Icon size={30}></Icon>
                </div>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            );
          })}

          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section py-5">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Vehicles Cleaned</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Customer Satisfaction</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Online Support</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
