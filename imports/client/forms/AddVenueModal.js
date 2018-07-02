import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

import AddVenueForm from './AddVenueForm.js'


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
  }
});


class AddVenueModalComponent extends Component {
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
      <Button type="button" onClick={this.handleOpen} className={classes.button}> Add Venue </Button>
      <Modal 
        aria-labelledby="Add Venue Form"
        aria-describedby="Add a new venue from which to host an experience."
        open={this.state.open}
        onClose={this.handleClose}
      >
      <div className={classes.paper}>
        <Typography variant="title" id="modal-title">New Venue:</Typography>
        <AddVenueForm />
      </div>
    </Modal>
    </div>
    );
  }
}

AddVenueModalComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
const AddVenueModal = withStyles(styles)(AddVenueModalComponent);

export default AddVenueModal;