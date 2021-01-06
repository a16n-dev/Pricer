import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,

  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import { RecipeData } from '../../models/Recipe';
import { createRecipe } from '../../redux/recipe/CreateRecipe';
import { useAppDispatch } from '../../redux/store';

interface createRecipeModalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateRecipeModal: React.FC<createRecipeModalProps> = ({
  modal,
  setModal,
}) => {

  const [ name, setName ] = useState<string>('');
  const [ loading, setLoading ] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const history = useHistory();

  const onSubmit = async () => {
    setLoading(true);
    const recipeData: RecipeData = {
      name,
      itemDetail: [],
    };

    const res = await dispatch(createRecipe(recipeData));
    if(createRecipe.fulfilled.match(res)){
      history.push(`/recipes/view/${res.payload.id}`);
    }
  };

  const toggle = () => {
    setModal(false);
  };

  return (
    <Modal isOpen={modal} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Create Recipe</ModalHeader>
      <ModalBody>
        <Label>Enter a recipe name</Label>
        <input
          type="text"
          className={'form-control'}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={onSubmit}
          disabled={name === '' || loading}
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

export default CreateRecipeModal;
