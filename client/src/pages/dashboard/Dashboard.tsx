import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, Container, Row, Table } from 'reactstrap';


const Dashboard: React.FC = () => (
  <Container>
    <Row>
      <h1 className={'display-4'}>Dashboard</h1>
    </Row>
    <Row className={'mt-4'}>
      <h2>Recipes <span className={'ml-3 text-primary'}>23</span></h2>
    </Row>
    <Row className={'mt-2'}>
      <Button color={'primary'}>View all Recipes</Button>
      <Button color={'primary'} outline className={'ml-4'}>Add new Recipe</Button>
    </Row>
    <Row className={'mt-2'}>
      <Card className={'w-100'}>
        <CardBody>
          <Table className={'mb-0'}>
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </Row>
    <Row className={'mt-5'}>
      <h2>Products <span className={'ml-3 text-primary'}>304</span></h2>
    </Row>
    <Row className={'mt-2'}>
      <Link to={'/products'}><Button color={'primary'}>View all Products</Button></Link>
      <Button color={'primary'} outline className={'ml-4'}>Add new Product</Button>
    </Row>
    <Row className={'mt-2'}>
      <Card className={'w-100'}>
        <CardBody>
          <Table className={'mb-0'}>
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </Row>
  </Container>
);

export default Dashboard;