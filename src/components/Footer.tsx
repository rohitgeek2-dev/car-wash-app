'use client';

import { Container } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer className="bg-light text-center text-muted py-4 mt-5 border-top">
      <Container>
        <p className="mb-1">© {new Date().getFullYear()} ShineRide.</p>
        <p className="mb-0">
          Developed by <a href="#" className="text-decoration-none text-muted"> -- Rohit Kumar</a>
        </p>
      </Container>
    </footer>
  );
}
