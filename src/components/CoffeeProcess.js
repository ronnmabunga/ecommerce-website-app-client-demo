import React from "react";
import { Container } from "react-bootstrap"; 

export default function CoffeeProcess() {
  return (
    <Container className="text-center mt-5">
      <h2 style={{color: "white",padding: "20px", margin:"40px 0"}}>Our Coffee Journey</h2>
      <img
        src={`${process.env.PUBLIC_URL}/images/Infographic.png`} 
        alt="Infographic of Coffee Journey"
        style={{ width: '100%', maxWidth: '700px', height: 'auto' }} 
      />
    </Container>
  );
};
