import React, { memo, useState } from 'react';

import { Col, Row } from 'antd';

import { Buffer } from 'buffer'; // Import Buffer polyfill
import DashboardAddresses from './Addresses';
import DashboardSearch from './Search';
import DashboardTransactions from './Transactions';
// Define Buffer & process globally (IMPORTANT for Webpack 5)
window.Buffer = Buffer;

const Dashboard = memo(() => {
  const [selectedAddress, setSelectedAddress] = useState();

  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Row gutter={[16, 16]}>
          <DashboardSearch />
          <DashboardAddresses setSelectedAddress={setSelectedAddress} />
        </Row>
      </Col>
      <Col span={12}>
        <DashboardTransactions selectedAddress={selectedAddress} />
      </Col>
    </Row>
  );
});

export default Dashboard;
