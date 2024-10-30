import React from 'react';
import { Container } from 'react-bootstrap';

export default function CustomerFeedback() {
  return (
    <Container className="text-center mt-5">
      <h2 className="text-white py-3 my-4">
      What Our Customers Say
      </h2>
            <img
              src={`${process.env.PUBLIC_URL}/images/Feedback.png`}
              alt="Customer Feedback"
              style={{
                display: 'block',
                margin: 'auto',
                padding: '20px',
                width: '100%', 
                maxWidth: '1000px', 
                height: 'auto',
                borderRadius: '20px',
              }}
            />
    </Container>
  );
}