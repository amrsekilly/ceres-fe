import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FieldArray, Field, reduxForm, reset } from 'redux-form/immutable';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import InputField from '../forms/input';
import {
	formHasErrorsSelector,
	getFormErrorsSelector
} from '../../store/selectors/orders';
import {
	formSubmitFailedAction,
	formSubmitSucceededAction
} from '../../store/action-creators/orders';
import validateForm from '../../helpers/formValidation';
import listFormErrors from '../forms/listFormErrors';
import Button from '@material-ui/core/Button';

const renderInputComponent = ({ input: { name, onChange, value } }) => {
	let text;
	let fieldName;

	switch (name.split('-')[1]) {
		case 'name':
			text = 'Restaurant Name';
			fieldName = 'item';
      break;
      
    case 'url': 
      text = 'Menu Link';
      fieldName = 'url';
      break;

    case 'item':
      text = 'Item';
      fieldName = 'item';
      break;

    case 'fallback':
    text = 'Fallback';
    fieldName = 'fallback';
    break;

		default:
			text = '';
			fieldName = '';
	}

	return (
		<InputField
			value={value}
			onChange={onChange}
			text={text}
			fieldName={fieldName}
		/>
	);
};

const renderFieldArray = ({ fields }) => {
  if (!fields.length) {
    fields.push({});
  }
  return (
    <Grid lg={12}>
      {fields.map((item, index) =>
        (
        <Grid lg={12} key={index}>
          <Typography variant="h6">
            Item #{index + 1}
          </Typography>
          <Grid>
            <Field
              name={`${item}-item`}
              type="text"
              component={renderInputComponent}
              label="Item"
            />
          </Grid>
          <Grid>
            <Field
              name={`${item}-fallback`}
              type="text"
              component={renderInputComponent}
              label="Fallback"
            />
          </Grid>
          <Grid>
          {
            fields.length > 1 &&
            <Button
              title="Remove Item"
              variant="contained"
              color="secondary"
              onClick={() => fields.remove(index)}
            >
              Remove Item
            </Button>
          }
          </Grid>
          <Grid lg={12}>
            <Button 
              onClick={() => fields.push({})}
              variant="contained"
              color="primary"
            >
              Add More Items
            </Button>
          </Grid>
        </Grid>
        )
      )}
    </Grid>
  );
}

const SubmitItems = ({ handleSubmit, errors, formHasErrors }) => (
  <React.Fragment>
  <Typography variant="h5" style={{marginBottom: 20, marginTop: 30}}>
    Submit Your Order
  </Typography>
	<form onSubmit={handleSubmit(validateForm)}>
    <div className="register-form">
      <Grid container>
        <FieldArray name="items" component={renderFieldArray}/>
      </Grid>
      <div style={{ marginTop: 20 }}>
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </div>
			{formHasErrors &&
				<div className="register-form__form-errors">{listFormErrors(errors)}</div>
			}
		</div>
  </form>
  </React.Fragment>
);


SubmitItems.propTypes = {
	handleSubmit: PropTypes.func.isRequired,
	formHasErrors: PropTypes.bool.isRequired,
	errors: PropTypes.shape({
		item: PropTypes.string,
	})
};

SubmitItems.defaultProps = {
	errors: {}
};

const mapStateToProps = state => ({
	formHasErrors: formHasErrorsSelector(state),
	errors: getFormErrorsSelector(state)
});

const CreateOrder = connect(
	mapStateToProps,
	null
)(reduxForm({
	destroyOnUnmount: false,
	form: 'SubmitItems',
	onSubmitFail: (errors, dispatch) => dispatch(formSubmitFailedAction()),
	onSubmit: values => values,
	onSubmitSuccess: (values, dispatch) => {
    dispatch(formSubmitSucceededAction(values));
    dispatch(reset('SubmitItems'));
  }
})(SubmitItems));

export default CreateOrder;
