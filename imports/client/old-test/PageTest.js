import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Editor } from '@tinymce/tinymce-react';
import S3 from 'aws-sdk/clients/s3';

import Button from '@material-ui/core/Button';

import FileUpload from '../forms/FileUpload.js';
import EditAvatarButton from '../header/EditAvatarButton.js'
// import UserFiles from '../../startup/collections/files';
import VenuesForm from '../forms/VenuesForm';

import TinyInput from '../forms/TinyInput.js'
import AxiosUpload from './axiosUpload.js'

class PageTest extends Component {
  constructor(props) {
    super(props);
    this.state = { content: '', endPoint: null };
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleEditorChange = (content) => {
    console.log('Content was updated:', content);
    this.setState({ content });
  }
  
  onSubmit = (e) => {
    console.log(e);
  }
  

  render() {
    
    return (
    
    <div>
    <p></p>
    <hr/>
    <FileUpload />

      </div>
    )
  }
};
    
export default PageTest;

