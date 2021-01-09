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
import { updateRecipeIngredients } from '../../../redux/recipe/updateRecipeIngredients';
import { useAppDispatch } from '../../../redux/store';

interface AddIngredientsModalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  recipeId: string;
  onSubmit: (items: Array<RecipeItemDetail>) => Promise<any>;
}

const AddIngredientsModal: React.FC<AddIngredientsModalProps> = ({
  modal,
  setModal,
  recipeId,
  onSubmit,
}) => {

  const [ ingredients, setIngredients ] = useState<string>('');
  const [ loading, setLoading ] = useState<boolean>(false);

  const preSubmit = async () => {
    setLoading(true);

    const items = ingredients.split('\n');
    const res = await onSubmit(items.map((i: string): RecipeItemDetail => ({plainText: i})));

    if(updateRecipeIngredients.fulfilled.match(res)){
      setIngredients('');
      setModal(false);
    }
    setLoading(false);
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
          onClick={preSubmit}
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
