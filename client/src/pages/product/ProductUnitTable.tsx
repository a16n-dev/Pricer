import React from 'react';
import { Button } from 'reactstrap';
import { useModal } from '../../components/functionalModal/useModal';
import PagedTable from '../../components/PagedTable';
import { columnMappings } from '../../components/SelectTable';
import { Unit } from '../../models/Unit';
import ProductUnitForm from './ProductUnitForm';

// Component Props
interface ProductUnitTableProps {
    specificUnits: Array<Unit>
    setSpecificUnits:  React.Dispatch<React.SetStateAction<Array<Unit>>>;
};

const ProductUnitTable: React.FC<ProductUnitTableProps> = ({
  specificUnits,
  setSpecificUnits,
}: ProductUnitTableProps) => {
  
  const {show} = useModal();

  const addUnit = async () => {
    const unit = await show<Unit, Unit | null>(ProductUnitForm);
    if(unit){
      setSpecificUnits([ ...specificUnits, unit ]);
    }
  };

  const editUnit = async (unit: Unit) => {
    const res = await show<Unit, Unit| null>(ProductUnitForm, unit);
    if(res === null){
      setSpecificUnits(specificUnits.filter(u => u.id !== unit.id));
    }
    if(res){
      setSpecificUnits([ ...specificUnits.filter(u => u.id !== unit.id), res ]);
    }
  };

  const unitTableMappings: columnMappings<Unit> = {
    'Name': u => u.name,
    'Symbol': u => u.symbol,
    'Quantity': u => u.quantity,
  };
    
  return (
    <div >
      <PagedTable
        noLimit
        items={specificUnits}
        columnMappings={unitTableMappings}
        clickAction={(u) => editUnit(u)}
      />
      <Button onClick={addUnit}>Add new Unit</Button>
    </div>
  );
};



export default ProductUnitTable;