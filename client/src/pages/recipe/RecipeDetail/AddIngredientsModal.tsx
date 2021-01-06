import React, { useState } from 'react';
import {
  Button,

  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import { RecipeItemDetail } from '../../../models/Recipe';
import { addRecipeIngredients } from '../../../redux/recipe/addRecipeIngredients';
import { useAppDispatch } from '../../../redux/store';

interface AddIngredientsModalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  recipeId: string
}

const AddIngredientsModal: React.FC<AddIngredientsModalProps> = ({
  modal,
  setModal,
  recipeId,
}) => {

  const [ ingredients, setIngredients ] = useState<string>('');
  const [ loading, setLoading ] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const onSubmit = async () => {
    setLoading(true);

    const items = ingredients.split('\n');
    try {
      const res = await dispatch(addRecipeIngredients({
        id: recipeId,
        ingredients: items.map((i: string): RecipeItemDetail => ({plainText: i})),
      }));

      if(addRecipeIngredients.fulfilled.match(res)){
        setIngredients('');
        setModal(false);
      }
    } catch (error) {
        
    } finally {
      setLoading(false);
    }
    

    

    // setModal(false);
  };

  const toggle = () => {
    setModal(false);
  };

  return (
    <Modal isOpen={modal} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Create Recipe</ModalHeader>
      <ModalBody>
        <Label>Enter Ingredients</Label><br/>
        <small>Enter each ingredient on a new line</small>
        <textarea
          className={'form-control'}
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          disabled={loading}
          rows={20}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={onSubmit}
          disabled={ingredients === '' || loading}
        >
          Confirm
        </Button>{' '}
        <Button color="primary" outline onClick={toggle} disabled={loading}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddIngredientsModal;
