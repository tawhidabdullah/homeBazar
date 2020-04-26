import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Select from 'react-select';
import { TextFeildGroup } from '../../../components/Field';
import { useHandleFetch } from '../../../hooks';
import { AuthButton } from '../../../components/Button';
import { checkIfItemExistsInCache } from '../../../utils';
import { cacheOperations } from '../../../state/ducks/cache';
import { withAlert } from 'react-alert';

const personalInfoInitialValues = {
  firstName: '',
  lastName: '',
  address1: '',
  address2: '',
};

const contactInfoInitialValues = {
  phone: '',
  email: '',
};

const changePasswordInitialValues = {
  password: '',
  newPassword: '',
  newPassword2: '',
};

const personalInfoValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .label('Name')
    .required()
    .min(2, 'First name must have at least 2 characters '),
  lastName: Yup.string()
    .label('Name')
    .required()
    .min(2, 'First name must have at least 2 characters '),
  address1: Yup.string()
    .label('Address line 1')
    .required()
    .min(3, 'Address line 1 must have at least 3 characters '),
});

const contactInfoSchema = Yup.object().shape({
  phone: Yup.string().required(),
  email: Yup.string().label('Email').email('Enter a valid email'),
});

const changePasswordSchema = Yup.object().shape({
  password: Yup.string()
    .label('Old Password')
    .required('Old Password must have at least 6 characters'),
  newPassword: Yup.string()
    .label('New Password')
    .required()
    .min(6, 'New Password must have at least 6 characters'),
  newPassword2: Yup.string()
    .label('Confirm New password')
    .required()
    .min(6, 'Confirm New password must have at least 6 characters')
    .oneOf(
      [Yup.ref('newPassword'), null],
      'Confirm new password must match to new password'
    ),
});

interface Props {
  customerDetail: any;
  cache?: any;
  addItemToCache?: (any) => void;
  alert?: any;
}

const MyAccount = ({ customerDetail, cache, addItemToCache, alert }: Props) => {
  const [isPersonalInfoEdit, setIsPersonalInfoEdit] = useState(false);
  const [iscontactInfoEdit, setIsContactInfoEdit] = useState(false);
  const [isChangePasswordEdit, setIsChangePasswordEdit] = useState(false);
  const [customerData, setCustomerData] = useState(customerDetail);
  const [
    updateCurrentCustomerData,
    handleUpdateCurrentUserData,
  ] = useHandleFetch({}, 'updateCurrentCustomerData');

  const [changePasswordState, handleChangePasswordFetch] = useHandleFetch(
    {},
    'changePassword'
  );

  const [selectedCountryValue, setSelectedCountryValue] = React.useState({
    value: 'Bangladesh',
    label: 'Bangladesh',
  });

  const [selectedCityValue, setSelectedCityValue] = React.useState({
    value: 'city',
    label: 'City',
  });

  const [countryListState, handleCountryListFetch] = useHandleFetch(
    [],
    'countryList'
  );

  const [cityListState, handleCityListFetch] = useHandleFetch([], 'cityList');

  const [countryList, setCountryList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const handleUpdateProfileData = async (updatedValues, actions, type) => {
    const updatedCustomerRes = await handleUpdateCurrentUserData({
      body: {
        ...updatedValues,
        country: selectedCountryValue.value,
        city: selectedCityValue.value,
      },
    });

    if (updatedCustomerRes['status'] === 'ok') {
      setCustomerData({
        ...updatedValues,
        country: selectedCountryValue.value,
        city: selectedCityValue.value,
      });
      if (type === 'personalinfo') {
        setIsPersonalInfoEdit(false);
      } else if (type === 'contact') {
        setIsContactInfoEdit(false);
      }
    }

    actions.setSubmitting(false);
  };

  const handleChangePassword = async (values, actions) => {
    const changePasswordRes = await handleChangePasswordFetch({
      body: {
        ...values,
      },
    });

    // @ts-ignore
    if (changePasswordRes['status'] === 'ok') {
      alert.success('Password has been changed successfully');

      setIsChangePasswordEdit(false);
    }

    actions.setSubmitting(false);
  };

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
          addItemToCache &&
            addItemToCache({
              countryList: countryList,
            });
        }
      };

      getAndSetCountryList();
    }
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
          addItemToCache &&
            addItemToCache({
              [`cityList/${selectedCountryValue.value}`]: cityList,
            });
        }
      };

      getAndSetCityList();
    }
  }, [selectedCountryValue]);

  const handleSelectCountryChange = (value) => {
    setSelectedCountryValue(value);
  };

  const handleSelectCityChange = (value) => {
    setSelectedCityValue(value);
  };

  return (
    <div className='myAccount'>
      <div className='myAccountSectionHeader'>
        <h2 className='myAccountSectionHeader-main'>Personal Information</h2>
        <h2
          className='myAccountSectionHeader-button'
          onClick={() => setIsPersonalInfoEdit((value) => !value)}
        >
          {isPersonalInfoEdit ? 'Remove Edit' : 'Change Information'}
        </h2>
      </div>
      <div className='myAccountSectionForm'>
        {isPersonalInfoEdit && (
          <Formik
            initialValues={
              isPersonalInfoEdit &&
              customerData &&
              Object.keys(customerData).length > 0
                ? customerData
                : personalInfoInitialValues
            }
            onSubmit={(values, actions) =>
              handleUpdateProfileData(values, actions, 'personalinfo')
            }
            validationSchema={personalInfoValidationSchema}
            validateOnBlur={false}
            enableReinitialize={true}
          >
            {({
              handleChange,
              values,
              handleSubmit,
              errors,
              isValid,
              isSubmitting,
              touched,
              handleBlur,
              setFieldTouched,
            }) => (
              <>
                <div className='formContainerOfTwo'>
                  <div className='formContainerOfTwoItem'>
                    <TextFeildGroup
                      label='FirstName'
                      name='firstName'
                      placeholder='FirstName'
                      type='text'
                      value={values.firstName}
                      onChange={(e) => {
                        handleChange(e);
                        setFieldTouched('firstName');
                      }}
                      errors={
                        (touched.firstName && errors.firstName) ||
                        (!isSubmitting &&
                          updateCurrentCustomerData.error['error']['firstName'])
                      }
                    />
                  </div>
                  <div className='formContainerOfTwoItem'>
                    <TextFeildGroup
                      label='Lastname'
                      name='lastName'
                      placeholder='Lastname'
                      type='text'
                      value={values.lastName}
                      onChange={(e) => {
                        handleChange(e);
                        setFieldTouched('lastName');
                      }}
                      errors={
                        (touched.lastName && errors.lastName) ||
                        (!isSubmitting &&
                          updateCurrentCustomerData.error['error']['lastName'])
                      }
                    />
                  </div>
                </div>

                <div className='formContainerOfTwo'>
                  <div className='formContainerOfTwoItem'>
                    {countryList.length > 0 && (
                      <div>
                        <label className='formLabel'>Country</label>
                        <Select
                          value={selectedCountryValue}
                          onChange={(value) => handleSelectCountryChange(value)}
                          options={countryList.map((country) => ({
                            value: country['name'],
                            label: country['name'],
                          }))}
                        />

                        <div className='select-invalid-feedback'>
                          {errors.country ||
                            (!isSubmitting &&
                              updateCurrentCustomerData.error['error'][
                                'country'
                              ])}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className='formContainerOfTwoItem'>
                    {cityList.length > 0 && (
                      <div>
                        <label className='formLabel'>City</label>
                        <Select
                          value={selectedCityValue}
                          onChange={(value) => handleSelectCityChange(value)}
                          options={cityList.map((city) => ({
                            value: city['name'],
                            label: city['name'],
                          }))}
                        />
                        <div className='select-invalid-feedback'>
                          {errors.city ||
                            (!isSubmitting &&
                              updateCurrentCustomerData.error['error']['city'])}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <TextFeildGroup
                  label='Address'
                  name='address1'
                  placeholder='Address line 1'
                  type='text'
                  value={values.address1}
                  onChange={(e) => {
                    handleChange(e);
                    setFieldTouched('address1');
                  }}
                  errors={
                    (touched.address1 && errors.address1) ||
                    (!isSubmitting &&
                      updateCurrentCustomerData.error['error']['address1'])
                  }
                />
                <TextFeildGroup
                  name='address2'
                  placeholder='Address line 2'
                  type='text'
                  value={values.address2}
                  onChange={(e) => {
                    handleChange(e);
                    setFieldTouched('address2');
                  }}
                  errors={
                    (touched.address2 && errors.address2) ||
                    (!isSubmitting &&
                      updateCurrentCustomerData.error['error']['address2'])
                  }
                />

                <div
                  style={{
                    width: '100px',
                  }}
                >
                  <AuthButton
                    onclick={handleSubmit}
                    disabled={
                      !isValid ||
                      !values.firstName ||
                      !values.lastName ||
                      !values.address1
                    }
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </AuthButton>
                </div>
              </>
            )}
          </Formik>
        )}

        {!isPersonalInfoEdit &&
          customerData &&
          Object.keys(customerData).length > 0 && (
            <>
              {customerData['firstName'] && !customerData['lastName'] && (
                <TextFeildGroup
                  label='Firstname'
                  name='firstName'
                  value={customerData['firstName']}
                  disabled={true}
                />
              )}

              {customerData['lastName'] && !customerData['firstName'] && (
                <TextFeildGroup
                  label='Lastname'
                  name='lastname'
                  value={customerData['lastName']}
                  disabled={true}
                />
              )}

              {customerData['country'] && !customerData['city'] && (
                <TextFeildGroup
                  label='Country'
                  name='country'
                  value={customerData['country']}
                  disabled={true}
                />
              )}

              {customerData['city'] && !customerData['country'] && (
                <TextFeildGroup
                  label='City'
                  name='city'
                  value={customerData['city']}
                  disabled={true}
                />
              )}

              {customerData['firstName'] && customerData['lastName'] && (
                <div className='formContainerOfTwo'>
                  <div className='formContainerOfTwoItem'>
                    <TextFeildGroup
                      label='Firstname'
                      name='firstName'
                      value={customerData['firstName']}
                      disabled={true}
                    />
                  </div>
                  <div className='formContainerOfTwoItem'>
                    <TextFeildGroup
                      label='Lastname'
                      name='lastname'
                      value={customerData['lastName']}
                      disabled={true}
                    />
                  </div>
                </div>
              )}

              {customerData['country'] && customerData['city'] && (
                <div className='formContainerOfTwo'>
                  <div className='formContainerOfTwoItem'>
                    <TextFeildGroup
                      label='Country'
                      name='country'
                      value={customerData['country']}
                      disabled={true}
                    />
                  </div>
                  <div className='formContainerOfTwoItem'>
                    <TextFeildGroup
                      label='City'
                      name='city'
                      value={customerData['city']}
                      disabled={true}
                    />
                  </div>
                </div>
              )}
            </>
          )}

        {customerData['address1'] && (
          <TextFeildGroup
            label='Address line 1'
            name='address1'
            value={customerData['address1']}
            disabled={true}
          />
        )}

        {customerData['address2'] && (
          <TextFeildGroup
            label='Address line 2'
            name='address2'
            value={customerData['address2']}
            disabled={true}
          />
        )}
      </div>

      <div className='myAccountSectionHeader'>
        <h2 className='myAccountSectionHeader-main'>Contact Information</h2>
        <h2
          className='myAccountSectionHeader-button'
          onClick={() => setIsContactInfoEdit((value) => !value)}
        >
          {iscontactInfoEdit ? 'Remove Edit' : 'Change Information'}
        </h2>
      </div>
      <div className='myAccountSectionForm'>
        {iscontactInfoEdit && (
          <Formik
            initialValues={
              iscontactInfoEdit && Object.keys(customerData).length > 0
                ? customerData
                : contactInfoInitialValues
            }
            onSubmit={(values, actions) =>
              handleUpdateProfileData(values, actions, 'contact')
            }
            validationSchema={contactInfoSchema}
            validateOnBlur={false}
            enableReinitialize={true}
          >
            {({
              handleChange,
              values,
              handleSubmit,
              errors,
              isValid,
              isSubmitting,
              touched,
              handleBlur,
              setFieldTouched,
            }) => (
              <>
                <TextFeildGroup
                  label='Phone'
                  name='phone'
                  placeholder='Enter your phone'
                  type='text'
                  value={values.phone}
                  onChange={(e) => {
                    handleChange(e);
                    setFieldTouched('phone');
                  }}
                  errors={
                    (touched.phone && errors.phone) ||
                    (!isSubmitting &&
                      updateCurrentCustomerData.error['error']['phone'])
                  }
                />

                <TextFeildGroup
                  label='Email'
                  name='email'
                  placeholder='Enter your email'
                  type='text'
                  value={values.email}
                  onChange={(e) => {
                    handleChange(e);
                    setFieldTouched('email');
                  }}
                  errors={
                    (touched.email && errors.email) ||
                    (!isSubmitting &&
                      updateCurrentCustomerData.error['error']['email'])
                  }
                />

                <div
                  style={{
                    width: '100px',
                  }}
                >
                  <AuthButton
                    onclick={handleSubmit}
                    disabled={!isValid || !values.phone}
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </AuthButton>
                </div>
              </>
            )}
          </Formik>
        )}

        {!iscontactInfoEdit && Object.keys(customerData).length > 0 && (
          <>
            {customerData['phone'] && (
              <TextFeildGroup
                label='Phone'
                name='phone'
                value={customerData['phone']}
                disabled={true}
              />
            )}

            {customerData['email'] && (
              <TextFeildGroup
                label='Email'
                name='email'
                value={customerData['email']}
                disabled={true}
              />
            )}
          </>
        )}
      </div>

      <div className='myAccountSectionHeader'>
        <h2 className='myAccountSectionHeader-main'>Change Password</h2>
        <h2
          className='myAccountSectionHeader-button'
          onClick={() => setIsChangePasswordEdit((value) => !value)}
        >
          {isChangePasswordEdit ? 'Remove Edit' : 'Change Password'}
        </h2>
      </div>

      {isChangePasswordEdit && (
        <Formik
          initialValues={
            isChangePasswordEdit && Object.keys(customerData).length > 0
              ? customerData
              : changePasswordInitialValues
          }
          onSubmit={(values, actions) => handleChangePassword(values, actions)}
          validationSchema={changePasswordSchema}
          validateOnBlur={false}
          enableReinitialize={true}
        >
          {({
            handleChange,
            values,
            handleSubmit,
            errors,
            isValid,
            isSubmitting,
            touched,
            handleBlur,
            setFieldTouched,
          }) => (
            <>
              <TextFeildGroup
                label='Old Password'
                name='password'
                placeholder='old password'
                type='password'
                value={values.password}
                onChange={(e) => {
                  handleChange(e);
                  setFieldTouched('password');
                }}
                errors={
                  (touched.password && errors.password) ||
                  (!isSubmitting &&
                    changePasswordState.error['error']['password'])
                }
              />

              <TextFeildGroup
                label='New Password'
                name='newPassword'
                placeholder='New Password'
                type='password'
                value={values.newPassword}
                onChange={(e) => {
                  handleChange(e);
                  setFieldTouched('newPassword');
                }}
                errors={
                  (touched.newPassword && errors.newPassword) ||
                  (!isSubmitting &&
                    changePasswordState.error['error']['newPassword'])
                }
              />

              <TextFeildGroup
                label='Confirm New Password'
                name='newPassword2'
                placeholder='Confirm New Password'
                type='password'
                value={values.newPassword2}
                onChange={(e) => {
                  handleChange(e);
                  setFieldTouched('newPassword2');
                }}
                errors={
                  (touched.newPassword2 && errors.newPassword2) ||
                  (!isSubmitting &&
                    changePasswordState.error['error']['newPassword2'])
                }
              />

              <div
                style={{
                  width: '100px',
                }}
              >
                <AuthButton
                  onclick={handleSubmit}
                  disabled={
                    !isValid ||
                    !values.password ||
                    !values.newPassword ||
                    !values.newPassword2
                  }
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </AuthButton>
              </div>
            </>
          )}
        </Formik>
      )}
    </div>
  );
};

const mapDispatchToProps = {
  addItemToCache: cacheOperations.addItemToCache,
};

const mapStateToProps = (state) => ({
  cache: state.cache,
});

// @ts-ignore
export default connect(
  mapStateToProps,
  mapDispatchToProps
  // @ts-ignore
)(withAlert()(MyAccount));
