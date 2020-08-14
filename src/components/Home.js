import React from "react";

import { Form, Col, Row, Check, Button } from "react-bootstrap";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { ResponsiveRadar } from "@nivo/radar";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";

import Popup from "reactjs-popup";

import { motion } from "framer-motion";

class Home extends React.Component {
  state = {
    players: [],
    showPositionButtons: false,
    hide: true,
    startDate: { date: new Date() },
    endDate: { date: new Date() },
    disabled: false,
    fanType: "general",
    playerOrTeam: "player",
    toggleAdvancedOptions: false,
    currentPlayersData: {
      player1: { data: null, playerName: "Micah Rus" },
      player2: { data: null, playerName: "Test user" },
    },
    graphData: [
      {
        stat: "kicks",
        player1: 9,
        player2: 7,
      },
      {
        stat: "passes",
        player1: 9,
        player2: 7,
      },
      {
        stat: "points",
        player1: 9,
        player2: 7,
      },
      {
        stat: "tackles",
        player1: 9,
        player2: 7,
      },
      {
        stat: "tries",
        player1: 9,
        player2: 7,
      },
    ],
  };

  componentDidMount() {
    this.getAllPlayersData();
  }

  // Retrieves all player data from database
  getAllPlayersData = async () => {
    const response = await fetch("http://localhost:3001/players");
    const data = await response.json();
    this.setState({ players: data.rows });
  };

  // Retrieves individual player data from the database
  getPlayerData = async (playerId, playerName, playerNumber) => {
    const response = await fetch(
      `http://localhost:3001/player/id?playerId=${playerId}`
    );
    const data = await response.json();

    // Sets the state if the player number is 1
    if (playerNumber === "player1") {
      let player2 = this.state.currentPlayersData.player2;
      this.setState({
        currentPlayersData: {
          player1: { data: data.rows, playerName: playerName },
          player2: { data: player2.data, playerName: player2.playerName },
        },
      });
    }

    // Sets the state if the player number is 2
    if (playerNumber === "player2") {
      let player1 = this.state.currentPlayersData.player1;
      this.setState({
        currentPlayersData: {
          player1: { data: player1.data, playerName: player1.playerName },
          player2: { data: data.rows, playerName: playerName },
        },
      });
    }

    this.setGraphData(playerName, playerNumber);
  };

  componentDidUpdate() {
    console.log(this.state);
  }
  // This function handles setting up the data that the graph will display
  setGraphData = (playerName, playerNumber) => {
    const player = this.state.currentPlayersData?.[playerNumber];
    let kicks = 0;
    let points = 0;
    let tackles = 0;
    let tries = 0;
    let passes = 0;
    // This loop will set the parameters that will be displayed in the graph
    for (let i = 0; i <= 25; i++) {
      kicks += player.data[i].kicks;
      passes += player.data[i].passes;
      points += player.data[i].points;
      tackles += player.data[i].tackles_made;
      tries += player.data[i].tries;
      // This ensures that if the player has less than 25 games played the loop will exit at their last entry
      if (i === player.data.length - 1) {
        i = 25;
      }

      // Ensures the loop gets a maximum of 25 games of stats
      if (i === 25) {
        let newData = [];
        if (playerNumber === "player1") {
          this.setState((prevState) => {
            prevState.graphData.map((item) => {
              let keys = Object.keys(item);
              let values = Object.values(item);
              let stat = eval(values[0]);
              newData.push({
                stat: values[0],
                [playerName]: stat,
                [keys[2]]: values[2],
              });
            });
            return { graphData: newData };
          });
        }

        if (playerNumber === "player2") {
          this.setState((prevState) => {
            prevState.graphData.map((item) => {
              let keys = Object.keys(item);
              let values = Object.values(item);
              let stat = eval(values[0]);
              newData.push({
                stat: values[0],
                [playerName]: stat,
                [keys[1]]: values[1],
              });
            });
            return { graphData: newData };
          });
        }
      }
    }
  };

  fanTypeClickHandler = (event) => {
    this.setState({ fanType: event.target.value });
  };

  teamPlayerClickHandler = (event) => {
    this.setState({ disabled: true, playerOrTeam: event.target.value });
  };

  toggleAdvancedOptions = () => {
    this.setState({ toggleAdvancedOptions: !this.state.toggleAdvancedOptions });
  };

  teamOrPlayerRadioChangeHandler = (event) => {
    this.setState({ playerOrTeam: event.target.value });
  };

  fanTypeRadioChangeHandler = (event) => {
    this.setState({ fanType: event.target.value });
  };

  playerButtonSelectHandler = (event) => {
    let playerId = event.target.value;
    let playerName = event.target[event.target.selectedIndex].innerText;
    let playerNumber = event.target.parentNode.title;

    this.getPlayerData(playerId, playerName, playerNumber);
  };

  renderScatterPlot = () => {
    return (
      <div style={{ height: "950px" }}>
        <ResponsiveScatterPlot
          data={this.state.data}
          margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
          xScale={{ type: "linear", min: 0, max: "auto" }}
          xFormat={function (e) {
            return e + " kg";
          }}
          yScale={{ type: "linear", min: 0, max: "auto" }}
          yFormat={function (e) {
            return e + " cm";
          }}
          blendMode="multiply"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: "bottom",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "weight",
            legendPosition: "middle",
            legendOffset: 46,
          }}
          axisLeft={{
            orient: "left",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "size",
            legendPosition: "middle",
            legendOffset: -60,
          }}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 130,
              translateY: 0,
              itemWidth: 100,
              itemHeight: 12,
              itemsSpacing: 5,
              itemDirection: "left-to-right",
              symbolSize: 12,
              symbolShape: "circle",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      </div>
    );
  };

  renderRadar = () => {
    console.log(this.state);
    return (
      <div style={{ height: "1000px" }}>
        <ResponsiveRadar
          data={this.state.graphData}
          keys={[
            this.state.currentPlayersData?.player1.playerName,
            this.state.currentPlayersData?.player2.playerName,
          ]}
          indexBy="stat"
          maxValue="auto"
          margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
          curve="linearClosed"
          borderWidth={2}
          borderColor={{ from: "color" }}
          gridLevels={5}
          gridShape="circular"
          gridLabelOffset={36}
          enableDots={true}
          dotSize={10}
          dotColor={{ theme: "background" }}
          dotBorderWidth={2}
          dotBorderColor={{ from: "color" }}
          enableDotLabel={true}
          dotLabel="value"
          dotLabelYOffset={-12}
          colors={{ scheme: "nivo" }}
          fillOpacity={0.25}
          blendMode="multiply"
          animate={true}
          motionStiffness={90}
          motionDamping={15}
          isInteractive={true}
          legends={[
            {
              anchor: "top-left",
              direction: "column",
              translateX: -50,
              translateY: -40,
              itemWidth: 80,
              itemHeight: 20,
              itemTextColor: "#999",
              symbolSize: 12,
              symbolShape: "circle",
            },
          ]}
        />
      </div>
    );
  };

  renderAdvancedOptions = () => {
    if (this.state.toggleAdvancedOptions) {
      return (
        <div>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={this.toggleAdvancedOptions}
          >
            {" "}
            Advanced Options
          </Button>
          <form>
            <label>
              <input type="radio" value="null" />
              Button
            </label>
            <label>
              <input type="radio" value="null" />
              Button
            </label>
            <label>
              <input type="radio" value="null" />
              Button
            </label>
            <label>
              <input type="radio" value="null" />
              Button
            </label>
            <label>
              <input type="radio" value="null" />
              Button
            </label>
          </form>
        </div>
      );
    } else {
      return (
        <div>
          <Button
            size="sm"
            variant="outline-primary"
            onClick={this.toggleAdvancedOptions}
          >
            {" "}
            Advanced Options
          </Button>
        </div>
      );
    }
  };

  renderModal() {
    return (
      <Popup
        onClose={() => {
          this.setState({ hide: false });
        }}
        defaultOpen={true}
        modal={true}
        disabled={this.state.disabled}
        closeOnDocumentClick
        position="center center"
      >
        <div>
          What kind of fan are you?
          <Popup
            disabled={this.state.disabled}
            closeOnDocumentClick
            position="bottom center"
            trigger={
              <div>
                <button onClick={this.fanTypeClickHandler} value="general">
                  {" "}
                  General
                </button>
                <button onClick={this.fanTypeClickHandler} value="fantasy">
                  {" "}
                  Fantasy
                </button>
                <button onClick={this.fanTypeClickHandler} value="betting">
                  {" "}
                  Betting
                </button>
              </div>
            }
          >
            <div>
              <p> What type of stats are you interested in? </p>
              <button onClick={this.teamPlayerClickHandler} value="team">
                {" "}
                Team
              </button>
              <button onClick={this.teamPlayerClickHandler} value="player">
                {" "}
                Player
              </button>
            </div>
          </Popup>
        </div>
      </Popup>
    );
  }

  renderTopControlBar = () => {
    return (
      <div>
        <Form.Row inline>
          <Col>
            <Form.Label>General</Form.Label>
            <Form.Control as="radio">
              <input
                type="radio"
                value="general"
                checked={this.state.fanType === "general"}
                onChange={this.fanTypeRadioChangeHandler}
              />
            </Form.Control>
          </Col>
          <Col>
            <Form.Label>Fantasy</Form.Label>

            <Form.Control as="radio">
              <input
                type="radio"
                value="fantasy"
                checked={this.state.fanType === "fantasy"}
                onChange={this.fanTypeRadioChangeHandler}
              />
            </Form.Control>
          </Col>
          <Col>
            <Form.Label>Betting</Form.Label>
            <Form.Control as="radio">
              <input
                type="radio"
                value="betting"
                checked={this.state.fanType === "betting"}
                onChange={this.fanTypeRadioChangeHandler}
              />
            </Form.Control>
          </Col>
        </Form.Row>
        <Form.Row inline>
          <Col>
            <Form.Label>Team</Form.Label>
            <Form.Control as="radio">
              <input
                type="radio"
                value="team"
                checked={this.state.playerOrTeam === "team"}
                onChange={this.teamOrPlayerRadioChangeHandler}
              />
            </Form.Control>
          </Col>
          <Col>
            <Form.Label>Player</Form.Label>
            <Form.Control as="radio">
              <input
                type="radio"
                value="player"
                checked={this.state.playerOrTeam === "player"}
                onChange={this.teamOrPlayerRadioChangeHandler}
              />
            </Form.Control>
          </Col>
        </Form.Row>
      </div>
    );
  };

  renderPositionButtons = () => {
    if (this.state.showPositionButtons) {
      return (
        <div>
          <Form>
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Positions"
              onChange={() => {
                this.setState({
                  showPositionButtons: !this.state.showPositionButtons,
                });
              }}
            />
          </Form>
          <Form>
            <Row>
              <Col>
                <Form.Check type="checkbox" id="checkbox" label="2nd Row" />
              </Col>
              <Col>
                <Form.Check type="checkbox" id="checkbox" label="Five-Eighth" />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Check type="checkbox" id="checkbox" label="Interchange" />
              </Col>
              <Col>
                <Form.Check type="checkbox" id="checkbox" label="Hooker" />
              </Col>
            </Row>

            <Row>
              {" "}
              <Col>
                <Form.Check type="checkbox" id="checkbox" label="Fullback" />
              </Col>
              <Col>
                <Form.Check type="checkbox" id="checkbox" label="Halfback" />
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Check type="checkbox" id="checkbox" label="Lock" />
              </Col>
              <Col>
                <Form.Check type="checkbox" id="checkbox" label="Prop" />
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Check type="checkbox" id="checkbox" label="Winger" />
              </Col>
              <Col>
                <Form.Check type="checkbox" id="checkbox" label="Center" />
              </Col>
            </Row>
          </Form>
        </div>
      );
    }
    return (
      <div>
        <Form>
          <Form.Check
            type="switch"
            id="custom-switch"
            label="Positions"
            onChange={() => {
              this.setState({
                showPositionButtons: !this.state.showPositionButtons,
              });
            }}
          />
        </Form>
      </div>
    );
  };

  renderStatDropDowns = () => {
    const options = [
      "AllRunMetres",
      "Conversions",
      "Errors",
      "Fantasy",
      "Intercepts",
      "Kick Metres",
      "LineBreakAssists",
      "LineBreaks",
      "MinutesPlayed",
      "MissedTackles",
      "Offloads",
      "OneOnOneSteal",
      "TackleBreaks",
      "TackleEfficiency",
      "TacklesMade",
      "Tries",
      "TryAssists",
    ];
    return (
      <div>
        <Form inline>
          <Row>
            <Col>
              <Form.Label> Stat 1</Form.Label>
              <Form.Control as="select" custom>
                {options.map((options) => {
                  return <option>{options}</option>;
                })}
              </Form.Control>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label> Stat 2</Form.Label>
              <Form.Control as="select" custom>
                {options.map((options) => {
                  return <option>{options}</option>;
                })}
              </Form.Control>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  renderTeamButtons = () => {
    return (
      <div>
        <Form inline>
          <Row>
            <Col>
              <Form.Label> Team 1</Form.Label>
              <Form.Control as="select" custom>
                <option> Team</option>
              </Form.Control>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Label> Team 2</Form.Label>
              <Form.Control as="select" custom>
                <option> Team</option>
              </Form.Control>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  renderPlayerButtons = () => {
    return (
      <div>
        <Form inline>
          <Form title="player1">
            <Row>
              <Col>
                <Form.Label> Player 1 </Form.Label>
                <Form.Control
                  as="select"
                  custom
                  onChange={this.playerButtonSelectHandler}
                >
                  {this.state.players?.map((player) => {
                    return (
                      <option key={player.player_id} value={player.player_id}>
                        {player.first_name} {player.last_name}
                      </option>
                    );
                  })}
                </Form.Control>
              </Col>
            </Row>
          </Form>
          <Form title="player2">
            <Row>
              <Col>
                <Form.Label> Player 2 </Form.Label>
                <Form.Control
                  as="select"
                  custom
                  onChange={this.playerButtonSelectHandler}
                >
                  {this.state.players?.map((player) => {
                    return (
                      <option key={player.player_id} value={player.player_id}>
                        {player.first_name} {player.last_name}
                      </option>
                    );
                  })}
                </Form.Control>
              </Col>
            </Row>
          </Form>
        </Form>
      </div>
    );
  };

  renderDateButtons = () => {
    return (
      <div>
        <Form>
          <h3>Dates</h3>
          <DatePicker
            selected={this.state.startDate.date}
            onChange={(date) => this.setState({ startDate: { date: date } })}
          />

          <DatePicker
            selected={this.state.endDate.date}
            onChange={(date) => this.setState({ endDate: { date: date } })}
          />
        </Form>
      </div>
    );
  };

  renderVenueButtons = () => {
    return (
      <div>
        <Form>
          <Form.Label> Venue </Form.Label>
          <Form.Control as="select" custom>
            <option> MCG </option>
          </Form.Control>
        </Form>
      </div>
    );
  };

  renderGraphControlBar = () => {
    return (
      <div>
        <Form.Group>
          <div>
            {this.renderStatDropDowns()}
            {this.renderPlayerButtons()}
            <h2> Filters </h2>
            {this.renderPositionButtons()}
            {this.renderTeamButtons()}
            {this.renderDateButtons()}
            {this.renderVenueButtons()}
            {this.renderAdvancedOptions()}
          </div>
        </Form.Group>
      </div>
    );
  };

  renderMotionDiv = () => {
    return (
      <motion.div
        style={{
          height: "250px",
          width: "250px",
          backgroundColor: "grey",
          opacity: 0.5,
        }}
        animate={{ scale: 0, x: -115, y: -155 }}
        transition={{ duration: 0.5 }}
      ></motion.div>
    );
  };

  render() {
    // if (this.state.hide) {
    //   return (
    //     <>
    //       {this.renderControlBar()}
    //       {this.renderModal()}
    //     </>
    //   )
    // }
    return (
      <>
        {this.renderTopControlBar()}
        {/* {this.renderMotionDiv()} */}
        {this.renderGraphControlBar()}
        {/* {this.renderRadar()} */}
        {/* {this.renderScatterPlot()} */}
      </>
    );
  }
}

export default Home;
