import React from "react";
import { Redirect } from "react-router-dom";
import { Table, OverlayTrigger } from "react-bootstrap";
import Select from "react-select";

import AtsBestHistoricalPopover from "./Popovers/AtsBestHistorical";
import AtsBestModelPopover from "./Popovers/AtsBestModel";
import BestOddsPopover from "./Popovers/BestOdds";
import FtsBestHistoricalPopover from "./Popovers/FtsBestHistorical";
import FtsBestModelPopover from "./Popovers/FtsBestModel";
import HistoricalPopover from "./Popovers/Historical";
import ModelPopover from "./Popovers/Model";

import "./app.css";

class SportsBetting extends React.Component {
  state = {
    redirect: null,
    market: "ATS",
    match: null,
    ats_summary: [],
    fts_summary: [],
  };

  componentDidUpdate() {
    console.log(this.state);
  }
  componentDidMount() {
    this.getAtsData();
    this.getFtsData();
  }

  // Retrieves data from ats_summary table
  getAtsData = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/ats_summary`
    );
    const data = await response.json();
    this.setState({ ats_summary: data.rows }, () => this.setMatchData());
  };

  getFtsData = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/fts_summary`
    );
    const data = await response.json();
    this.setState({ fts_summary: data.rows });
  };

  setMatchData = () => {
    const atsMatchArray = [];
    let matchNames = [{ value: "All Teams", label: "All Teams" }];

    this.state.ats_summary.map((item) => atsMatchArray.push(item.match_name));

    let cleanMatchArray = [...new Set(atsMatchArray)];

    cleanMatchArray.map((match) => {
      matchNames.push({ value: match, label: match });
      return null;
    });

    this.setState({ matchNames });
    return null;
  };

  renderTeamSelect = () => {
    return (
      <div>
        <Select
          options={this.state.matchNames}
          onChange={(e) =>
            this.setState({ selectedMatch: e.value }, () => {
              this.setFilteredTable();
            })
          }
          placeholder={"Choose a game"}
        />
      </div>
    );
  };

  renderMarketSelect() {
    const marketOptions = [
      { value: "ATS", label: "Anytime Try Scorer" },
      { value: "FTS", label: "First Try Scorer" },
    ];
    return (
      <div>
        <Select
          options={marketOptions}
          onChange={(e) => {
            this.setState(
              {
                market: e.value,
              },
              () => {
                this.setFilteredTable();
              }
            );
          }}
          placeholder={marketOptions[0].label}
        />
      </div>
    );
  }

  styleHighestOdds = (item, highest) => {
    if (item === highest) return { backgroundColor: "yellow" };
  };

  stylePercentages = (item) => {
    if (item * 100 >= 125) {
      return { backgroundColor: "salmon" };
    } else if (item * 100 >= 100 && item * 100 <= 125) {
      return { backgroundColor: "lightGreen" };
    } else {
    }
  };

  setFilteredTable = () => {
    let lowerCaseMarket = `${this.state.market.toLowerCase()}_summary`;
    let selectedTable = this.state[lowerCaseMarket];
    let filteredMatches = [];
    selectedTable.map((item) => {
      if (item.match_name === this.state.selectedMatch) {
        filteredMatches.push(item);
      }
      return null;
    });
    this.setState({ filteredMatches });
    return null;
  };

  filteredAtsTable = () => {
    return (
      <div>
        <div>
          <h3>Anytime Try Scorer Odds</h3>
        </div>
        <div className="tableFixHeadSmall">
          <Table size="sm" bordered striped hover>
            <thead>
              <tr>
                <th>Player</th>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={BestOddsPopover}
                >
                  <th>Best Odds</th>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={AtsBestHistoricalPopover}
                >
                  <th>Highest/<br></br>Historical (%)</th>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={AtsBestModelPopover}
                >
                  <th>Highest/<br></br>Model (%)</th>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={HistoricalPopover}
                >
                  <th>ATS<br></br>Historical</th>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={ModelPopover}
                >
                  <th>ATS<br></br>Model</th>
                </OverlayTrigger>
                <th>SportsBet</th>
                <th>BetEasy</th>
                <th>Neds</th>
                <th>PointsBet</th>
                <th>TopSport</th>
                <th>Team</th>
                <th>Match</th>
              </tr>
            </thead>
            <tbody>
              {this.state.filteredMatches?.map((item) => {
                return (
                  <tr>
                    <td  className="playerFix">{item.player}</td>
                    <td>{item.highest || "N/A"}</td>
                    <td style={this.stylePercentages(item.high_emp)}>
                      {Math.round(item.high_emp * 100) || "N/A"}
                    </td>
                    <td style={this.stylePercentages(item.high_mod)}>
                      {Math.round(item.high_mod * 100) || "N/A"}
                    </td>
                    <td>{item.ats_empirical || "N/A"}</td>
                    <td>{item.ats_model || "N/A"}</td>
                    <td style={this.styleHighestOdds(item.sb, item.highest)}>
                      {item.sb || "N/A"}
                    </td>
                    <td
                      style={this.styleHighestOdds(item.beteasy, item.highest)}
                    >
                      {item.beteasy || "N/A"}
                    </td>
                    <td style={this.styleHighestOdds(item.neds, item.highest)}>
                      {item.neds || "N/A"}
                    </td>
                    <td
                      style={this.styleHighestOdds(
                        item.pointsbet,
                        item.highest
                      )}
                    >
                      {item.pointsbet || "N/A"}
                    </td>
                    <td
                      style={this.styleHighestOdds(item.topsport, item.highest)}
                    >
                      {item.topsport || "N/A"}
                    </td>
                    <td>{item.team}</td>
                    <td>{item.match_name}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>
    );
  };

  atsTable = () => {
    return (
      <div>
        <div>
          <h3>Anytime Try Scorer Odds</h3>
        </div>
        <div className="tableFixHeadSmall">
          <Table size="sm" bordered striped hover>
          <thead>
              <tr>
                <th>Player</th>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={BestOddsPopover}
                >
                  <th>Best Odds</th>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={AtsBestHistoricalPopover}
                >
                  <th>Highest/<br></br>Historical (%)</th>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={AtsBestModelPopover}
                >
                  <th>Highest/<br></br>Model (%)</th>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={HistoricalPopover}
                >
                  <th>ATS<br></br>Historical</th>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={ModelPopover}
                >
                  <th>ATS<br></br>Model</th>
                </OverlayTrigger>
                <th>SportsBet</th>
                <th>BetEasy</th>
                <th>Neds</th>
                <th>PointsBet</th>
                <th>TopSport</th>
                <th>Team</th>
                <th>Match</th>
              </tr>
            </thead>
            <tbody>
              {this.state.ats_summary.map((item) => {
                return (
                  <tr>
                    <td className="playerFix">{item.player}</td>
                    <td>{item.highest || "N/A"}</td>
                    <td style={this.stylePercentages(item.high_emp)}>
                      {Math.round(item.high_emp * 100) || "N/A"}
                    </td>
                    <td style={this.stylePercentages(item.high_mod)}>
                      {Math.round(item.high_mod * 100) || "N/A"}
                    </td>
                    <td>{item.ats_empirical || "N/A"}</td>
                    <td>{item.ats_model || "N/A"}</td>
                    <td style={this.styleHighestOdds(item.sb, item.highest)}>
                      {item.sb || "N/A"}
                    </td>
                    <td
                      style={this.styleHighestOdds(item.beteasy, item.highest)}
                    >
                      {item.beteasy || "N/A"}
                    </td>
                    <td style={this.styleHighestOdds(item.neds, item.highest)}>
                      {item.neds || "N/A"}
                    </td>
                    <td
                      style={this.styleHighestOdds(
                        item.pointsbet,
                        item.highest
                      )}
                    >
                      {item.pointsbet || "N/A"}
                    </td>
                    <td
                      style={this.styleHighestOdds(item.topsport, item.highest)}
                    >
                      {item.topsport || "N/A"}
                    </td>
                    <td>{item.team}</td>
                    <td>{item.match_name}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>
    );
  };

  renderTable = () => {
    if (this.state.market === "ATS") {
      if (
        !this.state.selectedMatch ||
        this.state.selectedMatch === "All Teams"
      ) {
        return this.atsTable();
      }
      return this.filteredAtsTable();
    }
    if (!this.state.selectedMatch || this.state.selectedMatch === "All Teams") {
      return this.ftsTable();
    }
    return this.filteredFtsTable();
  };

  ftsTable = () => {
    return (
      <div>
        <div>
          <h3>First Try Scorer Odds</h3>
        </div>
        <div className="tableFixHeadSmall">
          <Table size="sm" bordered striped hover>
          <thead>
              <tr>
                <th>Player</th>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={BestOddsPopover}
                >
                  <th>Best Odds</th>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={AtsBestHistoricalPopover}
                >
                  <th>Highest/<br></br>Historical (%)</th>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={AtsBestModelPopover}
                >
                  <th>Highest/<br></br>Model (%)</th>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={HistoricalPopover}
                >
                  <th>FTS<br></br>Historical</th>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={ModelPopover}
                >
                  <th>FTS<br></br>Model</th>
                </OverlayTrigger>
                <th>SportsBet</th>
                <th>BetEasy</th>
                <th>Neds</th>
                <th>PointsBet</th>
                <th>TopSport</th>
                <th>Team</th>
                <th>Match</th>
              </tr>
            </thead>
            <tbody>
              {this.state.fts_summary.map((item) => {
                return (
                  <tr>
                    <td  className="playerFix">{item.player}</td>
                    <td>{item.highest || "N/A"}</td>
                    <td style={this.stylePercentages(item.high_emp)}>
                      {Math.round(item.high_emp * 100) || "N/A"}
                    </td>
                    <td style={this.stylePercentages(item.high_mod)}>
                      {Math.round(item.high_mod * 100) || "N/A"}
                    </td>
                    <td>{item.fts_empirical || "N/A"}</td>
                    <td>{item.fts_model || "N/A"}</td>
                    <td style={this.styleHighestOdds(item.sb, item.highest)}>
                      {item.sb || "N/A"}
                    </td>
                    <td
                      style={this.styleHighestOdds(item.beteasy, item.highest)}
                    >
                      {item.beteasy || "N/A"}
                    </td>
                    <td style={this.styleHighestOdds(item.neds, item.highest)}>
                      {item.neds || "N/A"}
                    </td>
                    <td
                      style={this.styleHighestOdds(
                        item.pointsbet,
                        item.highest
                      )}
                    >
                      {item.pointsbet || "N/A"}
                    </td>
                    <td
                      style={this.styleHighestOdds(item.topsport, item.highest)}
                    >
                      {item.topsport || "N/A"}
                    </td>
                    <td>{item.team}</td>
                    <td>{item.match_name}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>
    );
  };

  filteredFtsTable = () => {
    return (
      <div>
        <div>
          <h3>First Try Scorer Odds</h3>
        </div>
        <div className="tableFixHeadSmall">
          <Table size="sm" bordered striped hover>
          <thead>
              <tr>
                <th>Player</th>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={BestOddsPopover}
                >
                  <th>Best Odds</th>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={AtsBestHistoricalPopover}
                >
                  <th>Highest/<br></br>Historical (%)</th>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={AtsBestModelPopover}
                >
                  <th>Highest/<br></br>Model (%)</th>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={HistoricalPopover}
                >
                  <th>FTS<br></br>Historical</th>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={ModelPopover}
                >
                  <th>FTS<br></br>Model</th>
                </OverlayTrigger>
                <th>SportsBet</th>
                <th>BetEasy</th>
                <th>Neds</th>
                <th>PointsBet</th>
                <th>TopSport</th>
                <th>Team</th>
                <th>Match</th>
              </tr>
            </thead>
            <tbody>
              {this.state.filteredMatches?.map((item) => {
                return (
                  <tr>
                    <td  className="playerFix">{item.player}</td>
                    <td>{item.highest || "N/A"}</td>
                    <td style={this.stylePercentages(item.high_emp)}>
                      {Math.round(item.high_emp * 100) || "N/A"}
                    </td>
                    <td style={this.stylePercentages(item.high_mod)}>
                      {Math.round(item.high_mod * 100) || "N/A"}
                    </td>
                    <td>{item.fts_empirical || "N/A"}</td>
                    <td>{item.fts_model || "N/A"}</td>
                    <td style={this.styleHighestOdds(item.sb, item.highest)}>
                      {item.sb || "N/A"}
                    </td>
                    <td
                      style={this.styleHighestOdds(item.beteasy, item.highest)}
                    >
                      {item.beteasy || "N/A"}
                    </td>
                    <td style={this.styleHighestOdds(item.neds, item.highest)}>
                      {item.neds || "N/A"}
                    </td>
                    <td
                      style={this.styleHighestOdds(
                        item.pointsbet,
                        item.highest
                      )}
                    >
                      {item.pointsbet || "N/A"}
                    </td>
                    <td
                      style={this.styleHighestOdds(item.topsport, item.highest)}
                    >
                      {item.topsport || "N/A"}
                    </td>
                    <td>{item.team}</td>
                    <td>{item.match_name}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>
    );
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <>
        <div>{this.renderMarketSelect()}</div>
        <div>{this.renderTeamSelect()}</div>
        <div>{this.renderTable()}</div>
      </>
    );
  }
}

export default SportsBetting;
