
import React, { useState } from 'react';
import PhoneNumberInput from './inputs/PhoneNumberInput';

function ParentComponent() {
    const [phoneNumber, setPhoneNumber] = useState('');

    const handlePhoneNumberChange = (newPhoneNumber) => {
        setPhoneNumber(newPhoneNumber);
    };

    return (
        <div>
            <PhoneNumberInput onPhoneNumberChange={handlePhoneNumberChange} />
            <p>Phone Number: {phoneNumber}</p>
        </div>
    );
}

export default ParentComponent;