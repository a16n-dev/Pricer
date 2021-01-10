import React from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { Button, Col, Container, Row } from 'reactstrap';
import withReduxState, {
  reduxStateProps,
} from '../../components/HOC/withReduxState';
import PagedTable from '../../components/PagedTable';
import { columnMappings } from '../../components/SelectTable';
import { Product } from '../../models/Product';
import {
  Recipe,
  RecipeAnalysis,
  RecipeAnalysisDetail,
} from '../../models/Recipe';
import { Unit } from '../../models/Unit';
import { saveAnalysis } from '../../redux/recipe/saveAnalysis';
import { useAppDispatch } from '../../redux/store';
import LoadingPage from '../common/LoadingPage';
import RecipeAnalysisBox from './RecipeDetail/RecipeAnalysisBox';

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

const RecipeAnalysisOverview: React.FC<reduxStateProps<stateProps>> = ({
  state,
}) => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const analysis = state?.recipe?.lastAnalysis;

  const analyse = () => {
    const res: RecipeAnalysis = {
      date: Date.now(),
      cost: 0,
      itemsScanned: 0,
      itemsSkipped: 0,
      detail: [],
    };

    // populate
    state.recipe.itemDetail.forEach((i) => {
      if (i.detail) {
        const product = state.products[i.detail.productId];
        const unit = state.units[i.detail.unitId];
        const productUnit = state.units[product.unitId];

        const productBase = productUnit.quantity * product.quantity;
        const itemBase = unit.quantity * i.detail.quantity;

        const price = (itemBase / productBase) * product.cost;

        if (product && unit && productUnit) {
          const detail: RecipeAnalysisDetail = {
            productName: product.name,
            productBasePrice: `$${product.cost} per ${product.quantity} ${productUnit.symbol}`,
            recipeQuantity: `${i.detail.quantity}${unit.symbol}`,
            subtotal: Math.round(price * 1000) / 1000,
          };

          console.log(`Detail for ${i.plainText}`, detail);

          res.itemsScanned++;
          res.cost += price;
          res.detail.push(detail);
        } else {
          res.itemsSkipped++;
        }
      } else {
        res.itemsSkipped++;
      }
    });


    res.cost = Math.round(res.cost * 1000) / 1000;

    // Add servings info
    const servings = state.recipe.servings;
    if(servings){
      res.servingInfo = {
        cost: Math.round((res.cost / servings) * 1000) / 1000,
        serves: servings,
      };
    }

    // dispatch analysis
    dispatch(
      saveAnalysis({
        id: state.recipe.id,
        data: res,
      }),
    );
  };

  const map: columnMappings<RecipeAnalysisDetail> = {
    Product: (i) => i.productName,
    'Product Price': (i) => i.productBasePrice,
    Quantity: (i) => i.recipeQuantity,
    Subtotal: (i) => `$${i.subtotal.toFixed(2)}`,
  };

  if (!state.isHydrated) {
    return <LoadingPage />;
  }

  if (!state.recipe) {
    return <Redirect to={'/not-found'} />;
  }

  return (
    <Container>
      <Row className={'mb-3'}>
        <Col>
          <h3 className={'mb-0 font-weight-light'}>Recipe Analysis</h3>
          <h1 className={'mb-0'}>{state.recipe.name}</h1>
        </Col>
        <Col sm={'auto'} className={'mt-auto'}>
          <Button onClick={analyse} color={'primary'}>
            Analyse
          </Button>
        </Col>
        <Col sm={'auto'} className={'mt-auto'}>
          <Button
            onClick={() => history.push(`../${state.recipe.id}`)}
            color={'primary'}
            outline
          >
            Edit Recipe Definition
          </Button>
        </Col>
      </Row>
      {!analysis ? (
        <Row>
          <Col>No Analysis Found</Col>
        </Row>
      ) : (
        <>
          <Row Row className={'mb-3'}>
            <Col>
              <RecipeAnalysisBox
                id={state.recipe.id}
                analysis={analysis}
                hideButton
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <PagedTable<RecipeAnalysisDetail>
                items={analysis.detail}
                columnMappings={map}
                noLimit
              />
              <hr />
              <table>
                <tbody>
                  <tr>
                    <td>
                      <h3>Total Cost:</h3>
                    </td>
                    <td>
                      <h3>${analysis.cost.toFixed(2)}</h3>
                    </td>
                  </tr>
                  {analysis?.servingInfo && <>
                    <tr>
                      <td>
                        <h3>Cost Per Serve:</h3>
                      </td>
                      <td>
                        <h3>${analysis.servingInfo.cost.toFixed(2)}</h3>
                      </td>
                    </tr>
                  </>}
                </tbody>
              </table>
            </Col>
          </Row>
        </>
      )}
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
