import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Button,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';
import withReduxState, {
  reduxStateProps,
} from '../../components/HOC/withReduxState';
import PagedTable from '../../components/PagedTable';
import { columnMappings } from '../../components/SelectTable';
import { Recipe } from '../../models/Recipe';
import RecipeState from '../../redux/recipe/recipeState';
import CreateRecipeModal from './RecipeModal';

const RecipeIndex: React.FC<reduxStateProps<RecipeState>> = ({ state }) => {
  const [ searchText, setSearchText ] = useState<string>();
  const history = useHistory();
  const [ recipeModal, setRecipeModal ] = useState<boolean>(false);

  const products = Object.values(state.recipes).filter((p) =>
    searchText ? p.name.toLowerCase().includes(searchText.toLowerCase()) : true,
  );

  const handleClick = (p: Recipe) => history.push(`/recipes/view/${p.id}`);

  const map: columnMappings<Recipe> = {
    Name: (i) => i.name,
  };

  return (
    <>
      <Container>
        <Row className={'mb-5'}>
          <Col>
            <h1 className={'display-4 mb-0'}>Recipes</h1>
          </Col>
          <Col className={'mt-auto col-md-auto'}>
            <Button
              color={'primary'}
              className={'ml-auto'}
              onClick={() => setRecipeModal(true)}
            >
              Add New Recipe
            </Button>
          </Col>
        </Row>
        <Row>
          <Col sm={3} className={'ml-auto'}>
            <FormGroup>
              <Label>Search</Label>
              <div>
                <Input
                  type={'text'}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className={'mr-2'}
                />
              </div>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <PagedTable<Recipe>
            items={products}
            clickAction={handleClick}
            columnMappings={map}
          />
        </Row>
      </Container>
      <CreateRecipeModal modal={recipeModal} setModal={setRecipeModal}/>
    </>
  );
};
export default withReduxState<{}, RecipeState>(
  RecipeIndex,
  (state) => state.recipes,
);
