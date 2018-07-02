import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

import AddTalentForm from './AddTalentForm.js'


const styles = theme => ({
  paper: {
    position: 'absolute',
    // width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 1,
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%)`,
  },
});


class AddTalentModalComponent extends Component {
  state = {
    open: false,
  };
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };


  render() {
    const { classes } = this.props;

    return (
            <div>
      <Button type="button" onClick={this.handleOpen} className={classes.button}> Register Your Talents! </Button>
      <Modal 
        aria-labelledby="Talent Registration Form"
        aria-describedby="Add a new talent."
        open={this.state.open}
        onClose={this.handleClose}
      >
      <div className={classes.paper}>
        <Typography variant="title" id="eventPurchaseModal">Register your Talent:</Typography>
        <AddTalentForm user = {this.props.user}/>
      </div>
    </Modal>
    </div>
    );
  }
}

AddTalentModalComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
const AddTalentModal = withStyles(styles)(AddTalentModalComponent);

export default AddTalentModal;
