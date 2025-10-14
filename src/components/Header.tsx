'use client';

import Link from 'next/link';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import './header.css'; // make sure this path is correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Menu } from 'lucide-react';

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Navbar
      bg="light"
      expand="lg"
      className={`main-header shadow-sm transition-navbar ${isSticky ? 'sticky-navbar' : ''}`}
    >
      <Container>
        <Navbar.Brand as={Link} href="/">ShineRide</Navbar.Brand>
        <Navbar.Toggle as="div" aria-controls="main-navbar">
          <button className="custom-hamburger-btn">
            <Menu size={24} />
          </button> 
        </Navbar.Toggle>
        {/* Hamburger Toggle */}
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto">
            <Nav.Link as={Link} href="/">Home</Nav.Link>
            <Nav.Link as={Link} href="/about">About</Nav.Link>
            <Nav.Link as={Link} href="/services">Services</Nav.Link>
            <Nav.Link as={Link} href="/contact">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
