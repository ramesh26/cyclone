import React from 'react';
import { Form } from 'antd';
import PropTypes from 'prop-types';
import { defaultFormItemLayout, noLabelItemLayout } from '@/lib/const';

const FormItem = Form.Item;

export default function makeField(Component) {
  return function FieldWithProps(props) {
    FieldWithProps.propTypes = {
      label: PropTypes.string,
      hasFeedback: PropTypes.bool,
      field: PropTypes.object,
      form: PropTypes.object,
      children: PropTypes.node,
      required: PropTypes.bool,
      formItemLayout: PropTypes.object,
    };
    const {
      label,
      hasFeedback,
      field,
      required = false,
      form: { touched, errors },
      formItemLayout,
      ...rest
    } = props;
    const name = field.name;
    const hasError = _.get(touched, name) && _.get(errors, name);
    const _formItemLayout =
      formItemLayout || (label ? defaultFormItemLayout : noLabelItemLayout);
    return (
      <FormItem
        label={label}
        validateStatus={hasError ? 'error' : 'success'}
        hasFeedback={hasFeedback && hasError}
        help={hasError}
        required={required}
        {..._formItemLayout}
      >
        <Component {...field} {...rest} />
      </FormItem>
    );
  };
}
