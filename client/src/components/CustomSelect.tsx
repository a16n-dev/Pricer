import React from 'react';
import Select, { Props } from 'react-select';

const white = '#ffffff';
const bsBorderBlue = '#66afe9';
const bsBorderGrey = 'rgb(206, 212, 218)';
const bsBoxShadowBlue = 'inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);';
const bsBoxShadowGrey = 'inset 0 1px 1px rgba(0,0,0,.075);';
const bsBackgroundOption = '#f8f9fa';
const bsBackgroundOptionSelected = '#eeeeee';
const bsControlTextColor = '#555555';
const bsBorderError = '#dc3545';
const bsBoxShadowError = 'inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px #dc3545;';


interface customSelectProps extends Props {
    invalid: boolean;
}

const errStyles = {
  PaddingRight: 'calc(1.5em + .75rem)',
  background: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'none\' stroke=\'%23dc3545\' viewBox=\'0 0 12 12\'%3e%3ccircle cx=\'6\' cy=\'6\' r=\'4.5\'/%3e%3cpath stroke-linejoin=\'round\' d=\'M5.8 3.6h.4L6 6.5z\'/%3e%3ccircle cx=\'6\' cy=\'8.2\' r=\'.6\' fill=\'%23dc3545\' stroke=\'none\'/%3e%3c/svg%3e")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition:'right calc(.375em + .1875rem) center',
  backgroundSize:' calc(.75em + .375rem) calc(.75em + .375rem)',
};

const CustomSelect : React.FC<customSelectProps> = ({invalid, ...rest}) => {

  const styles = {
    control: (base: any, state: { selectProps: { menuIsOpen?: any; }; }) => ({
      ...base,
      borderRadius: '.25rem',
      backgroundColor: white,
      borderColor: invalid?
        bsBorderError
        :
        (state.selectProps.menuIsOpen ? bsBorderBlue : bsBorderGrey),
      boxShadow: state.selectProps.menuIsOpen ?
        (invalid? bsBoxShadowError : bsBoxShadowBlue)
        :
        bsBoxShadowGrey,
      ':hover': {
        borderColor: invalid?
          bsBorderError
          :
          (state.selectProps.menuIsOpen ? bsBorderBlue : bsBorderGrey),
        boxShadow: state.selectProps.menuIsOpen ?
          (invalid? bsBoxShadowError : bsBoxShadowBlue)
          :
          bsBoxShadowGrey,
      },
    }),

    indicatorSeparator: (base:any) => ({
      ...base,
      backgroundColor: invalid ? bsBorderError : bsBorderGrey,
    }),
  
    option: (base: any, state: { isSelected: any; isFocused: any; }) => ({
      ...base,
      color: bsControlTextColor,
      backgroundColor: state.isSelected
        ? bsBackgroundOptionSelected
        : state.isFocused ? bsBackgroundOption : white,
    }),

    valueContainer: (base: any) => ({
      ...base,
      ...(invalid ? errStyles : {}),
    }),
  };

  return(
    <>
      <Select
        styles={styles}
        isClearable
        { ...rest}
      />
    </>
  );
};
export default CustomSelect;