import React from 'react';

interface Props {
  name: string;
  label: string;
  inputType: string;
  value?: string;
  onChange: any;
}

const CheckBox: React.FC<Props> = ({
  name,
  label,
  inputType,
  value,
  onChange,
}) => {
  return (
    <div className='form__group'>
      <input
        onChange={onChange}
        className='form__checkbox'
        type={inputType}
        id={name}
        name={name}
        value={value}
      />
      <label htmlFor={name}> {label} </label>
    </div>
  );
};

export default CheckBox;
