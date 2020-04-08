// @ts-nocheck
import React, { useEffect, useState } from 'react';
import SmallItem from '../../../components/SmallItem';
import { numberWithCommas } from '../../../utils';
import Moment from 'react-moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useHandleFetch } from '../../../hooks';
import { Spinner } from '../../../components/Loading';
const Order = (props) => {
  const [orderListState, handleOrderListStateFetch] = useHandleFetch(
    [],
    'getCurrentUserOrders'
  );

  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(1);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getAndSetOrders = async () => {
      setIsLoading(true);
      const newOrders = await handleOrderListStateFetch({
        urlOptions: {
          params: {
            limitNumber: 10,
            pageNumber: pageNumber,
          },
        },
      });

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
      const newOrders = await handleOrderListStateFetch({
        urlOptions: {
          params: {
            limitNumber: 1,
            pageNumber: pageNumber,
          },
        },
      });

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
          hasMore={true}
          loader={<h4></h4>}
        >
          {orders.map((order) => {
            return (
              <div className='orderDetailsContainer'>
                <div className='orderDetailItem'>
                  <div className='orderDetailHeader'>
                    <div className='orderDetailHeader_Item'>
                      <h2>Created At</h2>
                      <h3>
                        <Moment format='YYYY/MM/DD'>{order.date}</Moment>
                      </h3>
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

                    {order['total'] && (
                      <div className='orderDetailHeader_Item'>
                        <h2>Total</h2>
                        <h3>৳{numberWithCommas(order['total'])}</h3>
                      </div>
                    )}
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
                            />
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
      )}

      {!isLoading && <h2>No Order has been created yet!</h2>}

      {isLoading && <Spinner />}
    </div>
  );
};

export default Order;
