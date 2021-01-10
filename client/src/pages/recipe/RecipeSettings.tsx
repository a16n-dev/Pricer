import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Redirect, useHistory } from 'react-router-dom';
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
import { Recipe, RecipeData } from '../../models/Recipe';
import { deleteRecipe } from '../../redux/recipe/deleteRecipe';
import { updateRecipe } from '../../redux/recipe/updateRecipe';
import { useAppDispatch } from '../../redux/store';
import LoadingPage from '../common/LoadingPage';

interface stateProps {
  recipe: Recipe;
  isHydrated: boolean;
}

interface urlParams {
  id: string;
}

interface settingsFormFields {
  name: string;
  servings: number;
}

// Field names
const names = {
  name: 'name',
  servings: 'servings',
};

const RecipeSettings: React.FC<reduxStateProps<stateProps>> = ({
  state: { recipe, isHydrated },
}) => {

  const history = useHistory();
  const dispatch = useAppDispatch();
  const { register, handleSubmit, errors, reset } = useForm<settingsFormFields>({
    defaultValues: {
      name: recipe?.name,
      servings: recipe?.servings,
    },
  });
  const snackbar = useSnackbar();

  useEffect(() => {
    reset({
      name: recipe?.name,
      servings: recipe?.servings,
    });
  }, [ recipe, reset ]);

  const onSubmit = async (data: settingsFormFields) => {
    const updates: Partial<RecipeData> = {};
    if(data.name !== recipe.name){
      updates.name = data.name;
    }
    if(data.servings > 0){
      updates.servings = data.servings;
    }

    
    if(JSON.stringify(updates) !== '{}'){

      const res = await dispatch(updateRecipe({
        id: recipe.id,
        data: updates,
      }));

      if(updateRecipe.fulfilled.match(res)){
        snackbar.enqueueSnackbar(`Successfully updated ${recipe.name}`, {variant: 'success'});
      }
    } else {
      snackbar.enqueueSnackbar('No changes made', {variant: 'success'});
    }
    history.push(`../${recipe.id}`);
  };

  const handleDelete = async () => {
    const res = await dispatch(deleteRecipe(recipe.id));
    if(deleteRecipe.fulfilled.match(res)){
      history.push('/recipes');
      snackbar.enqueueSnackbar(`Successfully deleted ${recipe.name}`, {variant: 'success'});
    }
  };

  if (!isHydrated) {
    return <LoadingPage />;
  }

  if (!recipe) {
    return <Redirect to={'/not-found'} />;
  }

  return (
    <Container>
      <Row>
        <Col>
          <h1>Settings for {recipe.name}</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup row>
              <Col>
                <Label>Recipe Name</Label>
                <Input
                  name={names.name}
                  placeholder="Enter a name for the recipe"
                  innerRef={register({
                    required: true,
                  })}
                  invalid={Boolean(errors.name)}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col>
                <Label>Servings</Label>
                <Input
                  name={names.servings}
                  placeholder="Enter a number of servings"
                  innerRef={register({
                    valueAsNumber: true,
                  })}
                  invalid={Boolean(errors.servings)}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Button type="submit" color={'primary'}>
                Save
              </Button>
              <Button
                onClick={() => history.push(`../${recipe.id}`)}
                color={'primary'}
                className={'ml-4'}
                outline
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                color={'danger'}
                className={'ml-4'}
                outline
              >
                Delete Recipe
              </Button>
            </FormGroup>
          </form>
        </Col>
      </Row>
    </Container>
  );
};

export default withReduxState<{}, stateProps, urlParams>(
  RecipeSettings,
  (state, urlParams) => ({
    isHydrated: state.recipes.isHydrated,
    recipe: state.recipes.recipes[urlParams.id],
  }),
);
