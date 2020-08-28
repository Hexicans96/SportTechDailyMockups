import React from "react";
import { Redirect } from "react-router-dom";
import { Form, Row, Col, Button, Table } from "react-bootstrap";

class FantasySport extends React.Component {
  state = { 
    redirect: null,
    dfs_summary: [],
  };

  componentDidUpdate() {
      console.log("true");
      console.log(this.state);
  };

  componentDidMount() {
    this.getDfsData();
  };

  getDfsData = async () => {
    console.log("THIS IS A LOG")
    const response = await fetch("http://localhost:3001/dfs_summary");
    const data = await response.json();
    console.log("Here is the data:", data);
    this.setState({ dfs_summary: data.rows });
  };

  // renderDfsMatchSelect() {
  //   return(

  //     <Form>
  //           <Form title="match-select">
  //               <Row>
  //                   <Col>
  //                       <Form.Group>
  //                           <Form.Label>Match</Form.Label>
  //                           <Form.Control as="select">
  //                               <option></option>
  //                           </Form.Control>
  //                       </Form.Group>
  //                   </Col>
  //               </Row>
  //           </Form>
  //           <Button>
  //               Go!
  //           </Button>
  //     </Form>
  //   )
  // }

  renderDfsTable() {
    return(
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Player</th>
              <th>Expected Minutes</th>
              <th>Price/Pred</th>
              <th>OS Prev Rd</th>
              <th>DS Price</th>
              <th>Match</th>
              <th>Team</th>
              <th>Position</th>
            </tr>
          </thead>
          <tbody>
            {this.state.dfs_summary.map((item) => {
              return(
                <tr>
                  <td>{item.player}</td>
                  <td>{item.minutes}</td>
                  <td>{item.price_pred}</td>
                  <td>{item.os_prev}</td>
                  <td>{item.ds_price}</td>
                  <td>{item.match_name}</td>
                  <td>{item.team}</td>
                  <td>{item.pos}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    )
  }
  render() {
      if (this.state.redirect) {
          return <Redirect to={this.state.redirect} />;
      }
      return (
        <div>
            <div>
                <h1>Fantasy Sports DFS</h1>
            </div>
            <div>
              {this.renderDfsTable()}
            </div>
        </div>
    )
  }
}

export default FantasySport;