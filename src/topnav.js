/*
* Name: topnav.js
* Description: This file contains the top navigation bar.
* Author: Tiffanie Truong
*/

import React from 'react';
import './index.css';

class TopNav extends React.Component {
    render() {
        return (
            <div className="topnav">
                <a href="#top">Top</a>
                <a href="#names">Names</a>
                <a href="#exclusions">Exclusions</a>
                <a href="#output">Output</a>
            </div>
        )
    }
}
export default TopNav