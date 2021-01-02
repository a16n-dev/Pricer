import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Col,
  Container,
  Row,
} from 'reactstrap';
import withReduxState, { reduxStateProps } from '../../components/HOC/withReduxState';
import { Unit } from '../../models/models';
import { useAppDispatch } from '../../redux/store';
import { createUnit, CreateUnitData, deleteUnit, UnitState, updateUnit } from '../../redux/UnitSlice';
import UnitForm, { UnitFormFields } from './UnitForm';
import UnitTable from './UnitTable';

const ProductIndex : React.FC<reduxStateProps<UnitState>> = ({state}) => {
  
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [ selectedUnit, setSelectedUnit ] = useState<Unit>();

  const units = Object.values(state.units);

  const onSubmit = async (data: CreateUnitData) => {
    if(selectedUnit){

      // Update action
      const res = await dispatch(updateUnit({id: selectedUnit.id, unit: data}));
    } else {

      // Create action
      const res = await dispatch(createUnit(data));
      if(createUnit.fulfilled.match(res)){
        setSelectedUnit(res.payload);
        enqueueSnackbar(`Created ${data.name}`, {
          variant:'success',
        });
      }
    }
  };

  const createNew = () => {
    setSelectedUnit(undefined);
  };

  const onDelete = async () => {
    if(selectedUnit){
      await dispatch(deleteUnit(selectedUnit?.id));
      setSelectedUnit(undefined);
    }
  };

  return(
    <Container>
      <Row className={'mb-5'}>
        <Col>
          <h1 className={'display-4 mb-0'}>Units</h1>
        </Col>
        <Col className={'mt-auto col-md-auto'}>
          <Button onClick={createNew} color={'primary'} className={'ml-auto'}>Create Unit</Button>
        </Col>
      </Row>
      <Row>
        <Col sm={7}>
          <UnitTable
            units={units}
            selectedUnitId={selectedUnit?.id}
            setSelectedUnit={setSelectedUnit}
          />
        </Col>
        <Col>
          <UnitForm
            onSubmit={onSubmit}
            units={units.filter(u => u.id !== selectedUnit?.id)}
            existingUnit={selectedUnit}
            onDelete={onDelete}
            disableForm={state.loading}
          />
        </Col>
        
      </Row>
    </Container>
  );
};

export default withReduxState<{}, UnitState>(ProductIndex,
  state => (state.units));