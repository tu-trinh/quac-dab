import React,{Component,Fragment} from 'react';
import logo from './logo.svg';
import Dropzone from 'react-dropzone';
import './App.css';
import ColoredTable from './ColoredTable';
import { Icon, Table, Input,Tab, Button, Message,Form } from 'semantic-ui-react'
//import CSVupload from './UploadInput';
import axios, { put } from "axios"; 
class App extends Component{
    constructor(props){
        super(props);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.fileChange = this.fileChange.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
        this.displayCompleted = this.displayCompleted.bind(this);
        this.state = {
            viewCompleted: false,
            isLoading: false,
            isUploading: false,
            hasErrors: false,
            
        };
    //onDrop = (acceptedFiles) => {console.log(acceptedFiles);}
    }


    fileInputRef = React.createRef(); //https://codesandbox.io/s/04lz4580pl

    onFormSubmit = e => {
      e.preventDefault(); // Stop form submit
      this.fileUpload(this.state.file).then(response => {
        console.log(response.data);
      });
    };
  
    fileChange = e => {
      this.setState({ file: e.target.files[0] }, () => {
        console.log("File chosen --->", this.state.file);
      });
    };
  
    // Import datasources/schemas Tab 1
    fileUpload = file => {
      const url = "/some/path/to/post";
      const formData = new FormData();
      formData.append("file", file);
      const config = {
        headers: 
            {"Authorization": localStorage.getItem("token"),
        }
      };
      return put(url, formData, config);
    };
    displayCompleted = status => {
        if (status) {
            return this.setState({viewCompleted:true});
        }
        return this.setState({viewCompleted:false});
    };

    render(){
        const { isLoading } = this.state;
        return (
            <Fragment>
   
            <Form onSubmit={this.onFormSubmit}>
              <Form.Field>
                <Button
                  content="Choose File"
                  labelPosition="left"
                  icon="file"
                  onClick={() => this.fileInputRef.current.click()}
                />
                <input
                  ref={this.fileInputRef}
                  type="file"
                  hidden
                  onChange={this.fileChange}
                />
              </Form.Field>
            </Form>
            
            <ColoredTable></ColoredTable>
      </Fragment>
        
                
                    
        
                /**<div className = "text-center my-5">
                    <Dropzone onDrop = {this.onDrop} accept = "text/csv">
                        {({getRootProps, getInputProps, isDragActive}) => (
                           <div {...getRootProps()}>
                                <input {...getInputProps()}/>
                           
                              {isDragActive ? "Drag and drop file here." : 'Click me or drag a file to upload!'}
                           </div>
                        )}
                     </Dropzone>   
                 </div>*/
        );
     }
}
export default App;
