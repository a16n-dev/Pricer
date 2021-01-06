import React, { useState } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import ContainedContainer from '../../../components/ContainedContainer';
import Dot from '../../../components/Dot';
import withReduxState, { reduxStateProps } from '../../../components/HOC/withReduxState';
import ScrollContainer from '../../../components/ScrollContainer';
import SelectTable, { columnMappings } from '../../../components/SelectTable';
import { Product } from '../../../models/Product';
import { Recipe, RecipeItemDetail } from '../../../models/Recipe';
import { Unit } from '../../../models/Unit';
import LoadingPage from '../../common/LoadingPage';
import AddIngredientsModal from './AddIngredientsModal';
import RecipeAnalysisBox from './RecipeAnalysisBox';
import RecipeDetailForm from './RecipeDetailForm';

interface stateProps {
  units: {[key: string]: Unit}
  products: {[key: string]: Product}
  recipe: Recipe
  isHydrated: boolean
}

interface urlParams {
  id: string;
}

const RecipeDetail: React.FC<reduxStateProps<stateProps>> = ({state}) => {
  
  const {units, products, recipe} = state;

  const [ selected, setSelected ] = useState<RecipeItemDetail>();
  const [ modal, setModal ] = useState<boolean>(false);

  const tableMappings: columnMappings<RecipeItemDetail> = {
    'Ingredient': u => u.plainText,
    'Item Name': u => u.detail?.itemText || '',
    'Quantity': u => u.detail? `${u.detail.quantity}${units[u.detail.unitId].symbol}` : '',
    'Product': u => u.detail? `${products[u.detail.productId].name}` : '',
  };

  if(!state.isHydrated){
    return <LoadingPage/>;
  }

  return (
    <ContainedContainer>
      <Row className={'mb-5'}>
        <Col>
          <h1 className={'display-4 mb-0'}>{recipe.name}</h1>
        </Col>
        <Col className={'mt-auto col-md-auto'}>
          <Button color={'primary'} className={'ml-auto'} onClick={() => setModal(true)}>Add Ingredients</Button>
        </Col>
      </Row>
      <Row className={'flex-grow-1'}>
        <Col sm={7}>
          <ScrollContainer>
            <SelectTable<RecipeItemDetail>
              items={recipe.itemDetail}
              selectedItem={selected}
              setSelectedItem={setSelected}
              columnMappings={tableMappings}
              size={'sm'}
            />
          </ScrollContainer>
        </Col>
        <Col>
          <Row className={'mb-4'}>
            <Col>
              <Card>
                <CardHeader>
                      Ingredient
                </CardHeader>
                <CardBody>
                  <RecipeDetailForm
                    units={Object.values(units)}
                    products={Object.values(products)}
                    disabled={Boolean(!selected)}
                    existingItem={selected}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
          <RecipeAnalysisBox analysis={recipe.lastAnalysis}/>
        </Col>
      </Row>
      <AddIngredientsModal modal={modal} setModal={setModal} recipeId={recipe.id}/>
    </ContainedContainer>
  );
};

export default withReduxState<{}, stateProps, urlParams>(RecipeDetail,
  (state, urlParams) => ({
    units: state.units.units,
    products: state.products.products,
    recipe: state.recipes.recipes[urlParams.id],
    isHydrated: state.recipes.isHydrated,
  }));