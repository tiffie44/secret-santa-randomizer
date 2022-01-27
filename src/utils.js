/*
* Name: utils.js
* Description: This file contains common functions used by different components.
* Author: Tiffanie Truong
*/

// *************************************************
//         Input parsing helper functions
// *************************************************

/*
* Return a sorted list of names given the input
*/
export function parseNames(nameInput) {

    const names = nameInput.split(',');
  
    // Remove whitespace before and after each name for proper sorting
    for (let i = 0; i < names.length; i++) {
      names[i] = names[i].trim();
    }
    names.sort();
    
    // Remove empty first entry that occurs during typing 
    if (names.length > 0 && names[0].trim() === "") {
      names.shift();
    }
    
    // Remove any duplicate names
    const uniqueNames = [];
    for (let i = 0; i < names.length; i++) {
      if (!uniqueNames.includes(names[i])) {
          uniqueNames.push(names[i]);
      }
    }
  
    return uniqueNames;
  }
  

  /*
  * Return a map of (santa, list of santee) entries representing exclusions,
  * that is, a list of people that a given santa should not be assigned to.
  */
  export function parseExclusions(nameInput, exclusionInput) {
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
  
      // Do not parse repeated exclusion lists
      if (santaToExclusions.has(santa)) continue;
  
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
  export function generateAssignment(nameInput, exclusionInput) {
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