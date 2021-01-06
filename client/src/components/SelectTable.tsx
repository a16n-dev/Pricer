import { Table, TableProps } from 'reactstrap';

export type columnMappings<T> = {[title: string]: (item: T) => any}

export interface SelectTableProps<T> extends TableProps{
  items: Array<T>;
  setSelectedItem: React.Dispatch<React.SetStateAction<T | undefined>>;
  selectedItem?: T;
  columnMappings: columnMappings<T>
}

const SelectTable = <T,>({
  items,
  setSelectedItem,
  selectedItem,
  columnMappings,
  ...rest
}: SelectTableProps<T>) => (
    <Table hover={true} {...rest}>
      <thead>
        <tr>
          {Object.keys(columnMappings).map(k => <th>{k}</th>)}
        </tr>
      </thead>
      <tbody>
        {items.map((u, i) => (
          <tr
            key={i}
            onClick={() => setSelectedItem(u)}
            className={selectedItem === u ? 'alert-primary' : ''}
          >
            {Object.values(columnMappings).map((v, i) => (
              <td key={i}>{v(u)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );

export default SelectTable;
