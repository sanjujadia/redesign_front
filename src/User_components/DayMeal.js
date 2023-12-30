import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';

export default function DayMeal({data}) {
  return (
    <div className='d-flex justify-content-between flex-column border rounded'>
        <h5 className='bg-grey p-2 text-black'>{data.category}</h5>
        <div className='h-100 p-2'>
        {data.ingredients.map((list) => (
          <Row className="mb-2">
              <Col lg={6}>
                <Form.Group controlId="formBasicCheckbox2">
                  <Form.Check type="checkbox" className="fw-normal fs-6 text-black" label={list?.quantity+' '+list?.measure} />
                </Form.Group>
              </Col>
              <Col lg={6}>
              <p className="fw-normal fs-6 text-black">{list?.food}</p>
              </Col>
            </Row>
        

        ))}
              
            {/* <Row className="mb-2">
              <Col lg={6}>
                <Form.Group controlId="formBasicCheckbox2">
                  <Form.Check type="checkbox" className="fw-normal fs-6 text-black" label="Lunch" />
                </Form.Group>
              </Col>
              <Col lg={6}>
              <p className="fw-normal fs-6 text-black"> Snack 2</p>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col lg={6}>
                <Form.Group controlId="formBasicCheckbox4">
                  <Form.Check type="checkbox" className="fw-normal fs-6 text-black" label="Dinner" />
                </Form.Group>
              </Col>
              <Col lg={4}>
              <p className="fw-normal fs-6 text-black"> Snack 3</p>
              </Col>
            </Row> */}
           
        </div>
        <Button className='bg-green custom-shadow text-white d-block rounded border-0 w-100'>Add/Remove Item</Button>
    </div>
  )
}
