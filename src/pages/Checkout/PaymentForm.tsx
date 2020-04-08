import React from 'react';
import Select from 'react-select';
import { TextFeildGroup } from '../../components/Field';

interface Props {
  values: any;
  handleChange: any;
  errors: any;
  paymentMethod: string;
  serverErrors: any;
  isSubmitting: boolean;
  touched: any;
  setFieldTouched: (e: any) => void;
}

const CheckoutForm = ({
  values,
  handleChange,
  errors,
  isSubmitting,
  serverErrors,
  paymentMethod,
  touched,
  setFieldTouched,
}: Props) => {
  return (
    <>
      {paymentMethod !== 'cod' && (
        <>
          <div className='formContainerOfTwo'>
            <div className='formContainerOfTwoItem'>
              <TextFeildGroup
                name='paymentAccountNumber'
                label='Payment Mobile Number'
                placeholder='017xxx'
                type='text'
                value={values.paymentAccountNumber}
                onChange={(e) => {
                  handleChange(e);
                  setFieldTouched('paymentAccountNumber');
                }}
                errors={
                  (touched.paymentAccountNumber &&
                    errors.paymentAccountNumber) ||
                  (!isSubmitting && serverErrors.paymentAccountNumber)
                }
              />
            </div>
            <div className='formContainerOfTwoItem'>
              <TextFeildGroup
                label='Transaction Id'
                name='transactionId'
                placeholder='Enter Trans Id...'
                type='text'
                value={values.transactionId}
                onChange={(e) => {
                  handleChange(e);
                  setFieldTouched('transactionId');
                }}
                errors={
                  (touched.transactionId && errors.transactionId) ||
                  (!isSubmitting && serverErrors.transactionId)
                }
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CheckoutForm;
