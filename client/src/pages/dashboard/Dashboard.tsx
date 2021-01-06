import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Alert, Button, Card, CardBody, Col, Container, Row, Table } from 'reactstrap';
import { ApiClient } from '../../api/client';
import useUserData from '../../hooks/useUserData';
import { RootState } from '../../redux/store';
import CreateRecipeModal from '../recipe/RecipeModal';


const Dashboard: React.FC = () => {
  
  const [ recipeModal, setRecipeModal ] = useState<boolean>(false);
  const fetchData = useUserData();

  const selectorFunction = (state: RootState) => state;

  const state = useSelector(selectorFunction);

  return(
    <>
      <Container>
        <Row>
          <h1 className={'display-4'}>Dashboard</h1>
        </Row>
        {process.env.NODE_ENV === 'development' && <>
          <hr/>
          <h2>
          Dev tools
          </h2>
          
          <Button onClick={async () => {
            await ApiClient.seedDB();
            fetchData();
          }}
          color={'success'}
          >Seed database</Button>
          <br/>
          <span>Recipes: {state.recipes.count}</span><br/>
          <span>Products: {state.products.count}</span><br/>
          <span>Units: {state.units.count}</span><br/>
          <span>Authentication Token:</span><br/>
          <Alert color="dark" fade={false}>{state.auth.token}</Alert>
          <hr/>
        </>}
        <Row className={'mt-4'}>
          <h2>Recipes <span className={'ml-3 text-primary'}>23</span></h2>
        </Row>
        <Row className={'mt-2'}>
          <Link to={'/recipes'}>
            <Button color={'primary'}>View all Recipes</Button>
          </Link>
          <Button color={'primary'} onClick={() => setRecipeModal(true)} outline className={'ml-4'}>Add new Recipe</Button>
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
          <Link to={'/products'}>
            <Button color={'primary'}>View all Products</Button>
          </Link>
          <Link to={'/products/new'}>
            <Button color={'primary'} outline className={'ml-4'}>Add new Product</Button>
          </Link>
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
      <CreateRecipeModal modal={recipeModal} setModal={setRecipeModal}/>
    </>
  );
};

export default Dashboard;