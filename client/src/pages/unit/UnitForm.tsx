import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Card, CardBody, CardHeader, Col, CustomInput, FormFeedback, FormGroup, Input, InputGroup, Label, Row } from 'reactstrap';
import CustomSelect from '../../components/CustomSelect';
import { Unit, UnitData } from '../../models/Unit';

interface UnitFormProps {
    existingUnit?: Unit;
    onSubmit?: (data: UnitData) => void;
    units: Array<Unit>;
    onDelete: () => void;
    disableForm: boolean;
}

export interface UnitFormFields {
    UnitName: string;
    UnitSymbol: string;
    UnitBase: '0' | '1';
    UnitRelativeUnit: {
        label:string;
        value: Unit;
    };
    UnitRelativeQuantity: string;
}

const BASE_UNIT: unitOption = {
  label: 'BASE',
  value: {
    userId: '1',
    id: '0',
    name: 'BASE',
    symbol: '',
    base: 0,
    quantity: 1,
    dateCreated: Date.now(),
    dateUpdated: Date.now(),
  },
};

interface unitOption {
    label: string;
    value: Unit;
    isDisabled?: boolean;
}

const UnitForm: React.FC<UnitFormProps> = ({existingUnit, onSubmit, units, onDelete, disableForm}) => {

  const toUnitOption = (u: Unit): unitOption => ({
    label: u.name,
    value: u,
    isDisabled: Boolean(u.relativeUnitId) && (u.relativeUnitId === existingUnit?.id),
  });

  const refUnit = units.find(e => {

    console.log(e.id, existingUnit?.relativeUnitId);

    return  e.id === existingUnit?.relativeUnitId;
  });

  console.log(`ref: ${refUnit}`);

  const defaultValues: any = {
    UnitName: existingUnit?.name,
    UnitSymbol: existingUnit?.symbol,
    UnitBase: existingUnit?.base.toString() as any,
    UnitRelativeUnit: existingUnit?.relativeUnitId ?
      refUnit ? toUnitOption(refUnit) : undefined
      : BASE_UNIT,
    UnitRelativeQuantity: existingUnit?.relativeUnitId ?
      existingUnit?.relativeQuantity?.toString()
      : existingUnit?.quantity.toString(),
  };

  const { register, handleSubmit, errors, control, watch, reset } = useForm<UnitFormFields>({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [ existingUnit ]);

  const preSubmit = (data : UnitFormFields) => {

    const res: UnitData = {
      name: data.UnitName,
      symbol: data.UnitSymbol,
      base: Number(data.UnitBase) as 0 | 1,
      quantity: 0,
    };

    const unit = data.UnitRelativeUnit;
    if(unit.value.id === '0'){
      res.quantity = Number(data.UnitRelativeQuantity);
    } else {
      res.relativeQuantity = Number(data.UnitRelativeQuantity);
      res.relativeUnitId =  unit.value.id;
      res.quantity = parseFloat((Number(data.UnitRelativeQuantity) * unit.value.quantity).toFixed(3));
    }

    if(onSubmit){
      onSubmit(res);
    }
  };

  const UnitBase = watch('UnitBase');
  const UnitName = watch('UnitName');
  const UnitRelativeUnit = watch('UnitRelativeUnit')?.value;
  const UnitRelativeQuantity = watch('UnitRelativeQuantity');

  const dropdownOptions: Array<unitOption> = units
    .filter(u => u.base.toString() === UnitBase)
    .map(u => toUnitOption(u));

  dropdownOptions.push(BASE_UNIT);

  return (
    <Card>
      <CardHeader>{existingUnit ? `Editing ${existingUnit.name}` : 'Create new unit'}</CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(preSubmit)}>
          <FormGroup row>
            <Col>
              <Label>Unit Name</Label>
              <Input
                name="UnitName"
                placeholder="Enter a name for the unit"
                innerRef={register({
                  required: true,
                })}
                invalid={Boolean(errors.UnitName)}
                disabled={disableForm}
              />
              {errors.UnitName && <FormFeedback>Please enter a product name</FormFeedback>}
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={6}>
              <Label>Symbol</Label>
              <Input
                name="UnitSymbol"
                placeholder="Enter a symbol"
                innerRef={register({
                  required: true,
                })}
                invalid={Boolean(errors.UnitSymbol)}
                disabled={disableForm}
              />
              {errors.UnitSymbol && <FormFeedback>Please enter a symbol</FormFeedback>}
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col>
              <Label>Base</Label>
              <Row>
                <Col sm={'auto'}>
                  <CustomInput
                    type="radio"
                    id="exampleCustomRadio"
                    name="UnitBase"
                    label="Weight"
                    innerRef={register}
                    value={'0'}
                    disabled={disableForm}
                  />
                </Col>
                <Col sm>
                  <CustomInput
                    type="radio"
                    id="exampleCustomRadio2"
                    name="UnitBase"
                    label="Volume"
                    innerRef={register}
                    value={'1'}
                    disabled={disableForm}
                  />
                </Col>
              </Row>
              {errors.UnitSymbol && <FormFeedback>Please enter a symbol</FormFeedback>}
            </Col>
          </FormGroup>
          <hr/>
          <FormGroup row>
            <Col>
              <Label>Quantity</Label>
              <InputGroup>

                <Input
                  name={'UnitRelativeQuantity'}
                  className={'rounded'}
                  min={0}
                  innerRef={register({
                    required: true,
                    min: 0,
                  })}
                  invalid={Boolean(errors.UnitRelativeQuantity)}
                  disabled={disableForm}
                />
              
                <Controller
                  className={'w-50 ml-3'}
                  name="UnitRelativeUnit"
                  control={control}
                  options={dropdownOptions}
                  as={CustomSelect}
                  invalid={errors.UnitRelativeUnit}
                  rules={{ required: true }}
                  placeholder={'Select a unit'}
                  isDisabled={disableForm}
                />
              </InputGroup>
            </Col>
          </FormGroup>
          <FormGroup>
            <small className="text-muted">
              { UnitRelativeQuantity && UnitRelativeUnit ?
                `1 ${UnitName} = ${Number(UnitRelativeQuantity) *UnitRelativeUnit.quantity}${UnitBase === '0'? 'g' : 'ml'}`
                : ''}
            </small>
          </FormGroup>
          <FormGroup>
            <Button disabled={disableForm} type="submit" color={'primary'}>Save</Button>
            {existingUnit && <Button color={'primary'} className={'ml-4'} onClick={onDelete} disabled={disableForm} outline>Delete</Button>}
          </FormGroup>
        </form>
      </CardBody>
    </Card>
  );
};

export default UnitForm;