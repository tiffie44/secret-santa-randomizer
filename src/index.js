/* 
* Secret Santa Randomizer
* Author: Tiffanie Truong
*/

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Remarkable } from 'remarkable';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';


// *************************************************
//                   Main Code
// *************************************************

class SecretSantaRandomizer extends React.Component {
  constructor(props) {
    super(props);
    this.md = new Remarkable();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      value: '',
      assignment: [],
      assignmentDesc: [],
      showAssignment: false, 
    };
  }

  handleChange(e) {
    this.setState({value: e.target.value, showAssignment: false});
  }

  randomize() {
    const namesList = parseInput(this.state.value);
    const assignment = generateAssignment(namesList);

    // Create a description for each assigned pairing
    const desc = [];
    for (let i = 0; i < namesList.length; i++) {
      desc.push(<li>{namesList[i]}'s secret santee is {assignment[i]}</li>);
    }

    this.setState({
      assignment: assignment,
      assignmentDesc: desc,
      showAssignment: true
    });
  }

  render() {
    const namesList = parseInput(this.state.value);
    return (
      <div className='Input'> 
        <h1>Secret Santa Randomizer</h1>
        <p>Enter a comma-separated list of names for the secret santa.</p>
        <textarea
          id="input-area"
          onChange={this.handleChange}
          placeholder='Enter names here.'
        />
        <p>The currently entered people will appear alphabetically below. </p>
        <NamesList input={this.state.value}/>
        <button onClick={() => this.randomize()}> Randomize </button>

        {this.state.showAssignment && 
        <AssignmentOutput 
          assignment={this.state.assignmentDesc}
          santas={namesList}
          santees={this.state.assignment}
        />}
      </div>
    );
  }

}

class AssignmentOutput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showAssignmentText: false }
  }
  
  toggleText() {
    this.setState({showAssignmentText: !this.state.showAssignmentText});
  }

  save() {
    var zip = new JSZip();

    // Create a text file for each person containing their assigned santee
    const numPeople = this.props.santas.length;
    for (let i = 0; i < numPeople; i++) {
      const currSanta = this.props.santas[i];
      const currSantee = this.props.santees[i];
      const message = `Hello ${currSanta}!\nYour secret santa person is ${currSantee}.`;
      zip.file(`${currSanta}.txt`, message);
    }

    zip.generateAsync({type: 'blob'}).then(function(content) {
      saveAs(content, "secret-santa-files.zip");
    });
  }

  render() {
    const buttonText = this.state.showAssignmentText ? 'Hide' : 'Show';

    return (
      <div>
        <p>Click here to view your randomized assignment!</p>
        <button onClick={() => this.toggleText()}>{buttonText}</button>
        {this.state.showAssignmentText && (<ul>{this.props.assignment}</ul>)}

        <p>Alternatively, click here to download a zip file containing text files of the form "(santa name).txt", each containing said person's secret santee.</p>
        <button onClick={() => this.save()}>Download Assignment Files </button>
      </div>
    );
  }
}


class NamesList extends React.Component {
  render() {
    // Split input into alphabetically sorted names
    const namesList = parseInput(this.props.input);

    // Map each inputted name to a list item containing the name
    const names = namesList.map((ele, ind) => {
      return (
        <li key={ele.id}> {ele} </li>
      );
    });

    return(
      <div className='names-list'>
        <ul>{names}</ul>
      </div>
    )
  }
}

// *************************************************
//               Helper functions
// *************************************************

/*
* Return a sorted list of names given the input
*/
function parseInput(input) {
  const namesList = input.split(',');

  // Remove whitespace before and after each name for proper sorting
  for (let i = 0; i < namesList.length; i++) {
    namesList[i] = namesList[i].trim();
  }
  namesList.sort();
  
  // Remove empty first entry that occurs during typing 
  if (namesList.length > 0 && namesList[0].trim() === '') {
    namesList.shift();
  }

  return namesList;
}


/* 
* Return a random integer between min (included) and max (excluded)
*/ 
function getRandInt(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}


/*
* Return an array containing a permutation of <namesList> 
* representing a valid assignment of secret santees for each person
* in the list when viewed in parallel.
*/
function generateAssignment(namesList) {
  const numNames = namesList.length;
  let cnt = 0;
  const assignment = [];

  while (cnt < numNames) {
    const santa = namesList[cnt];
    const santee = namesList[getRandInt(0, numNames)];

    // If the last santa is forced to get themselves,
    // swap santees with a random person from the list 
    if (cnt === numNames - 1 && !assignment.includes(santa)) {
      const randIndex = getRandInt(0, numNames - 1);
      const swapSantee = assignment[randIndex];
      assignment.splice(randIndex, 1, santa);

      // Repeat of code below to prevent redunant conditional check
      assignment.push(swapSantee);
      cnt = cnt + 1;
    }

    // A pairing is valid if the santee has not already been assigned
    // and the santee is not the secret santa themselves
    else if (santa !== santee && !assignment.includes(santee)) {
      assignment.push(santee);
      cnt = cnt + 1;
    }
  }
  
  return assignment
}

// ========================================

ReactDOM.render(
  <SecretSantaRandomizer />,
  document.getElementById('root')
);

