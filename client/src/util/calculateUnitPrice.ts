import { Product } from '../models/Product';
import { Unit } from '../models/Unit';

export const calculateUnitPrice = (
  product: Product,
  baseUnit: Unit,
  targetUnit: Unit,
  quantity: number,
): number => {
  const productBase = baseUnit.quantity * product.quantity;
  const itemBase = targetUnit.quantity * quantity;
  
  // either -1, 0 or 1
  const relativeBase = baseUnit.base - targetUnit.base;

  let densityMultiplier;
  switch (relativeBase) {
  case -1:
    densityMultiplier = product.density;
    break;
  case 1:
    densityMultiplier = 1 / product.density;
    break;
  default:
    densityMultiplier = 1;
    break;
  }

  const price = (itemBase / productBase) * densityMultiplier * product.cost;
  return price;
};
