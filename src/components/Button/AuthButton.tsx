import React from 'react';

interface Props {
  onclick: () => void;
  disabled: boolean;
  children: any;
}

const AuthButton = ({ onclick, disabled, children }: Props) => {
  return (
    <button
      type='submit'
      onClick={onclick}
      className={disabled ? 'authButton disabled' : 'authButton'}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default AuthButton;
