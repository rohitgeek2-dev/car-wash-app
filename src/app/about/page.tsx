// src/app/about/page.tsx
"use client";

import React, { useState } from "react";
import './about.css';

export default function AboutPage() {
  const [formData, setFormData] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    companyone: "",
    companytwo: "",
    companythree: "",
    companyfour: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("Form submitted successfully!");
        setFormData({
          firstname: "",
          middlename: "",
          lastname: "",
          email: "",
          companyone: "",
          companytwo: "",
          companythree: "",
          companyfour: "",
        });
      } else {
        setStatus("Error submitting form");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error connecting to server");
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="hero">
        <div className="overlay">
          <div className="container hero-content">
            <h1>About ShineRide</h1>
            <p className="hero-desc">
              Transforming vehicle care with premium services and unmatched expertise
            </p>
          </div>
        </div>
      </div>

      {/* About Content Section */}
      <div className="about-section py-5">
        <div className="container">
          <div className="section-header d-flex flex-column text-center mb-5">
            <span className="section-tagline">Who We Are</span>
            <h2>Our Story</h2>
            <p className="section-intro">
              At ShineRide, we're passionate about keeping your vehicle in pristine condition. 
              With years of experience and cutting-edge technology, we deliver exceptional 
              results that make your ride shine.
            </p>
          </div>

          {/* Features Grid */}
    
          {/* Contact Form Section */}
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="form-section p-4">
                <div className="text-center mb-4">
                  <h3>Get In Touch</h3>
                  <p>Interested in our services? Fill out the form below and we'll get back to you soon.</p>
                </div>

                <form onSubmit={handleSubmit} className="about-form">
                  <div className="name-fields">
                    <input
                      type="text"
                      name="firstname"
                      placeholder="First Name"
                      className="form-control firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="text"
                      name="middlename"
                      placeholder="Middle Name"
                      className="form-control mname"
                      value={formData.middlename}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="text"
                      name="lastname"
                      placeholder="Last Name"
                      className="form-control lname"
                      value={formData.lastname}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    className="form-control email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  
                  <div className="company-fields">
                    <input
                      type="text"
                      name="companyone"
                      placeholder="Company Name"
                      className="form-control company"
                      value={formData.companyone}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="text"
                      name="companytwo"
                      placeholder="Company Name"
                      className="form-control company"
                      value={formData.companytwo}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="text"
                      name="companythree"
                      placeholder="Company Name"
                      className="form-control company"
                      value={formData.companythree}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="text"
                      name="companyfour"
                      placeholder="Company Name"
                      className="form-control company"
                      value={formData.companyfour}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary submit-btn">
                    Send Message
                  </button>
                </form>

                {status && (
                  <div className={`status-message mt-3 text-center ${
                    status.includes("successfully") ? "text-success" : "text-danger"
                  }`}>
                    {status}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}