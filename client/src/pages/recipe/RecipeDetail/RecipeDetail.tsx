import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import ContainedContainer from '../../../components/ContainedContainer';
import withReduxState, {
  reduxStateProps,
} from '../../../components/HOC/withReduxState';
import ScrollContainer from '../../../components/ScrollContainer';
import SelectTable, { columnMappings } from '../../../components/SelectTable';
import { Product } from '../../../models/Product';
import { Recipe, RecipeItemDetail } from '../../../models/Recipe';
import { Unit } from '../../../models/Unit';
import { deleteItemDetail, saveItemDetail } from '../../../redux/recipe/RecipeSlice';
import { updateRecipeIngredients } from '../../../redux/recipe/updateRecipeIngredients';
import { useAppDispatch } from '../../../redux/store';
import relativeDateString from '../../../util/relativeDateString';
import LoadingPage from '../../common/LoadingPage';
import AddIngredientsModal from './AddIngredientsModal';
import RecipeAnalysisBox from './RecipeAnalysisBox';
import RecipeDetailForm from './RecipeDetailForm';

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

const RecipeDetail: React.FC<reduxStateProps<stateProps>> = ({ state }) => {
  const { units, products, recipe } = state;

  const [ selected, setSelected ] = useState<RecipeItemDetail>();
  const [ modal, setModal ] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const snackbar = useSnackbar();
  const history = useHistory();
  
  const tableMappings: columnMappings<RecipeItemDetail> = {
    Ingredient: (u) => u.plainText,
    'Item Name': (u) => u.detail?.itemText || '',
    Quantity: (u) =>
      u.detail ? `${u.detail.quantity}${
        {...units,
          ...products[u.detail.productId]?.units.reduce(
            (map, obj) => (map[obj.id] = obj, map),
         {} as {[key: string]: Unit},
          ),
        }[u.detail.unitId]?.symbol
      }` : '',
    Product: (u) => (u.detail ? `${products[u.detail.productId]?.name}` : ''),
  };

  // handle save
  const saveChanges = async () => {
    const res = await dispatch(updateRecipeIngredients({
      id: recipe.id,
      data: recipe.itemDetail,
    }));
    if(updateRecipeIngredients.fulfilled.match(res)){
      snackbar.enqueueSnackbar('Saved Changes', {variant: 'success'});
    }
  };

  const updateItem = (data: RecipeItemDetail) => {
    dispatch(saveItemDetail({
      recipeId: recipe.id,
      detail: data,
    }));
  };

  const deleteItem = async () => {
    dispatch(deleteItemDetail({
      recipeId: recipe.id,
      detail: selected,
    }));
    setSelected(undefined);
  };

  const addIngredients = async (items: Array<RecipeItemDetail>) => {
    const ingredients = [ ...recipe.itemDetail, ...items ];
    return await dispatch(updateRecipeIngredients({
      id: recipe.id,
      data: ingredients,
    }));
  };

  if (!state.isHydrated) {
    return <LoadingPage />;
  }

  if (!state.recipe) {
    return <Redirect to={'/not-found'} />;
  }

  return (
    <ContainedContainer>
      <Row className={'mb-3'}>
        <Col sm={'auto'}>
          <h3 className={'mb-0 font-weight-light'}>Recipe Definition</h3>
          <h1 className={'mb-0'}>{state.recipe.name}</h1>
        </Col>
        <Col className={'mt-auto'}>
          <span className={'text-muted'}>
          Last saved {relativeDateString(recipe.dateUpdated)}
          </span>
        </Col>
        <Col className={'mt-auto col-md-auto'}>
          <Button
            color={'primary'}
            className={'ml-auto'}
            onClick={() => setModal(true)}
            outline
          >
            Add Ingredients
          </Button>
          <Button
            color={'primary'}
            className={'ml-2'}
            onClick={() => saveChanges()}
            disabled={!state.unsavedChanges}
          >
            Save Changes
          </Button>
          <Button
            color={'primary'}
            className={'ml-2'}
            onClick={() => history.push(`${recipe.id}/settings`)}
            outline
          >
            Recipe Settings
          </Button>
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
                <CardHeader>Ingredient</CardHeader>
                <CardBody>
                  <RecipeDetailForm
                    units={Object.values(units)}
                    products={Object.values(products)}
                    disabled={Boolean(!selected)}
                    existingItem={selected}
                    onSubmit={updateItem}
                    onDelete={deleteItem}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
          <RecipeAnalysisBox id={recipe.id} analysis={recipe.lastAnalysis} />
        </Col>
      </Row>
      <AddIngredientsModal
        modal={modal}
        setModal={setModal}
        recipeId={recipe.id}
        onSubmit={addIngredients}
      />
    </ContainedContainer>
  );
};

export default withReduxState<{}, stateProps, urlParams>(
  RecipeDetail,
  (state, urlParams) => ({
    units: state.units.units,
    products: state.products.products,
    recipe: state.recipes.recipes[urlParams.id],
    isHydrated: state.recipes.isHydrated,
    unsavedChanges: state.recipes.unsavedChanges,
  }),
);
