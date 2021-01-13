import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import {
  Button,
  Col,
  Dropdown,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from 'reactstrap';
import CustomSelect from '../../components/CustomSelect';
import { Unit } from '../../models/Unit';
import { RootState } from '../../redux/store';
import CalculateDensity from '../../util/calculateDensity';

interface modalProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  modal: boolean;
  onSave: (density: number) => void;
}

const DensityCalculationModal: React.FC<modalProps> = ({
  setModal,
  modal,
  onSave,
}) => {
  const selectorFunction = (state: RootState) => state.units.units;
  const units = useSelector(selectorFunction);

  const [ volumeUnit, setVolumeUnit ] = useState<{
    value: string;
    label: string;
  } | null>();
  const [ weightUnit, setWeightUnit ] = useState<{
    value: string;
    label: string;
  } | null>();
  const [ volume, setVolume ] = useState<string>('1');
  const [ weight, setWeight ] = useState<string>('1');
  const [ reverse, setReverse ] = useState<boolean>(false);

  const weightUnits = Object.values(units)
    .filter((u) => u.base === 0)
    .map((u) => ({
      value: u.id,
      label: u.name,
    }));
  const volumeUnits = Object.values(units)
    .filter((u) => u.base === 1)
    .map((u) => ({
      value: u.id,
      label: u.name,
    }));

  let density: number | undefined = undefined;
  if (weightUnit && volumeUnit) {
    const v = parseFloat(volume);
    const w = parseFloat(weight);
    if (v & w) {
      density = CalculateDensity(
        units[weightUnit.value].quantity,
        w,
        units[volumeUnit.value].quantity,
        v,
      );
    }
  }

  return (
    <Modal isOpen={modal} toggle={() => setModal(false)} centered size="lg">
      <ModalHeader toggle={() => setModal(false)}>
        Calculate Product Density
      </ModalHeader>
      <ModalBody>
        <Row className={reverse ? 'flex-row-reverse' : ''}>
          <Col className={'d-flex align-items-center flex-column'}>
            Weight
            <input
              className={'form-control mt-4'}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <CustomSelect
              options={weightUnits}
              className={'w-100 mt-3'}
              value={weightUnit}
              onChange={(v) => setWeightUnit(v)}
            />
          </Col>
          <Col className={'d-flex align-items-center flex-column'}>
            <h1 className={'mt-5'}>=</h1>
            <Button onClick={() => setReverse(!reverse)} className={'mt-5'}>Switch</Button>
          </Col>
          <Col className={'d-flex align-items-center flex-column'}>
            Volume
            <input
              className={'form-control mt-4'}
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
            />
            <CustomSelect
              options={volumeUnits}
              className={'w-100 mt-3'}
              value={volumeUnit}
              onChange={(v) => setVolumeUnit(v)}
            />
          </Col>
        </Row>
        <Row>
          <Col className={'d-flex justify-content-center'}>
            {density ? `Density is ${density}` : ''}
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button disabled={!Boolean(density)}
          color={'primary'}
          onClick={() => {
            if(density){
              setModal(false);
              onSave(density);
            }
          }}>Save</Button>
      </ModalFooter>
    </Modal>
  );
};

export default DensityCalculationModal;
