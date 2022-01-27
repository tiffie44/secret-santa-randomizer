/*
* Name: names.js
* Description: This file contains the section pertaining to inputting names.
* Author: Tiffanie Truong
*/

import React from 'react';
import './index.css';

import {parseNames} from './utils.js'

class NamesSection extends React.Component {
    render() {
        return (
          <div id="names">
            <div className="namesInput">
              <h2 id="namesHeader"> Names </h2>
              <p>Enter a <em>comma-separated</em> list of names for the secret santa. For example,</p>
              <ul className='example'>
                <li>Tiffanie, Tiffany, Vanessa, Clover, Isaac, Joey, Julia, Natalie</li>
                <li>tiffanie,vanessa,julia,joey</li>
              </ul>
              <p>Names are case-sensitive. Duplicate names will be removed.</p>
              <textarea
                id="input-area"
                onChange={this.props.onChange}
                placeholder="Enter names here."
              />
            </div>
            
            <div className="namesOutput">
              <p>The currently entered people will appear alphabetically below. </p>
              <div className="greenBox">
                <NamesList nameInput={this.props.nameInput} />
              </div>
            </div>
          </div>
        );
    }
}

class NamesList extends React.Component {
    render() {
      // Split input into alphabetically sorted names
      const namesList = parseNames(this.props.nameInput);
  
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

  export default NamesSection;