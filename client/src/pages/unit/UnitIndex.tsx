import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import {
  Button,
  Col,
  Container,
  Row,
} from 'reactstrap';
import ContainedContainer from '../../components/ContainedContainer';
import withReduxState, { reduxStateProps } from '../../components/HOC/withReduxState';
import ScrollContainer from '../../components/ScrollContainer';
import { Unit, UnitData } from '../../models/Unit';
import { useAppDispatch } from '../../redux/store';
import { createUnit } from '../../redux/unit/createUnit';
import { deleteUnit } from '../../redux/unit/deleteUnit';
import { UnitState } from '../../redux/unit/UnitSlice';
import { updateUnit } from '../../redux/unit/updateUnit';
import UnitForm from './UnitForm';
import UnitTable from './UnitTable';

const ProductIndex : React.FC<reduxStateProps<UnitState>> = ({state}) => {
  
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [ selectedUnit, setSelectedUnit ] = useState<Unit>();

  const units = Object.values(state.units);

  const onSubmit = async (data: UnitData) => {
    if(selectedUnit){

      // Update action
      const res = await dispatch(updateUnit({id: selectedUnit.id, unit: data}));
      if(updateUnit.rejected.match(res)){
        console.log(res);
      }
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
    <ContainedContainer>
      <Row className={'mb-5'}>
        <Col>
          <h1 className={'display-4 mb-0'}>Units</h1>
        </Col>
        <Col className={'mt-auto col-md-auto'}>
          <Button onClick={createNew} color={'primary'} className={'ml-auto'}>Create Unit</Button>
        </Col>
      </Row>
      <Row className={'flex-grow-1'}>
        <Col sm={7}>
          <ScrollContainer>
            <UnitTable
              units={units}
              selectedUnitId={selectedUnit?.id}
              setSelectedUnit={setSelectedUnit}
            />
          </ScrollContainer>
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
    </ContainedContainer>
  );
};

export default withReduxState<{}, UnitState>(ProductIndex,
  state => (state.units));