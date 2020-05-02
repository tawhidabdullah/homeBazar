import React, { useState, useEffect, useLayoutEffect } from 'react';
import { withAlert } from 'react-alert';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ShippingCheckout from './ShippingCheckout';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { RadioGroup, ReversedRadioButton } from 'react-radio-buttons';
import { cartSelectors } from '../../state/ducks/cart';
import { sessionOperations } from '../../state/ducks/session';
import SmallItem from '../../components/SmallItem';
import { useHandleFetch } from '../../hooks';
import { Spinner } from '../../components/Loading';
import { AuthButton } from '../../components/Button';
import Checkbox from '../../components/Checkbox';
import { cacheOperations } from '../../state/ducks/cache';
import { checkIfItemExistsInCache, getDeliveryChargeTotal } from '../../utils';
import { cartOperations } from '../../state/ducks/cart';
import PaymentForm from './PaymentForm';
import dictionary from '../../dictionary';

// import checkout component
import CheckoutSuccessModal from './CheckoutSuccessModal';
import CheckoutForm from './CheckoutForm';

// validation schemeas

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const validationSchemaForNotSigninCod = Yup.object().shape({
  firstName: Yup.string()
    .label('Name')
    .required()
    .min(2, 'Firstname must have at least 2 characters '),
  lastName: Yup.string()
    .label('Name')
    .required()
    .min(2, 'Lastname must have at least 2 characters '),
  phone: Yup.string()
    .required('Please tell us your mobile number.')
    .max(13, 'Please enter a valid mobile number.'),
  email: Yup.string().label('Email').email('Please enter a valid email'),
  password: Yup.string()
    .label('Password')
    .required()
    .min(6, 'Password must have at least 6 characters'),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'Passwords must match'
  ),
  address1: Yup.string()
    .label('Address line 1')
    .required()
    .min(3, 'Address line 1 must have at least 3 characters '),
});

const validationSchemaForCod = Yup.object().shape({
  firstName: Yup.string()
    .label('Firstname')
    .required()
    .min(2, 'Firstname must have at least 2 characters '),
  lastName: Yup.string()
    .label('Lastname')
    .required()
    .min(2, 'Lastname must have at least 2 characters '),
  phone: Yup.string()
    .required('Please tell us your mobile number.')
    .max(13, 'Please enter a valid mobile number.'),
  email: Yup.string().label('Email').email('Please enter a valid email'),
  address1: Yup.string()
    .label('Address line 1')
    .required()
    .min(3, 'Address line 1 must have at least 3 characters '),
});

const validationSchemaForNotSigninOtherPaymentMethods = Yup.object().shape({
  firstName: Yup.string()
    .label('Firstname')
    .required()
    .min(2, 'Firstname must have at least 2 characters '),
  lastName: Yup.string()
    .label('Lastname')
    .required()
    .min(2, 'Lastname must have at least 2 characters '),
  phone: Yup.string()
    .required('Please tell us your mobile number.')
    .max(13, 'Please enter a valid mobile number.'),
  email: Yup.string().label('Email').email('Please enter a valid email'),
  address1: Yup.string()
    .label('Address line 1')
    .required()
    .min(3, 'Address line 1 must have at least 3 characters '),

  paymentAccountNumber: Yup.string()
    .required('Please tell us your mobile number.')
    .matches(phoneRegExp, 'Please enter a valid mobile number.'),
  transactionId: Yup.string()
    .label('Payment Id')
    .required('Transaction id is Required'),
  password: Yup.string()
    .label('Password')
    .required()
    .min(6, 'Password must have at least 6 characters'),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'Passwords must match'
  ),
});

const validationSchemaForOtherPaymentMethods = Yup.object().shape({
  firstName: Yup.string()
    .label('Firstname')
    .required()
    .min(2, 'Firstname must have at least 2 characters '),
  lastName: Yup.string()
    .label('Lastname')
    .required()
    .min(2, 'Lastname must have at least 2 characters '),
  phone: Yup.string()
    .required('Please tell us your mobile number.')
    .max(13, 'Please enter a valid mobile number.'),
  email: Yup.string().label('Email').email('Please enter a valid email'),
  address1: Yup.string()
    .label('Address line 1')
    .required()
    .min(3, 'Address line 1 must have at least 3 characters '),

  paymentAccountNumber: Yup.string()
    .required('Please tell us your mobile number.')
    .matches(phoneRegExp, 'Please enter a valid mobile number.'),
  transactionId: Yup.string()
    .label('Payment Id')
    .required('Transaction id is Required'),
});

const shippingAddressValidationSchema = Yup.object().shape({
  shippingFirstName: Yup.string()
    .label('FirstName')
    .required()
    .min(2, 'FirstName name must have at least 2 characters '),
  shippingLastName: Yup.string()
    .label('LastName')
    .required()
    .min(2, 'LastName must have at least 2 characters '),
  shippingPhone: Yup.string()
    .required('Please tell us your mobile number.')
    .max(13, 'Please enter a valid mobile number.'),
  shippingEmail: Yup.string()
    .label('Email')
    .email('Please enter a valid email'),
  shippingAddress1: Yup.string()
    .label('Address line 1')
    .required()
    .min(3, 'Address line 1 must have at least 3 characters '),
});

const shippingAddressInitialValues = {
  shippingFirstName: '',
  shippingLastName: '',
  shippingCountry: '',
  shippingCity: '',
  shippingAddress1: '',
  shippingAddress2: '',
  shippingPhone: '',
  shippingEmail: '',
};

const otherPaymentMethodIntialValues = {
  phone: null,
  email: '',
  password: '',
  passwordConfirmation: '',
  firstName: '',
  lastName: '',
  address1: '',
  address2: '',
  paymentAccountNumber: '',
  transactionId: '',
};

const otherPaymentMethodNotSigninIntialValues = {
  phone: '',
  email: '',
  firstName: '',
  lastName: '',
  address1: '',
  address2: '',
  paymentAccountNumber: '',
  transactionId: '',
};

const codInitialValues = {
  phone: null,
  email: '',
  password: '',
  passwordConfirmation: '',
  firstName: '',
  lastName: '',
  address1: '',
  address2: '',
};

const codInitialNotSigninValues = {
  phone: '',
  email: '',
  firstName: '',
  lastName: '',
  address1: '',
  address2: '',
};

interface Props {
  history: any;
  cartItems: any;
  totalPrice: number;
  session: any;
  logout: () => void;
  addItemToCache: (any) => void;
  cache: any;
  clearCart: () => void;
  alert?: any;
}

const Checkout = ({
  history,
  cartItems,
  totalPrice,
  session,
  logout,
  addItemToCache,
  cache,
  clearCart,
  alert,
}: Props) => {
  const [paymentMethod, setPaymentMethod] = React.useState('cod');
  const [isModalShown, setIsModalShown] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [windowWidth, setWindowWidth] = useState(0);
  const [selectedCountryValue, setSelectedCountryValue] = React.useState({
    value: 'Bangladesh',
    label: 'Bangladesh',
  });

  const [selectedCityValue, setSelectedCityValue] = React.useState({
    value: 'city',
    label: 'City',
  });

  const [
    selectedShippingCityValue,
    setSelectedShippingCityValue,
  ] = React.useState({
    value: 'city',
    label: 'Shipping City',
  });

  const [
    selectedShippingCountryValue,
    setSelectedShippingCountryValue,
  ] = React.useState({
    value: 'Bangladesh',
    label: 'Bangladesh',
  });

  const [
    isUseAccountBillingAddresss,
    setIsUseAccountBillingAddresss,
  ] = useState(false);

  const [countryListState, handleCountryListFetch] = useHandleFetch(
    [],
    'countryList'
  );

  const [cityListState, handleCityListFetch] = useHandleFetch([], 'cityList');

  const [deliveryChargeState, handleDeliveryChargeFetch] = useHandleFetch(
    [],
    'getDeliveryCharge'
  );

  const [billingDeliveryCharge, setBillingDeliveryCharge] = useState([]);
  const [shippingDeliveryCharge, setShippingDeliveryCharge] = useState([]);

  const [deliveryRegionName, setDeliveryRegionName] = useState('');
  const [selectedRegion, setSelectedRegion] = useState({});

  const [countryList, setCountryList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [shippingCityList, setShippingCityList] = useState([]);

  const [isShipToDifferentAddress, setIsShipToDifferentAddress] = useState(
    false
  );

  const [customerDetailState, handleCustomerDetailFetch] = useHandleFetch(
    {},
    'getCurrentCustomerData'
  );

  const [createOrderState, handleCreateOrderFetch] = useHandleFetch(
    {},
    'createOrder'
  );

  const getWindowWidth = () => {
    return Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
  };

  useLayoutEffect(() => {
    setWindowWidth(getWindowWidth());
  }, []);

  const onResize = () => {
    window.requestAnimationFrame(() => {
      setWindowWidth(getWindowWidth());
    });
  };

  useLayoutEffect(() => {
    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (
      checkIfItemExistsInCache(`cityList/${selectedCountryValue.value}`, cache)
    ) {
      const cityList = cache[`cityList/${selectedCountryValue.value}`];
      setCityList(cityList);
      // @ts-ignore
      const cityValue = cityList.length > 0 && cityList[0];
      setSelectedCityValue({
        value: cityValue['name'],
        label: cityValue['name'],
      });
    } else {
      const getAndSetCityList = async () => {
        const cityList = await handleCityListFetch({
          urlOptions: {
            placeHolders: {
              country: selectedCountryValue.value,
            },
          },
        });
        // @ts-ignore
        if (cityList) {
          // @ts-ignore
          setCityList(cityList);
          // @ts-ignore
          const cityValue = cityList.length > 0 && cityList[0];
          setSelectedCityValue({
            value: cityValue['name'],
            label: cityValue['name'],
          });
          addItemToCache({
            [`cityList/${selectedCountryValue.value}`]: cityList,
          });
        }
      };

      getAndSetCityList();
    }
  }, [selectedCountryValue]);

  useEffect(() => {
    if (
      checkIfItemExistsInCache(
        `shippingCityList/${selectedShippingCountryValue.value}`,
        cache
      )
    ) {
      const shippingCityList =
        cache[`shippingCityList/${selectedShippingCountryValue.value}`];
      setShippingCityList(shippingCityList);
      // @ts-ignore
      const cityValue = shippingCityList.length > 0 && shippingCityList[0];
      setSelectedShippingCityValue({
        value: cityValue['name'],
        label: cityValue['name'],
      });
    } else {
      const getAndSetShippingCityList = async () => {
        const shippingCityList = await handleCityListFetch({
          urlOptions: {
            placeHolders: {
              country: selectedShippingCountryValue.value,
            },
          },
        });
        // @ts-ignore
        if (shippingCityList) {
          // @ts-ignore
          setShippingCityList(shippingCityList);

          // @ts-ignore
          const cityValue = shippingCityList.length > 0 && shippingCityList[0];
          setSelectedShippingCityValue({
            value: cityValue['name'],
            label: cityValue['name'],
          });

          addItemToCache({
            [`cityList/${selectedShippingCountryValue.value}`]: shippingCityList,
          });
        }
      };

      getAndSetShippingCityList();
    }
  }, [selectedShippingCountryValue]);

  useEffect(() => {
    if (
      checkIfItemExistsInCache(
        `getDeliveryCharge/${selectedCityValue.value}`,
        cache
      )
    ) {
      const deliveryCharge =
        cache[`getDeliveryCharge/${selectedCityValue.value}`];
      setBillingDeliveryCharge(deliveryCharge);
    } else {
      const getAndSetBillingDeliveryCharge = async () => {
        const billingDeliveryCharge = await handleDeliveryChargeFetch({
          urlOptions: {
            placeHolders: {
              cityName: selectedCityValue.value,
            },
          },
        });

        // @ts-ignore
        setBillingDeliveryCharge(billingDeliveryCharge);

        addItemToCache({
          [`getDeliveryCharge/${selectedCityValue.value}`]: billingDeliveryCharge,
        });
      };

      getAndSetBillingDeliveryCharge();
    }
  }, [selectedCityValue]);

  useEffect(() => {
    if (
      checkIfItemExistsInCache(
        `getDeliveryCharge/${selectedShippingCityValue.value}`,
        cache
      )
    ) {
      const shippingDeliveryCharge =
        cache[`getDeliveryCharge/${selectedShippingCityValue.value}`];
      setShippingDeliveryCharge(shippingDeliveryCharge);
    } else {
      const getAndSetShippingDeliveryCharge = async () => {
        const shippingDeliveryCharge = await handleDeliveryChargeFetch({
          urlOptions: {
            placeHolders: {
              cityName: selectedShippingCityValue.value,
            },
          },
        });
        // @ts-ignore
        setShippingDeliveryCharge(shippingDeliveryCharge);

        addItemToCache({
          [`getDeliveryCharge/${selectedShippingCityValue.value}`]: shippingDeliveryCharge,
        });
      };

      getAndSetShippingDeliveryCharge();
    }
  }, [selectedShippingCityValue]);

  useEffect(() => {
    if (checkIfItemExistsInCache(`countryList`, cache)) {
      const countryList = cache['countryList'];
      setCountryList(countryList);
    } else {
      const getAndSetCountryList = async () => {
        const countryList = await handleCountryListFetch({});
        // @ts-ignore
        if (countryList) {
          // @ts-ignore
          setCountryList(countryList);
          addItemToCache({
            countryList: countryList,
          });
        }
      };

      getAndSetCountryList();
    }
  }, []);

  useEffect(() => {
    const getCheckAndSetCustomerData = async () => {
      setIsAuthLoading(true);
      const customerData = await handleCustomerDetailFetch({});
      // @ts-ignore
      if (!customerData) {
        // history.push('/signin');
        logout();
      }
      setIsAuthLoading(false);
    };
    if (!session['isAuthenticated']) {
      getCheckAndSetCustomerData();
    }
  }, [session['isAuthenticated']]);

  const handleCloseModal = () => {
    setIsModalShown(false);

    if (!session.isAuthenticated) {
      history.push('/dashboard');
    } else {
      history.push('/');
    }
  };

  const isDeliveryChargeExists = (regions) => {
    if (!regions) {
      return false;
    } else return true;
  };

  const onRadioGroupChange = (value) => {
    setPaymentMethod(value);
  };

  const onDeviliveryRegionChange = (value) => {
    setDeliveryRegionName(value);
    if (
      isDeliveryChargeExists(
        isShipToDifferentAddress
          ? shippingDeliveryCharge &&
              shippingDeliveryCharge.length > 0 &&
              shippingDeliveryCharge
          : billingDeliveryCharge &&
              billingDeliveryCharge.length > 0 &&
              billingDeliveryCharge
      )
    ) {
      const deliveryRegions = isShipToDifferentAddress
        ? shippingDeliveryCharge
        : billingDeliveryCharge;

      const selectedRegion = deliveryRegions.find(
        (region) => region['name'] === value
      );
      if (selectedRegion) {
        setSelectedRegion(selectedRegion);
      }
    }
  };

  useEffect(() => {
    if (
      isDeliveryChargeExists(
        isShipToDifferentAddress
          ? shippingDeliveryCharge &&
              shippingDeliveryCharge.length > 0 &&
              shippingDeliveryCharge
          : billingDeliveryCharge &&
              billingDeliveryCharge.length > 0 &&
              billingDeliveryCharge
      )
    ) {
      const deliveryRegions = isShipToDifferentAddress
        ? shippingDeliveryCharge
        : billingDeliveryCharge;

      const selectedRegion = deliveryRegions.find(
        (region, index) => 0 === index
      );
      if (selectedRegion) {
        setDeliveryRegionName(selectedRegion['name']);
        setSelectedRegion(selectedRegion);
      }
    }
  }, [shippingDeliveryCharge, billingDeliveryCharge]);

  const handleCheckout = async (values, actions) => {
    if (values) {
      if (paymentMethod !== 'cod') {
        const createOrderData = {
          phone: values.phone,
          email: values.email,
          ...(!session['isAuthenticated'] && {
            password: values.password,
            password2: values.passwordConfirmation,
          }),
          address1: values.address1,
          address2: values.address2,
          firstName: values.firstName,
          lastName: values.lastName,
          country: selectedCountryValue.value,
          city: selectedCityValue.value,
          paymentMethod: paymentMethod,
          paymentAccountNumber: values.paymentAccountNumber,
          transactionId: values.transactionId,
          useAccountBillingAddress: isUseAccountBillingAddresss,
          shipToDifferentAddress: isShipToDifferentAddress,
          delivery: selectedRegion['_id'],

          ...(isShipToDifferentAddress && {
            shippingFirstName: values.shippingFirstName,
            shippingLastName: values.shippingLastName,
            shippingCountry: selectedShippingCountryValue.value,
            shippingCity: selectedShippingCityValue.value,
            shippingAddress1: values.shippingAddress1,
            shippingAddress2: values.shippingAddress2,
            shippingPhone: values.shippingPhone,
            shippingEmail: values.shippingEmail,
          }),
        };

        await handleCreateOrderFetch({
          body: createOrderData,
        });

        actions.setSubmitting(false);
      } else {
        const createOrderData = {
          phone: values.phone,
          email: values.email,
          ...(!session['isAuthenticated'] && {
            password: values.password,
            password2: values.passwordConfirmation,
          }),
          address1: values.address1,
          address2: values.address2,
          firstName: values.firstName,
          lastName: values.lastName,
          country: selectedCountryValue.value,
          city: selectedCityValue.value,
          paymentMethod: 'cod',
          useAccountBillingAddress: isUseAccountBillingAddresss,
          shipToDifferentAddress: isShipToDifferentAddress,
          delivery: selectedRegion['_id'],

          ...(isShipToDifferentAddress && {
            shippingFirstName: values.shippingFirstName,
            shippingLastName: values.shippingLastName,
            shippingCountry: selectedShippingCountryValue.value,
            shippingCity: selectedShippingCityValue.value,
            shippingAddress1: values.shippingAddress1,
            shippingAddress2: values.shippingAddress2,
            shippingPhone: values.shippingPhone,
            shippingEmail: values.shippingEmail,
          }),
        };

        await handleCreateOrderFetch({
          body: createOrderData,
        });
        actions.setSubmitting(false);
      }
    }
  };

  const getInitialValues = () => {
    if (session.isAuthenticated) {
      if (paymentMethod === 'cod') {
        return codInitialValues;
      } else {
        return otherPaymentMethodIntialValues;
      }
    } else {
      if (paymentMethod === 'cod') {
        return codInitialNotSigninValues;
      } else {
        return otherPaymentMethodNotSigninIntialValues;
      }
    }
  };

  const getUltimateInitialValue = () => {
    let initialValue = getInitialValues();
    if (isShipToDifferentAddress) {
      initialValue = { ...initialValue, ...shippingAddressInitialValues };
    }

    return initialValue;
  };

  const getValidationSchema = () => {
    if (session.isAuthenticated) {
      if (paymentMethod === 'cod') {
        return validationSchemaForCod;
      } else {
        return validationSchemaForOtherPaymentMethods;
      }
    } else {
      if (paymentMethod === 'cod') {
        return validationSchemaForNotSigninCod;
      } else {
        return validationSchemaForNotSigninOtherPaymentMethods;
      }
    }
  };

  const getUltimateValidationSchema = () => {
    let validationSchema = getValidationSchema();
    if (isShipToDifferentAddress && !isUseAccountBillingAddresss) {
      validationSchema = validationSchema.concat(
        shippingAddressValidationSchema
      );
    } else if (isUseAccountBillingAddresss && !isShipToDifferentAddress) {
      validationSchema = Yup.object();
    } else if (isUseAccountBillingAddresss && isShipToDifferentAddress) {
      return shippingAddressValidationSchema;
    }

    return validationSchema;
  };

  const handleSelectCountryChange = (value) => {
    setSelectedCountryValue(value);
  };

  const handleSelectCityChange = (value) => {
    setSelectedCityValue(value);
  };

  const handleSelectShippingCountryChange = (value) => {
    setSelectedShippingCountryValue(value);
  };

  const handleSelectShippingCityChange = (value) => {
    setSelectedShippingCityValue(value);
  };

  useEffect(() => {
    if (!createOrderState['isLoading']) {
      const error = createOrderState['error'];
      if (error['isError'] && Object.keys(error['error']).length > 0) {
        if (error['error']['registerError']) {
          setServerErrors(error['error']['registerError']);
        } else if (error['error']['checkoutError']) {
          setServerErrors(error['error']['checkoutError']);
        }

        const errors =
          Object.values(error['error']).length > 0
            ? Object.values(error['error'])
            : [];
        errors.forEach((err, i) => {
          if (i === 0) {
            alert.error(err);
          }
        });
      }
    }

    if (
      !createOrderState['isLoading'] &&
      Object.keys(createOrderState.data).length > 0
    ) {
      if (createOrderState['data']['success']) {
        clearCart();
        setIsModalShown(true);
      }
    }
  }, [createOrderState]);

  const getTotalPrice = (total, charge) => {
    if (charge) {
      return parseInt(total) + parseInt(charge);
    } else {
      return Math.floor(total);
    }
  };

  const getPercentage = (percent, total) => {
    return Math.floor((percent / 100) * total);
  };

  const paytotalPrice = (percentTk, total) => {
    return total + percentTk;
  };

  return (
    <>
      {!isAuthLoading && (
        <Formik
          enableReinitialize={isShipToDifferentAddress ? false : true}
          initialValues={getUltimateInitialValue()}
          // @ts-ignore
          onSubmit={(values, actions) => handleCheckout(values, actions)}
          validationSchema={getUltimateValidationSchema()}
          validateOnBlur={false}
        >
          {({
            handleChange,
            values,
            errors,
            isValid,
            isSubmitting,
            handleSubmit,
            touched,
            setFieldTouched,
          }) => (
            <>
              <div className='checkout'>
                <div className='createOrderContainer'>
                  <div>
                    {!session.isAuthenticated ? (
                      <div
                        onClick={() => history.push('/signin')}
                        className='alertText'
                        style={{
                          cursor: 'pointer',
                        }}
                      >
                        <i className='fa fa-exclamation-circle'></i>
                        <h3>Sign in to your account</h3>
                        <span
                          style={{
                            marginLeft: '10px',
                          }}
                        >
                          &rarr;
                        </span>
                      </div>
                    ) : (
                      ''
                    )}
                    <div className='checkoutSection'>
                      <div
                        className='block-title authTitle'
                        style={{
                          margin: '20px 0',
                        }}
                      >
                        <span>Billing Address</span>
                      </div>

                      {session.isAuthenticated ? (
                        <Checkbox
                          name={'useAccountBillingAddresss'}
                          label={'Use Account Billing Addresss'}
                          inputType={'checkbox'}
                          value={'useAccountBillingAddresss'}
                          onChange={(e) =>
                            setIsUseAccountBillingAddresss(e.target.checked)
                          }
                        />
                      ) : (
                        ''
                      )}

                      {!isUseAccountBillingAddresss && (
                        <CheckoutForm
                          isSubmitting={isSubmitting}
                          setFieldTouched={setFieldTouched}
                          values={values}
                          handleChange={handleChange}
                          touched={touched}
                          errors={errors}
                          serverErrors={serverErrors}
                          isAuthenticated={session.isAuthenticated}
                          handleSelectCountryChange={handleSelectCountryChange}
                          selectedCountryValue={selectedCountryValue}
                          countryList={countryList}
                          cityList={cityList}
                          handleSelectCityChange={handleSelectCityChange}
                          selectedCityValue={selectedCityValue}
                          isUseAccountBillingAddresss={
                            isUseAccountBillingAddresss
                          }
                        />
                      )}
                    </div>

                    <div className='checkoutSection'>
                      <div
                        className='block-title authTitle'
                        style={{
                          margin: '20px 0',
                        }}
                      >
                        <span>Shipping Address</span>
                      </div>
                      <Checkbox
                        name={'shipToDifferentAddress'}
                        label={'Ship To Different Address'}
                        inputType={'checkbox'}
                        value={'shipToDifferentAddress'}
                        onChange={(e) =>
                          setIsShipToDifferentAddress(e.target.checked)
                        }
                      />

                      {isShipToDifferentAddress ? (
                        <>
                          <ShippingCheckout
                            setFieldTouched={setFieldTouched}
                            isSubmitting={isSubmitting}
                            values={values}
                            handleChange={handleChange}
                            touched={touched}
                            errors={errors}
                            serverErrors={serverErrors}
                            isAuthenticated={session.isAuthenticated}
                            handleSelectShippingCityChange={
                              handleSelectShippingCityChange
                            }
                            handleSelectShippingCountryChange={
                              handleSelectShippingCountryChange
                            }
                            selectedShippingCityValue={
                              selectedShippingCityValue
                            }
                            selectedShippingCountryValue={
                              selectedShippingCountryValue
                            }
                            shippingCityList={shippingCityList}
                            countryList={countryList}
                          />
                        </>
                      ) : (
                        ''
                      )}
                    </div>

                    <div className='orderOverview'>
                      <div
                        className='block-title authTitle'
                        style={{
                          marginBottom: '40px',
                        }}
                      >
                        <span>Order Overview</span>
                      </div>

                      {cartItems.length > 0 ? (
                        <>
                          <div>
                            {cartItems &&
                              cartItems.length > 0 &&
                              cartItems.map(({ product }) => {
                                return (
                                  <SmallItem
                                    productItem={product}
                                    isOrder={true}
                                    history={history}
                                  />
                                );
                              })}
                          </div>
                          <div className='order-price'>
                            <div
                              className='order-summary-price'
                              style={{
                                paddingBottom: '10px',
                              }}
                            >
                              <h3>{cartItems.length} items in Cart</h3>
                              <span
                                style={{
                                  fontWeight: 500,
                                }}
                              >
                                ৳{totalPrice}
                              </span>
                            </div>

                            <div
                              style={{
                                borderTop: '1px solid #eee',
                              }}
                            >
                              <div
                                className='block-title authTitle'
                                style={{
                                  margin: '10px 0',
                                }}
                              >
                                <span>Delivery Details</span>
                              </div>

                              {isUseAccountBillingAddresss && (
                                <CheckoutForm
                                  isSubmitting={isSubmitting}
                                  setFieldTouched={setFieldTouched}
                                  values={values}
                                  handleChange={handleChange}
                                  touched={touched}
                                  errors={errors}
                                  serverErrors={serverErrors}
                                  isAuthenticated={session.isAuthenticated}
                                  handleSelectCountryChange={
                                    handleSelectCountryChange
                                  }
                                  selectedCountryValue={selectedCountryValue}
                                  countryList={countryList}
                                  cityList={cityList}
                                  handleSelectCityChange={
                                    handleSelectCityChange
                                  }
                                  selectedCityValue={selectedCityValue}
                                  isUseAccountBillingAddresss={
                                    isUseAccountBillingAddresss
                                  }
                                />
                              )}
                              {isDeliveryChargeExists(
                                isShipToDifferentAddress
                                  ? shippingDeliveryCharge &&
                                      shippingDeliveryCharge.length > 0 &&
                                      shippingDeliveryCharge
                                  : billingDeliveryCharge &&
                                      billingDeliveryCharge.length > 0 &&
                                      billingDeliveryCharge
                              ) ? (
                                <>
                                  <div
                                    className='block-title authTitle sm'
                                    style={{
                                      margin: '20px 0',
                                    }}
                                  >
                                    <span>Region List</span>
                                  </div>

                                  <div className='paymentMethods'>
                                    <RadioGroup
                                      onChange={onDeviliveryRegionChange}
                                      value={deliveryRegionName}
                                      horizontal={
                                        windowWidth > 380 ? true : false
                                      }
                                    >
                                      {isShipToDifferentAddress
                                        ? shippingDeliveryCharge &&
                                          shippingDeliveryCharge.length > 0 &&
                                          shippingDeliveryCharge.map((item) => {
                                            return (
                                              <ReversedRadioButton
                                                rootColor={
                                                  'rgba(0, 102, 51, 0.35)'
                                                }
                                                pointColor={'#006633'}
                                                value={item['name']}
                                                padding={10}
                                              >
                                                <div
                                                  style={{
                                                    ...(windowWidth < 380 && {
                                                      width: '100%',
                                                      height: '30px',
                                                    }),
                                                    ...(windowWidth > 380 && {
                                                      width: '20%',
                                                      height: '20px',
                                                    }),
                                                  }}
                                                >
                                                  <h2>{item['name']}</h2>
                                                </div>
                                              </ReversedRadioButton>
                                            );
                                          })
                                        : billingDeliveryCharge &&
                                          billingDeliveryCharge.length > 0 &&
                                          billingDeliveryCharge.map((item) => {
                                            return (
                                              <ReversedRadioButton
                                                rootColor={
                                                  'rgba(0, 102, 51, 0.35)'
                                                }
                                                pointColor={'#006633'}
                                                value={item['name']}
                                                padding={10}
                                              >
                                                <div
                                                  style={{
                                                    ...(windowWidth < 380 && {
                                                      width: '100%',
                                                      height: '30px',
                                                    }),
                                                    ...(windowWidth > 380 && {
                                                      height: '20px',
                                                    }),
                                                  }}
                                                >
                                                  <h2>{item['name']}</h2>
                                                </div>
                                              </ReversedRadioButton>
                                            );
                                          })}
                                    </RadioGroup>
                                  </div>

                                  {selectedRegion &&
                                    Object.keys(selectedRegion).length > 0 && (
                                      <>
                                        {selectedRegion['pickUpLocation'] && (
                                          <div
                                            className='deliveryProps'
                                            style={{
                                              marginTop: '15px',
                                            }}
                                          >
                                            <h3>Pick Up Location : </h3>
                                            <span>
                                              {selectedRegion['pickUpLocation']}
                                            </span>
                                          </div>
                                        )}

                                        {selectedRegion['pickUpLocation'] && (
                                          <div className='deliveryProps'>
                                            <h3>Time : </h3>
                                            <span>
                                              {selectedRegion['time']}
                                            </span>
                                          </div>
                                        )}

                                        {selectedRegion['charge'] && (
                                          <div className='deliveryProps'>
                                            <h3>Delivery Charge : </h3>
                                            <span>
                                              ৳
                                              {getDeliveryChargeTotal(
                                                selectedRegion,
                                                totalPrice
                                              ) || 0}
                                            </span>
                                          </div>
                                        )}
                                      </>
                                    )}
                                </>
                              ) : (
                                <div className='order-summary-price'>
                                  <h3>
                                    Delivery is not available in your area
                                  </h3>
                                </div>
                              )}
                            </div>

                            {deliveryChargeState.isLoading && <Spinner />}
                          </div>
                          <div className='deliveryProps'>
                            <h3>Total : </h3>
                            <span>
                              ৳
                              {selectedRegion &&
                              Object.keys(selectedRegion).length > 0
                                ? getTotalPrice(
                                    totalPrice,
                                    getDeliveryChargeTotal(
                                      selectedRegion,
                                      totalPrice
                                    ) || 0
                                  )
                                : totalPrice}
                            </span>
                          </div>

                          <div className='checkoutSection'>
                            <div
                              className='block-title authTitle'
                              style={{
                                margin: '20px 0',
                              }}
                            >
                              <span>Payment Methods</span>
                            </div>

                            <div className='paymentMethods'>
                              <RadioGroup
                                onChange={onRadioGroupChange}
                                value={paymentMethod}
                                horizontal={windowWidth > 380 ? true : false}
                              >
                                <ReversedRadioButton
                                  rootColor={'rgba(0, 102, 51, 0.35)'}
                                  pointColor={'#006633'}
                                  value='cod'
                                  padding={9}
                                >
                                  <div
                                    style={{
                                      ...(windowWidth < 380 && {
                                        width: '100%',
                                        height: '20px',
                                      }),
                                    }}
                                  ></div>
                                  Cash on Delivery
                                </ReversedRadioButton>
                                <ReversedRadioButton
                                  rootColor={'rgba(0, 102, 51, 0.35)'}
                                  pointColor={'#006633'}
                                  value='nagad'
                                  padding={12}
                                >
                                  <div
                                    style={{
                                      ...(windowWidth < 380 && {
                                        width: '100%',
                                        height: '30px',
                                      }),
                                      ...(windowWidth > 380 && {
                                        height: '20px',
                                      }),
                                    }}
                                  >
                                    <img
                                      alt='paymentImg'
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                      }}
                                      src={require('../../assets/paymentMethodImages/nagadIcon.png')}
                                    />
                                  </div>
                                </ReversedRadioButton>
                                <ReversedRadioButton
                                  rootColor={'rgba(0, 102, 51, 0.35)'}
                                  pointColor={'#006633'}
                                  value='rocket'
                                  padding={12}
                                >
                                  <div
                                    style={{
                                      ...(windowWidth < 380 && {
                                        width: '100%',
                                        height: '30px',
                                      }),
                                      ...(windowWidth > 380 && {
                                        height: '20px',
                                      }),
                                    }}
                                  >
                                    <img
                                      alt='paymentImg'
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                      }}
                                      src={require('../../assets/paymentMethodImages/rocketIcon.jpg')}
                                    />
                                  </div>
                                </ReversedRadioButton>
                                <ReversedRadioButton
                                  rootColor={'rgba(0, 102, 51, 0.35)'}
                                  pointColor={'#006633'}
                                  value='bkash'
                                  padding={12}
                                >
                                  <div
                                    style={{
                                      ...(windowWidth < 380 && {
                                        width: '100%',
                                        height: '30px',
                                      }),
                                      ...(windowWidth > 380 && {
                                        height: '20px',
                                      }),
                                    }}
                                  >
                                    <img
                                      alt='paymentImg'
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                      }}
                                      src={require('../../assets/paymentMethodImages/bkashIcon.png')}
                                    />
                                  </div>
                                </ReversedRadioButton>
                              </RadioGroup>
                            </div>

                            {paymentMethod !== 'cod' && (
                              <div className='paymentMethodInstruction'>
                                <div className='paymentMethodInstruction-item'>
                                  <h3>Send </h3>
                                  <span>
                                    ৳
                                    {paymentMethod === 'bkash'
                                      ? paytotalPrice(
                                          getPercentage(
                                            1.9,
                                            selectedRegion &&
                                              Object.keys(selectedRegion)
                                                .length > 0
                                              ? getTotalPrice(
                                                  totalPrice,
                                                  getDeliveryChargeTotal(
                                                    selectedRegion,
                                                    totalPrice
                                                  ) || 0
                                                )
                                              : totalPrice
                                          ),
                                          selectedRegion &&
                                            Object.keys(selectedRegion).length >
                                              0
                                            ? getTotalPrice(
                                                totalPrice,
                                                getDeliveryChargeTotal(
                                                  selectedRegion,
                                                  totalPrice
                                                ) || 0
                                              )
                                            : totalPrice
                                        )
                                      : ''}
                                    {paymentMethod === 'rocket'
                                      ? paytotalPrice(
                                          getPercentage(
                                            1.8,
                                            selectedRegion &&
                                              Object.keys(selectedRegion)
                                                .length > 0
                                              ? getTotalPrice(
                                                  totalPrice,
                                                  getDeliveryChargeTotal(
                                                    selectedRegion,
                                                    totalPrice
                                                  ) || 0
                                                )
                                              : totalPrice
                                          ),
                                          selectedRegion &&
                                            Object.keys(selectedRegion).length >
                                              0
                                            ? getTotalPrice(
                                                totalPrice,
                                                getDeliveryChargeTotal(
                                                  selectedRegion,
                                                  totalPrice
                                                ) || 0
                                              )
                                            : totalPrice
                                        )
                                      : ''}
                                    {paymentMethod === 'nagad'
                                      ? paytotalPrice(
                                          getPercentage(
                                            1.5,
                                            selectedRegion &&
                                              Object.keys(selectedRegion)
                                                .length > 0
                                              ? getTotalPrice(
                                                  totalPrice,
                                                  getDeliveryChargeTotal(
                                                    selectedRegion,
                                                    totalPrice
                                                  ) || 0
                                                )
                                              : totalPrice
                                          ),
                                          selectedRegion &&
                                            Object.keys(selectedRegion).length >
                                              0
                                            ? getTotalPrice(
                                                totalPrice,
                                                getDeliveryChargeTotal(
                                                  selectedRegion,
                                                  totalPrice
                                                ) || 0
                                              )
                                            : totalPrice
                                        )
                                      : ''}
                                  </span>{' '}
                                  <h3>
                                    {' '}
                                    (৳
                                    {paymentMethod === 'bkash' &&
                                      getPercentage(
                                        1.9,
                                        selectedRegion &&
                                          Object.keys(selectedRegion).length > 0
                                          ? getTotalPrice(
                                              totalPrice,
                                              getDeliveryChargeTotal(
                                                selectedRegion,
                                                totalPrice
                                              ) || 0
                                            )
                                          : totalPrice
                                      )}
                                    {paymentMethod === 'nagad' &&
                                      getPercentage(
                                        1.5,
                                        selectedRegion &&
                                          Object.keys(selectedRegion).length > 0
                                          ? getTotalPrice(
                                              totalPrice,
                                              getDeliveryChargeTotal(
                                                selectedRegion,
                                                totalPrice
                                              ) || 0
                                            )
                                          : totalPrice
                                      )}
                                    {paymentMethod === 'rocket' &&
                                      getPercentage(
                                        1.8,
                                        selectedRegion &&
                                          Object.keys(selectedRegion).length > 0
                                          ? getTotalPrice(
                                              totalPrice,
                                              getDeliveryChargeTotal(
                                                selectedRegion,
                                                totalPrice
                                              ) || 0
                                            )
                                          : totalPrice
                                      )}
                                    )
                                  </h3>
                                  <h3>To</h3>
                                  <span>
                                    {paymentMethod === 'bkash' &&
                                      dictionary.bkashNumber}
                                    {paymentMethod === 'nagad' &&
                                      dictionary.nagadNumber}
                                    {paymentMethod === 'rocket' &&
                                      dictionary.rocketNumber}
                                  </span>
                                </div>

                                <div className='paymentMethodInstruction-item'>
                                  <h3>
                                    Enter your Payment Mobile Number and
                                    Transaction Id below
                                  </h3>
                                </div>
                              </div>
                            )}

                            <PaymentForm
                              isSubmitting={isSubmitting}
                              paymentMethod={paymentMethod}
                              values={values}
                              handleChange={handleChange}
                              errors={errors}
                              serverErrors={serverErrors}
                              setFieldTouched={setFieldTouched}
                              touched={touched}
                            />
                          </div>
                        </>
                      ) : (
                        <div
                          style={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <p
                            style={{
                              letterSpacing: '-1px',
                              marginBottom: '20px',
                              fontSize: '20px',
                              fontWeight: 600,
                            }}
                          >
                            Your Cart is empty
                          </p>
                          <button
                            className='clear-cart banner-btn'
                            onClick={() => {
                              history.push('/');
                            }}
                          >
                            Add Products
                          </button>
                        </div>
                      )}
                    </div>

                    {isDeliveryChargeExists(
                      isShipToDifferentAddress
                        ? shippingDeliveryCharge &&
                            shippingDeliveryCharge.length > 0 &&
                            shippingDeliveryCharge
                        : billingDeliveryCharge &&
                            billingDeliveryCharge.length > 0 &&
                            billingDeliveryCharge
                    ) ? (
                      ''
                    ) : (
                      <div className='alertText'>
                        <i className='fa fa-exclamation-circle'></i>
                        <h3>Delivery is not available in your area</h3>
                      </div>
                    )}
                    <div
                      style={{
                        width: '200px',
                        marginTop: '15px',
                      }}
                    >
                      <AuthButton
                        onclick={handleSubmit}
                        disabled={
                          !isValid ||
                          !isDeliveryChargeExists(
                            isShipToDifferentAddress
                              ? shippingDeliveryCharge &&
                                  shippingDeliveryCharge.length > 0 &&
                                  shippingDeliveryCharge
                              : billingDeliveryCharge &&
                                  billingDeliveryCharge.length > 0 &&
                                  billingDeliveryCharge
                          ) ||
                          !(cartItems.length > 0)
                        }
                      >
                        {isSubmitting ? 'Ordering...' : 'Place Order'}
                      </AuthButton>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </Formik>
      )}

      {isAuthLoading && <Spinner />}
      <CheckoutSuccessModal
        isModalShown={isModalShown}
        handleCloseModal={handleCloseModal}
      />
    </>
  );
};

const mapDispatchToProps = {
  logout: sessionOperations.logout,
  addItemToCache: cacheOperations.addItemToCache,
  clearCart: cartOperations.clearCart,
};

const mapStateToProps = (state) => ({
  cartItems: state.cart,
  totalPrice: cartSelectors.getTotalPriceOfCartItems(state.cart),
  session: state.session,
  cache: state.cache,
});

// @ts-ignore
export default connect(
  mapStateToProps,
  mapDispatchToProps
  // @ts-ignore
)(withRouter(withAlert()(Checkout)));

/* 
Form kinds: 

1. if useAccountBillingAddresss,true,then from frontend following fields will be sent => 
 paymentMethod, transactionId, paymentAccountNumber
	// note about use billing address:
		useAccountBillingAddresss checkboxbox, will not be shown, if user is not signin. 
		if useAccountBillingAddresss checkbox is true, then billing billing address related/fields
		will be hidden. 
		

2. if shipToDifferentAddress,true,then from frontend following fields will be sent => 
shippingFirstName, shippingLastName, shippingCountry, shippingCity,  shippingAddress1,shippingAddress2, 
shippingZipCode, shippingPhone, shippingEmail, shippingAdditionalInfo
	// note about use shipToDifferentAddress:
	if shipToDifferentAddress is true, then fields related to shipToDifferentAddress will be shown 
	otherwise they will be hidden. 


3. if the user is not signed in then, fields related to billing address will be shown,with 2 additional fields: 
password, password2	


// shipToDifferentAddress and useAccountBillingAddresss they both can be true together. 

// ccart/update/remove/:cartkey


if billing address is false, then delivery charge will be based on shipping address
if shipping address is false, then delivery charge will be based on billing address
if both billing address and shipping address are true, then delivery charge will be based on shipping address

*/
