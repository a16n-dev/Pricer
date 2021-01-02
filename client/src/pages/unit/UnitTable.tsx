import { Table } from 'reactstrap';
import { Unit } from '../../models/models';

export interface UnitTableProps {
    units: Array<Unit>;
    setSelectedUnit: React.Dispatch<React.SetStateAction<Unit | undefined>>
    selectedUnitId?: string;
}

const UnitTable: React.FC<UnitTableProps> = ({units, setSelectedUnit, selectedUnitId}) => {

  const a = 3;

  return (
    <Table hover={true}>
      <thead>
        <tr>
          <th>Unit Name</th>
          <th>Symbol</th>
          <th>Metric</th>
        </tr>
      </thead>
      <tbody>
        {units.map((u, i) => (
          <tr
            key={i}
            onClick={() => setSelectedUnit(u)}
            className={selectedUnitId === u.id ?'alert-primary': ''}>
            <td>{u.name}</td>
            <td>{u.symbol}</td>
            <td>{u.quantity}{u.base === 0 ? 'g' : 'ml'}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

};

export default UnitTable;