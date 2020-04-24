// @ts-nocheck
import React, { useEffect, useState } from 'react';
import SmallItem from '../../../components/SmallItem';
import { numberWithCommas } from '../../../utils';
import Moment from 'react-moment';
import { withRouter } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useHandleFetch } from '../../../hooks';
import { Spinner } from '../../../components/Loading';

const Order = ({ history }) => {
  const [orderListState, handleOrderListStateFetch] = useHandleFetch(
    [],
    'getCurrentUserOrders'
  );

  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(1);

  const [orders, setOrders] = useState([]);
  const [isNext, setIsNext] = useState(true);

  useEffect(() => {
    const getAndSetOrders = async () => {
      setIsLoading(true);
      const newOrdersRes = await handleOrderListStateFetch({
        urlOptions: {
          params: {
            limitNumber: 2,
            pageNumber: pageNumber,
          },
        },
      });

      // @ts-ignore
      const newOrders = newOrdersRes.data || [];
      // @ts-ignore
      const isNext = newOrdersRes.isNext || null;
      setIsNext(isNext);

      // @ts-ignore
      if (newOrders) {
        // @ts-ignore
        setOrders(newOrders);
      }
      setIsLoading(false);
    };

    getAndSetOrders();
  }, []);

  const getAndSetInfiniteOrders = async (pageNumber) => {
    if (pageNumber > 1) {
      const newOrdersRes = await handleOrderListStateFetch({
        urlOptions: {
          params: {
            limitNumber: 2,
            pageNumber: pageNumber,
          },
        },
      });

      // @ts-ignore
      const newOrders = newOrdersRes.data || [];
      // @ts-ignore
      const isNext = newOrdersRes.isNext || null;
      setIsNext(isNext);

      if (orders.length > 0) {
        // @ts-ignore
        if (newOrders.length > 0) {
          // @ts-ignore
          const myOrders = [...orders, ...newOrders];
          // @ts-ignore
          setOrders(myOrders);
        } else {
          // @ts-ignore
          setOrders(orders);
        }
      } else {
        // @ts-ignore
        setOrders(orders);
      }
    }
  };

  const fetchMoreProductsData = () => {
    getAndSetInfiniteOrders(pageNumber + 1);

    setPageNumber((pageNumber) => pageNumber + 1);
  };

  return (
    <div className='order'>
      <div
        className='block-title ordertitle'
        style={{
          marginBottom: '20px',
        }}
      >
        <span>Orders</span>
      </div>

      {!isLoading && orders.length > 0 && (
        <InfiniteScroll
          style={{
            overflow: 'hidden',
          }}
          dataLength={orders.length}
          next={fetchMoreProductsData}
          hasMore={isNext !== null}
          loader={
            <div
              style={{ width: '100%', textAlign: 'center', margin: '10px 0' }}
            >
              <h4
                style={{
                  textAlign: 'center',
                }}
              >
                Loading...
              </h4>{' '}
            </div>
          }
        >
          {orders.map((order, index) => {
            return (
              <div className='orderDetailsContainer'>
                <div className='orderDetailItem'>
                  <div className='orderDetailHeader'>
                    <div className='orderDetailHeader_Item'>
                      <h2> #{index + 1} </h2>
                    </div>

                    <div className='orderDetailHeader_Item'>
                      <h2>Payment Method</h2>
                      <h3>
                        {order['paymentMethod'] === 'cod'
                          ? 'Cash On Delivery'
                          : order['paymentMethod']}
                      </h3>
                    </div>

                    <div className='orderDetailHeader_Item'>
                      <h2>Status</h2>
                      <h3>{order['status']}</h3>
                    </div>
                  </div>
                  <div className='orderDetailProducts'>
                    {order['products'].length > 0 &&
                      order['products'].map((product) => {
                        return (
                          <div className='orderDetailProduct'>
                            <SmallItem
                              productId={product._id}
                              quantity={product.quantity}
                              isOrderDetails={true}
                              history={history}
                            />
                          </div>
                        );
                      })}
                  </div>

                  <div className='orderDetailFooter'>
                    <div className='orderDetailHeader_Item'>
                      <h3>
                        <Moment format='YYYY/MM/DD'>{order.date}</Moment>
                      </h3>
                    </div>
                    {order['total'] && (
                      <div className='orderDetailHeader_Item'>
                        <h2>৳{numberWithCommas(order['total'])}</h2>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
      )}

      {!isLoading && !(orders.length > 0) && (
        <h2>No Order has been created yet!</h2>
      )}

      {isLoading && <Spinner />}
    </div>
  );
};

export default withRouter(Order);
