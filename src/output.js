/*
* Name: output.js
* Description: This file contains the section outputing generated assignments.
* Author: Tiffanie Truong
*/

import React from 'react';
import './index.css';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

class OutputSection extends React.Component {
    render() {
        return (
            <div id='output'>
                <h2>Output</h2>
                <button id='randomizeButton' onClick={() => this.props.randomize()}> Randomize </button>
                {this.props.showAssignment && 
                <AssignmentOutput  
                    assignment={this.props.assignmentDesc}
                    santees={this.props.assignment}
                    santas={this.props.namesList}
                />}
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
      
      // Create blob from zip file to use for saving 
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
    
export default OutputSection