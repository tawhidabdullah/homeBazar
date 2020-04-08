import React from 'react';
import { Modal } from 'react-bootstrap';

interface Props {
  isModalShown: boolean;
  handleCloseModal: () => void;
}

const CheckoutSuccessModal = ({ isModalShown, handleCloseModal }: Props) => {
  return (
    <Modal show={isModalShown} onHide={handleCloseModal} animation={true}>
      <Modal.Body>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            padding: '10px',
          }}
        >
          <span
            style={{
              color: '#00A663',
              fontSize: '75px',
            }}
          >
            <i className='fa fa-check-circle' />
          </span>
          <span
            style={{
              color: '#00A663',
              fontSize: '20px',
              fontWeight: 700,
              marginTop: '10px',
            }}
          >
            Success!, Order has been created.
          </span>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CheckoutSuccessModal;
