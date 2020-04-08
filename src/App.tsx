import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

// import Layout
import Header from './layout/Header';

// import Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import ProductList from './pages/ProductList';
import ProductSearch from './pages/ProductSearch';
import ShoppingCart from './pages/ShoppingCart';
import Signin from './pages/Auth/Signin';
import Signup from './pages/Auth/Signup';
import Checkout from './pages/Checkout';
import Dashboard from './Dashboard';
import { NotFoundPage } from './pages/NotFound';
import Footer from './layout/Footer';

const App = () => {
  return (
    <BrowserRouter>
      <React.Fragment>
        <Header />
        <Switch>
          <Route exact path={'/'} component={Home} />

          <Route
            exact
            path={'/product/:categoryName/:productName'}
            component={ProductDetail}
          />

          <Route
            exact
            path='/products'
            render={() => <Redirect to='/productList/all' />}
          />

          <Route
            exact
            path='/productList'
            render={() => <Redirect to='/productList/all' />}
          />
          <Route exact path={'/productList/:id'} component={ProductList} />
          <Route exact path={'/productSearch'} component={ProductSearch} />

          <Route exact path={'/cart'} component={ShoppingCart} />

          <Route exact path='/signin' component={Signin} />
          <Route exact path='/signup' component={Signup} />
          <Route exact path={'/checkout'} component={Checkout} />

          <Route exact path={'/dashboard'} component={Dashboard} />

          <Route path='*' component={NotFoundPage} />
        </Switch>
        <Footer />
      </React.Fragment>
    </BrowserRouter>
  );
};
export default App;
