//https://medium.com/@subalerts/create-dynamic-table-from-json-in-react-js-1a4a7b1146ef
import React, {Component} from 'react'
import { Icon, Table } from 'semantic-ui-react'

class ColoredTable extends Component {
    constructor(props){
        super(props);
        this.getHeader = this.getHeader.bind(this);
        this.getRowsData = this.getRowsData.bind(this);
        this.getKeys = this.getKeys.bind(this);
        this.state = {
            hasData: false,
            data: [{"hello":"world","hack":"tired","errors":["hello"]},{'hello':'world1',"hack":"wack","errors":["hello"]},{'hello':'world2',"hack":"sleep","errors":["hack"]}]

        }
        }
    getKeys = function(){
        //Objects.keys(this.props.data[0]).pop()
        return Object.keys(this.state.data[0]); //TODO make it exclude last entry
    }
    getHeader = function(){
        var keys = this.getKeys();
        keys.pop()
        return keys.map((key, index)=>{
            return <Table.HeaderCell>{key}</Table.HeaderCell>
        })
    }

    RenderRow = (state) =>{
        return state.keys.map((key, index)=>{
            if (state.data["errors"].includes(key)){
                return <Table.Cell error> {key}</Table.Cell> 
            }
            else {
                return <Table.Cell>{state.data[key]}</Table.Cell>
            }
        })
       }
    getRowsData = function(){
        var items = this.state.data;
        var keys = this.getKeys();
        keys.pop()
        return items.map((row, index)=>{
        return <Table.Row><this.RenderRow key={index} data={row} keys={keys}/></Table.Row>
        })
        }
    render() {
        return (
            <div>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            {this.getHeader()}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.getRowsData()}
                    </Table.Body>
                </Table>
            </div>
            
            );
            }
           }
           
            
           
    
   

export default ColoredTable