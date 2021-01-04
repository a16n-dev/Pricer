import { Unit } from '../../models/Unit';

type UnitState = {
  count: number;
  loading: boolean;
  units: { [key: string]: Unit };
};

export default UnitState;
