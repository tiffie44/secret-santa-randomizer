/*
* Name: app.js
* Description: This file contains the main component / UI of the randomizer.
* Author: Tiffanie Truong
*/

import React from 'react';
import './index.css';
import { Remarkable } from 'remarkable';
import {parseNames, generateAssignment } from './utils.js'
import NamesSection from './names.js';
import ExclusionSection from './exclusions.js';
import OutputSection from './output.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.md = new Remarkable();
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleExclusionChange = this.handleExclusionChange.bind(this);
    this.randomize = this.randomize.bind(this);
    this.state = {
      nameInput: "",
      exclusionInput: "",
      assignment: [],
      assignmentDesc: [],
      showAssignment: false, 
    };
  }

  handleNameChange(e) {
    this.setState({nameInput: e.target.value, showAssignment: false});
  }

  handleExclusionChange(e) {
    this.setState({exclusionInput: e.target.value, showAssignment: false});
  }

  randomize() {
    const [flag, assignment] = generateAssignment(this.state.nameInput, this.state.exclusionInput);
    const desc = [];
    const namesList = parseNames(this.state.nameInput);

    if (flag) {
      // Create a description for each assigned pairing
      for (let i = 0; i < namesList.length; i++) {
        desc.push(<li>{namesList[i]}'s secret santee is {assignment[i]}</li>);
      }
    }
    else {
      desc.push(<li>An assignment could not be made with these exclusion restrictions.</li>);
      desc.push(<li>This occasionally occurs due to how the randomization plays out, so feel free to click 'Randomize' again.</li>)
      desc.push(<li>Otherwise, please adjust your exclusion lists and try again.</li>)
    }

    this.setState({
      assignment: assignment,
      assignmentDesc: desc,
      showAssignment: true
    });
  }

  render() {
    const namesList = parseNames(this.state.nameInput);
    return (
      <div> 
        <h1>Secret Santa Randomizer</h1>
        <NamesSection onChange={this.handleNameChange} 
                      nameInput = {this.state.nameInput} />
        <ExclusionSection onChange={this.handleExclusionChange} 
                          nameInput = {this.state.nameInput}
                          exclusionInput = {this.state.exclusionInput} />
        <OutputSection assignmentDesc = {this.state.assignmentDesc}
                       assignment = {this.state.assignment}
                       namesList = {namesList}
                       showAssignment = {this.state.showAssignment}
                       randomize = {this.randomize}/>
      </div>
    );
  }
}

export default App