import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddNavigationBar from '../AdminNavBar/AdminNavBar';
import jsPDF from 'jspdf';
import './CreateEvent.css';
import NavigationBar from '../UserNavBar/UserNavBar';

const CreateEventForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'pending'
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      setSuccessMessage('Event created successfully');

      // Save form data to text file
      saveFormDataToFile();

      setFormData({
        name: '',
        description: '',
        status: 'pending'
      });
    } catch (error) {
      setErrorMessage('Error occurred: ' + error.message);
    }
  };

  const saveFormDataToFile = () => {
    // Get current date and time
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();
  
    // Create a new jsPDF instance
    const pdf = new jsPDF();
  
    // Construct data string in the specified format
    const data = `Receipt:\nOn Date: ${formattedDate},\nAt ${formattedTime}\nWe received your submitted event details for,\nName: ${formData.name}\nDescription: ${formData.description}\nAnd have been successfully added to the Database.`;
  
    // Add text to the PDF document
    pdf.text(data, 10, 10);
  
    // Save the PDF document
    pdf.save('UserReceipt.pdf');
  };
  
  

  return (
    <div>
      <AddNavigationBar />
      <div className="container">
        <div className="leave-form">
          <h2 style={{ color: 'white' }}>Event Form</h2>
          {successMessage && (
            <Alert variant="success">{successMessage}</Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter event name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control small-input"
                required
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter a description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control description"
                required
              />
            </Form.Group>
            <Button variant="primary" className="mt-3" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateEventForm;
