import React, { memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Col, Table } from 'antd';

const columns = [
  { title: 'Address', dataIndex: 'address' },
  { title: 'ETH Balance', dataIndex: 'balance' },
];

const DashboardAddresses = memo(() => {
  const addresses = useSelector(state => state.addresses);
  const navigate = useNavigate();

  const onAddressClick = useCallback(
    record => {
      navigate(`/address/${record.address}`);
    },
    [navigate]
  );

  return (
    <Col span={24}>
      <Table
        columns={columns}
        dataSource={[...new Map(addresses.map(a => [a.address, a])).values()]}
        rowKey="address"
        onRow={record => ({
          onClick: () => onAddressClick(record),
        })}
      />
    </Col>
  );
});

export default DashboardAddresses;
