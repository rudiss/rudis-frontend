import React, { memo, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Col, message, Row, Spin, Table } from 'antd';
import {
  ADDRESS_TRANSACTIONS,
  requestAddressTransactions,
} from '../../redux/actions';
import { STATUS_ERROR, STATUS_LOADING } from '../../constants/redux';

const columns = [
  { title: 'Tx Hash', dataIndex: 'hash' },
  { title: 'Timestamp', dataIndex: 'timeStamp' },
  { title: 'From', dataIndex: 'from' },
  { title: 'To', dataIndex: 'to' },
  { title: 'Value', dataIndex: 'value' },
];

const DashboardTransactions = memo(() => {
  const dispatch = useDispatch();
  const { address } = useParams(); // Get address from URL
  const lastAddress = useRef();
  const [page, setPage] = useState(1);
  const transactions = useSelector(state => state.transactions);
  const requestStatus = useSelector(
    state => state.status[ADDRESS_TRANSACTIONS]
  );
  // Fetch transactions when address changes
  useEffect(() => {
    if (address && address !== lastAddress.current) {
      setPage(1); // Reset to first page
      dispatch(
        requestAddressTransactions({
          address,
          page: 1,
        })
      );
    }
    lastAddress.current = address;
  }, [dispatch, address]);

  // Show error message on API failure
  useEffect(() => {
    if (requestStatus === STATUS_ERROR) {
      message.error(
        'Sorry, we are not able to retrieve the transactions for that address.'
      );
    }
  }, [requestStatus]);

  return (
    <Row>
      <Col flex={1}>
        {address ? (
          <Row gutter={[16, 16]}>
            <Col span={24}>Viewing transactions for {address}:</Col>
            {requestStatus === STATUS_LOADING && page === 1 ? (
              <Col span={24}>
                <Spin />
              </Col>
            ) : (
              <Table
                columns={columns}
                dataSource={transactions || []}
                pagination
                rowKey="hash"
              />
            )}
          </Row>
        ) : (
          `Select an address to view its latest transactions`
        )}
      </Col>
    </Row>
  );
});

export default DashboardTransactions;
