import React, { Component } from 'react'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';


class ImageTable extends React.Component {
  constructor() {
    super();

  }

  render() {

    var prettyTableData = [];
    console.log("IN TABLE DATA - length");
    console.log(this.props.tableData.length);
    console.log(this.props.tableData);
      for (var i = 0; i < this.props.tableData.length; i++){
        prettyTableData.push(
          <TableRow>
            <TableRowColumn><img src={this.props.tableData[i]["base_64"]}/></TableRowColumn>
            <TableRowColumn>{this.props.tableData[i]["description"]}</TableRowColumn>
            <TableRowColumn>{this.props.tableData[i]["ts_uploaded"]}</TableRowColumn>
            <TableRowColumn>{this.props.tableData[i]["time_to_process"]}</TableRowColumn>
            <TableRowColumn>{this.props.tableData[i]["size"]}</TableRowColumn>
            <TableRowColumn><button>Download</button></TableRowColumn>
          </TableRow>
        )
      }


    return (
      <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn>Image</TableHeaderColumn>
            <TableHeaderColumn>Description</TableHeaderColumn>
            <TableHeaderColumn>Uploaded</TableHeaderColumn>
            <TableHeaderColumn>Time to Process</TableHeaderColumn>
            <TableHeaderColumn>Size</TableHeaderColumn>
            <TableHeaderColumn>Download</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prettyTableData}
        </TableBody>
      </Table>
      </div>
    )

  }
}


export default ImageTable;
