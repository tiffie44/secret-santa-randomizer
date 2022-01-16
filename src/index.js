/* 
* Secret Santa Randomizer
* Author: Tiffanie Truong
*/

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Remarkable } from 'remarkable';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';


// *************************************************
//                   Main Code
// *************************************************

class SecretSantaRandomizer extends React.Component {
  constructor(props) {
    super(props);
    this.md = new Remarkable();
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleExclusionChange = this.handleExclusionChange.bind(this);
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

        <div className='names'>
          <div className='namesInput'>
            <h2 id="namesHeader"> Names </h2>
            <p>Enter a <em>comma-separated</em> list of names for the secret santa. For example,</p>
            <ul className='example'>
              <li>Tiffanie, Tiffany, Vanessa, Clover, Isaac, Joey, Julia, Natalie</li>
              <li>tiffanie,vanessa,julia,joey</li>
            </ul>
            <p>Names are case-sensitive. Do not enter duplicate names.</p>
            <textarea
              id="input-area"
              onChange={this.handleNameChange}
              placeholder="Enter names here."
            />
          </div>
          
          <div className='namesOutput'>
            <p>The currently entered people will appear alphabetically below. </p>
            <div className='green'>
              <NamesList input={this.state.nameInput}/>
            </div>
          </div>
        </div>

        <div className='exclusions'>
          <h2 id="exclusionsHeader">Exclusions</h2>
          <p>If there are people that a specific santa would <em>not</em> like to be assigned to, please enter the exclusions as a <em>backslash-separated</em> list below in the format: <span className='input'>Santa : Santee1, Santee2</span>, etc. For example, </p>
          <ul className='example'>
            <li> <span className='input'> Julia : Isaac</span> specifies that Julia will not be assigned to Isaac.</li>
            <li> <span className='input'> Julia : Isaac, Tiffanie / Tiffanie : Isaac</span> specifies that Julia will not be assigned to Isaac nor Tiffanie, and Tiffanie will not be assigned to Isaac.</li>
          </ul>
          <textarea
            id="exclusion-area"
            onChange={this.handleExclusionChange}
            placeholder="Enter any exclusion lists here."
          />
          <p>The currently entered exclusion lists will appear below. Only names that were entered in 'Names' above will appear. </p>
          <div className='red'>
            <ExclusionList nameInput={this.state.nameInput} exclusionInput={this.state.exclusionInput}></ExclusionList>
          </div>
        </div>

        <div className='output'>
        <h2>Output</h2>
          <button id='randomize' onClick={() => this.randomize()}> Randomize </button>
          {this.state.showAssignment && 
          <AssignmentOutput  
            assignment={this.state.assignmentDesc}
            santas={namesList}
            santees={this.state.assignment}
          />}
        </div>
      </div>
    );
  }

}

class ExclusionList extends React.Component {
  render() {
    // Split exclusion input into map of the exclusions
    const santaToExclusions = parseExclusions(this.props.nameInput, this.props.exclusionInput); 

    // Create a message for each exclusion list
    const messages = [];
    for (const [key, value] of santaToExclusions) {
      let message = key + " will not be assigned to ";

      if (value.length > 0) {
        for (let i = 0; i < value.length; i++) {
          message += `${value[i]}, `;
        }
        message = message.slice(0, message.length - 2); // remove last comma
      }

      messages.push(<li>{message}</li>);
    }

    return(
      <div>
        <ul>{messages}</ul>
      </div>
    )
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
      const message = `Hello, ${currSanta}!\nYour secret santee is ${currSantee}.`;
      zip.file(`${currSanta}.txt`, message);
    }

    zip.generateAsync({type: "blob"}).then(function(content) {
      saveAs(content, "secret-santa-files.zip");
    });
  }

  render() {
    const buttonText = this.state.showAssignmentText ? "Hide" : "Show";

    return (
      <div>
        <p>Click here to view your randomized assignment.</p>
        <button onClick={() => this.toggleText()}>{buttonText}</button>
        <div className='assignmentText'>
          {this.state.showAssignmentText && (<ul>{this.props.assignment}</ul>)}
        </div>

        <p>Alternatively, click here to download a zip file containing text files of the form "(santa name).txt", each containing said person's secret santee.</p>
        <button onClick={() => this.save()}>Download Assignment Files </button>
      </div>
    );
  }
}


class NamesList extends React.Component {
  render() {
    // Split input into alphabetically sorted names
    const namesList = parseNames(this.props.input);

    // Map each inputted name to a list item containing the name
    const names = namesList.map((ele, ind) => {
      return (
        <li key={ele.id}> {ele} </li>
      );
    });

    return(
      <div className="names-list">
        <ul>{names}</ul>
      </div>
    )
  }
}


// *************************************************
//         Input parsing helper functions
// *************************************************

/*
* Return a sorted list of names given the input
*/
function parseNames(nameInput) {

  const namesList = nameInput.split(',');

  // Remove whitespace before and after each name for proper sorting
  for (let i = 0; i < namesList.length; i++) {
    namesList[i] = namesList[i].trim();
  }
  namesList.sort();
  
  // Remove empty first entry that occurs during typing 
  if (namesList.length > 0 && namesList[0].trim() === "") {
    namesList.shift();
  }

  return namesList;
}

/*
* Return a map of (santa, list of santee) entries representing exclusions,
* that is, a list of people that a given santa should not be assigned to.
*/
function parseExclusions(nameInput, exclusionInput) {
  // Split input into exclusions
  const santaToExclusions = new Map();
  const exclusionStrings = exclusionInput.split('/');
  const namesList = parseNames(nameInput);

  // Process every backslash-separated exclusion request
  for (let i = 0; i < exclusionStrings.length; i++) {
    const curr = exclusionStrings[i].trim();
    const colon = curr.indexOf(':');
    if (colon === -1) continue;

    // Separate exclusion request into santa and excluded santees
    const santa = curr.slice(0, colon).trim();
    const santees = curr.slice(colon + 1);
    const exclusions = parseNames(santees);

    // Only include santas that exist in the secret santa
    if (!namesList.includes(santa)) continue;

    // Only include santees that exist in the secret santa
    // in the excluded list
    for (let j = 0; j < exclusions.length; j++) {
      if (!namesList.includes(exclusions[j])) {
        exclusions.splice(j, 1);
        j--; // all elements shift left
      }
    }
    
    // Add current entry to the list 
    santaToExclusions.set(santa, exclusions);
  }
  
  return santaToExclusions;
}


// *************************************************
//              Helper functions
// *************************************************

/* 
* Return a random integer between min (included) and max (excluded)
*/ 
function getRandInt(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

/*
* Return true if and only if santa1 and santa2 can swap assigned santees. 
* That is, santa1 can be assigned to santee2 and santa2 can be assigned to santee1. 
*/
function canSwapSantees(santa1, santee1, santa2, santee2, exclusionMap) {
  // CASE: the santa is equal to the santee
  if (santa1 === santee2 || santa2 === santee1) {
    return false;
  }
  // CASE: santee2 is part of santa1's exclusions
  if (exclusionMap.has(santa1) && (exclusionMap.get(santa1)).includes(santee2)) {
    return false;
  }
  // CASE: santee1 is part of santa2's exclusions
  if (exclusionMap.has(santa2) && (exclusionMap.get(santa2)).includes(santee1)) {
    return false;
  }
  return true; 
}


/*
* Return two elements:
*   (1) a boolean indicating whether a valid assignment was generated
*   (2) an array containing a permutation of <namesList> 
*         representing a valid assignment of secret santees for each person
*         in the list when viewed in parallel (empty if (1) is false)
*/
function generateAssignment(nameInput, exclusionInput) {
  const namesList = parseNames(nameInput);
  const exclusionMap = parseExclusions(nameInput, exclusionInput);
  const numNames = namesList.length;
  let cnt = 0;
  const assignment = [];

  // Generate an initial assignment 
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

  // Do corrections based on exclusions 
  for (let i = 0; i < numNames; i++) {
    const currSanta = namesList[i];

    // Move to next santa if they have no exclusions
    if (!exclusionMap.has(currSanta)) continue;

    const exclusions = exclusionMap.get(currSanta);
    const currSantee = assignment[i];
    
    // Move to next santa if santee is not an exclusion
    if (!exclusions.includes(currSantee)) continue;

    // Otherwise, this santee is in their exclusion list,
    // so find a person they can swap santees with 
    let cannotSwap = true;
    for (let j = 0; j < numNames; j++) {
      const swapSanta = namesList[j];
      const swapSantee = assignment[j];
      
      if (canSwapSantees(swapSanta, swapSantee, currSanta, currSantee, exclusionMap)) {
        assignment[j] = currSantee;
        assignment[i] = swapSantee;
        cannotSwap = false; // found person
        break;
      }
    }
    
    // The current assignment does not allow for them to swap.
    if (cannotSwap) {
      return [false, []];
    }    
  }
  
  return [true, assignment]
}

// ========================================

ReactDOM.render(
  <SecretSantaRandomizer />,
  document.getElementById("root")
);