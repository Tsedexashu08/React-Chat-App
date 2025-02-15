import React from 'react';

function HamburgerMenu() {
    return (
        <div>
            <svg fill="#ccc" width="30" height="50px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" stroke="#ccc">
                <path d="M26,16c0,0.552-0.448,1-1,1H7c-0.552,0-1-0.448-1-1s0.448-1,1-1h18C25.552,15,26,15.448,26,16z"></path>
                <path d="M26,8c0,0.552-0.448,1-1,1H7c-0.552,0-1-0.448-1-1s0.448-1,1-1h18C25.552,7,26,7.448,26,8z"></path>
                <path d="M26,24c0,0.552-0.448,1-1,1H7c-0.552,0-1-0.448-1-1s0.448-1,1-1h18C25.552,23,26,23.448,26,24z"></path>
            </svg>
        </div>
    );
}

export default HamburgerMenu;
