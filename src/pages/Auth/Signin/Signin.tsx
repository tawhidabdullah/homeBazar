import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import { AuthButton } from '../../../components/Button';
import * as Yup from 'yup';
import { useHandleFetch } from '../../../hooks';
import { sessionOperations } from '../../../state/ducks/session';
import { withAlert } from 'react-alert';
import dictionary from '../../../dictionary';

// import input fields
import { TextFeildGroup } from '../../../components/Field';

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .label('Username')
    .required('Username is required')
    .min(3, 'Username must have at least 3 characters'),

  password: Yup.string().label('Password').required('Password is required'),
});

const initialValues = {
  username: '',
  password: '',
};

interface Props {
  history: any;
  login: () => void;
  alert: any;
}

const Signin = (props: Props) => {
  const [signinState, handlePost] = useHandleFetch({}, 'signin');

  const handleSubmit = async (values, actions) => {
    const signinRes = await handlePost({
      body: {
        username: values.username,
        password: values.password,
      },
    });

    // @ts-ignore
    if (signinRes && signinRes['status'] === 'ok') {
      props.login();
      props.history.push('/dashboard');
      actions.resetForm({});
    } else {
      // @ts-ignore
      if (
        signinState.error['isError'] &&
        !(Object.keys(signinState.error['error']).length > 0)
      ) {
        actions.resetForm({});
        props.alert.error('Something went wrong');
      }
    }

    actions.setSubmitting(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  return (
    <div className='auth'>
      <h1 className='display-4 text-center auth_title'>Signin</h1>
      <p className='lead text-center authSubTitle'>{dictionary.signinTitle}</p>
      <div className='formContainer'>
        <Formik
          initialValues={{ ...initialValues }}
          onSubmit={(values, actions) => handleSubmit(values, actions)}
          validationSchema={validationSchema}
          validateOnBlur={false}
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
            handleReset,
          }) => (
              <>
                <TextFeildGroup
                  label='Phone or Email'
                  name='username'
                  placeholder='phone or email address..'
                  type='text'
                  value={values.username}
                  onChange={(e) => {
                    handleChange(e);
                    setFieldTouched('username');
                  }}
                  errors={
                    (touched.username && errors.username) ||
                    (!isSubmitting && signinState.error['error']['username'])
                  }
                />

                <TextFeildGroup
                  label='Password'
                  name='password'
                  placeholder='Enter your password'
                  type='password'
                  value={values.password}
                  onChange={(e) => {
                    handleChange(e);
                    setFieldTouched('password');
                  }}
                  errors={
                    (touched.password && errors.password) ||
                    (!isSubmitting && signinState.error['error']['password'])
                  }
                />

                <AuthButton
                  onclick={handleSubmit}
                  disabled={!isValid || !values.username || !values.password}
                >
                  {isSubmitting ? 'Signin...' : 'Signin'}
                </AuthButton>
              </>
            )}
        </Formik>
      </div>
      <p className='lead text-center authtextInfo'>
        Don't have an account?{' '}
        <span
          className='authLink'
          onClick={() => props.history.push('/signup')}
        >
          Signup{' '}
        </span>
      </p>
    </div>
  );
};

const mapDispatchToProps = {
  login: sessionOperations.login,
};

// @ts-ignore
export default connect(
  null,
  mapDispatchToProps
  // @ts-ignore
)(withRouter(withAlert()(Signin)));
