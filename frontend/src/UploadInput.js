import { Icon, Table, Input } from 'semantic-ui-react'
import React,{Component} from 'react';

class CSVupload extends Component{
    constructor(props){
        super(props);
        this.state = {
            viewCompleted: false,
            isUploading: false,
            
        };
    };
    handleChange =function(event){
        this.setState({csv: event.target.files[0]})
    let formData = new FormData();
    formData.append('file', csv);
    formData.append('buys', buys)
    let options = {
        method: 'POST',
        headers: {"Authorization": localStorage.getItem("token")},
        body: formData
        }
    fetch(`http://localhost:3000/api/v1/csvs`, options)
        .then(resp => resp.json())
        .then(result => {
    alert(result.message)
    })
    }
    render(){
        return <Input
                        type="file"
                        ref={(input) => { this.filesInput = input }}
                        name="file"
                        icon='file text outline'
                        iconPosition='left'
                        label='Upload CSV'
                        labelPosition='right'
                        placeholder='UploadCSV...'
                        onChange={this.handleChange}
                    ></Input>
    }
}

export default CSVupload