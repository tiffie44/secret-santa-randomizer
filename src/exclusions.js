/*
* Name: exclusions.js
* Description: This file contains the section pertaining to inputting exclusion lists.
* Author: Tiffanie Truong
*/

import React from 'react';
import './index.css';

import {parseExclusions} from './utils.js'

class ExclusionSection extends React.Component {
    render () {
        return (
            <div id='exclusions'>
                <h2 id="exclusionsHeader">Exclusions</h2>
                <p>If there are people that a specific santa would <em>not</em> like to be assigned to, please enter the exclusions as a <em>backslash-separated</em> list below in the format: <span className='input'>Santa : Santee1, Santee2</span>, etc. For example, </p>
                <ul className='example'>
                    <li> <span className='input'> Julia : Isaac </span> specifies that Julia will not be assigned to Isaac.</li>
                    <li> <span className='input'> Julia : Isaac, Tiffanie / Tiffanie : Isaac </span> specifies that Julia will not be assigned to Isaac nor Tiffanie, and Tiffanie will not be assigned to Isaac.</li>
                </ul>
                <p>Duplicate lists for the same santa will be removed (i.e. only the first list will be registered). </p>
                <textarea id="exclusion-area"
                          onChange={this.props.onChange}
                          placeholder="Enter any exclusion lists here."
                />
                <p>The currently entered exclusion lists will appear below. Only names that were entered in 'Names' above will appear. </p>
                <div className='redBox'>
                <ExclusionList nameInput={this.props.nameInput} 
                                exclusionInput={this.props.exclusionInput}/>
                </div>
            </div>
        )
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

  export default ExclusionSection;