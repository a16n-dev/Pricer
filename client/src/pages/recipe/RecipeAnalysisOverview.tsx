import React from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Col, Container, Row } from 'reactstrap';
import withReduxState, { reduxStateProps } from '../../components/HOC/withReduxState';
import { Product } from '../../models/Product';
import { Recipe, RecipeAnalysis, RecipeAnalysisDetail } from '../../models/Recipe';
import { Unit } from '../../models/Unit';
import { saveAnalysis } from '../../redux/recipe/saveAnalysis';
import { useAppDispatch } from '../../redux/store';
import LoadingPage from '../common/LoadingPage';

interface stateProps {
    units: { [key: string]: Unit };
    products: { [key: string]: Product };
    recipe: Recipe;
    isHydrated: boolean;
    unsavedChanges: boolean;
  }
  
  interface urlParams {
    id: string;
  }

const RecipeAnalysisOverview: React.FC<reduxStateProps<stateProps>> = ({state}) => {

  const dispatch = useAppDispatch();

  const analyse = () => {
    const res: RecipeAnalysis = {
      date: Date.now(),
      cost: 0,
      itemsScanned: 0,
      itemsSkipped: 0,
      detail: [],
    };

    // populate
    state.recipe.itemDetail.forEach(i => {

      if(i.detail){

        const product = state.products[i.detail.productId];
        const unit = state.units[i.detail.unitId];
        const productUnit = state.units[product.unitId];

        const productBase = productUnit.quantity * product.quantity;
        const itemBase = unit.quantity * i.detail.quantity;

        const price = (itemBase / productBase) * product.cost;

        if(product && unit && productUnit){
          const detail: RecipeAnalysisDetail = {
            productName: product.name,
            productBasePrice: `$${product.cost}/ ${product.quantity}${productUnit.symbol}`,
            recipeQuantity: `${i.detail.quantity}${unit.symbol}`,
            subtotal: Math.round(price * 1000) / 1000,
          };

          console.log(`Detail for ${i.plainText}`,detail);

          res.itemsScanned++;
          res.cost+= price;
          res.detail.push(detail);

        } else {
          res.itemsSkipped++;
        }
      } else {
        res.itemsSkipped++;
      }
    });
    res.cost = Math.round(res.cost * 1000) / 1000;
    
    // dispatch analysis
    dispatch(saveAnalysis({
      id: state.recipe.id,
      data: res,
    }));
  };

  if (!state.isHydrated) {
    return <LoadingPage />;
  }

  if (!state.recipe) {
    return <Redirect to={'/not-found'} />;
  }
  
  return (
    <Container>
      <Row>
        <Col><h1>Recipe Analysis</h1></Col>
      </Row>
      <Row>
        <Button onClick={analyse}>Analyse</Button>
      </Row>
      {!state.recipe.lastAnalysis ?
        <Row>
          <Col>No Analysis Found</Col>
        </Row>
        :
        <Row>
          <Col>{JSON.stringify(state.recipe.lastAnalysis)}</Col>
        </Row>}
    </Container>
  );
};

export default withReduxState<{}, stateProps, urlParams>(
  RecipeAnalysisOverview,
  (state, urlParams) => ({
    units: state.units.units,
    products: state.products.products,
    recipe: state.recipes.recipes[urlParams.id],
    isHydrated: state.recipes.isHydrated,
    unsavedChanges: state.recipes.unsavedChanges,
  }),
);
  