import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Form, Input, message } from 'antd';
import WAValidator from 'wallet-address-validator';
import { debounce } from 'lodash';
import { ADDRESS_BALANCE, requestAddressBalance } from '../../redux/actions';
import { STATUS_ERROR, STATUS_LOADING } from '../../constants/redux';

const { useForm } = Form;

const DashboardSearch = memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { address } = useParams(); // Get address from URL
  const [form] = useForm();
  const requestStatus = useSelector(state => state.status[ADDRESS_BALANCE]);
  const existingAddresses = useSelector(state => state.addresses); // Get stored addresses
  // Debounce validation function (300ms delay)
  const debouncedValidate = useMemo(
    () =>
      debounce((ethAddress, callback) => {
        if (
          !WAValidator.validate(ethAddress, 'ETH') &&
          ethAddress.trim() !== ''
        ) {
          callback('Invalid Ethereum address');
        } else {
          callback(); // No error
        }
      }, 300),
    []
  );

  // Handle form submission & update URL
  const onSubmit = useCallback(
    ({ ethAddress }) => {
      // Check if address is already in Redux store
      const isDuplicate = existingAddresses.some(a => a.address === ethAddress);
      if (isDuplicate) {
        message.warning('This address is already added.');
        return;
      }

      dispatch(requestAddressBalance({ address: ethAddress }));
      navigate(`/address/${ethAddress}`);
      form.resetFields();
    },
    [dispatch, form, navigate, existingAddresses]
  );
  // Prefill form & fetch balance when URL changes
  useEffect(() => {
    if (address) {
      form.setFieldsValue({ address });
      dispatch(requestAddressBalance({ address }));
    }
  }, [address, dispatch, form]);

  // Show error message if request fails
  useEffect(() => {
    if (requestStatus === STATUS_ERROR) {
      message.error(
        'Sorry, we are not able to retrieve the balance of that address. You may have entered an invalid address.'
      );
    }
  }, [requestStatus]);

  return (
    <Col span={24}>
      <Form form={form} layout="inline" onFinish={onSubmit}>
        <Form.Item
          className="input-address"
          name="ethAddress"
          rules={[
            { required: true, message: 'Please enter an address' },
            {
              validator: (_, value) =>
                new Promise((resolve, reject) => {
                  debouncedValidate(value, error => {
                    if (error) reject(new Error(error));
                    else resolve();
                  });
                }),
            },
          ]}
        >
          <Input placeholder="ETH Address" />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={requestStatus === STATUS_LOADING}
        >
          Add Address
        </Button>
      </Form>
    </Col>
  );
});

export default DashboardSearch;
