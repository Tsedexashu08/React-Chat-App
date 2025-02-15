import React, { useState } from 'react';
import '../../css/inputs/PhoneNumberInput.css';

function PhoneNumberInput({ onPhoneNumberChange }) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('Austria');

    const handlePhoneNumberChange = (e) => {
        const value = e.target.value;
        setPhoneNumber(value);
        if (onPhoneNumberChange) {
            onPhoneNumberChange(value);
        }
    };

    const handleCountryChange = (e) => {
        setSelectedCountry(e.target.id);
    };

    return (
        <div className="ui-wrapper">
            {['Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech', 'Denmark', 'Estonia', 'Ethiopia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Norway', 'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden'].map(country => (
                <input
                    key={country}
                    id={country}
                    name="flag"
                    type="radio"
                    checked={selectedCountry === country}
                    onChange={handleCountryChange}
                />
            ))}
            <input className="dropdown-checkbox" name="dropdown" id="dropdown" type="checkbox" />
            <label className="dropdown-container" htmlFor="dropdown"></label>
            <div className="input-wrapper">
                <legend>
                    <label htmlFor="phonenumber">
                        Phonenumber*
                    </label>
                </legend>
                <div className="textfield">
                    <input
                        pattern="\d+"
                        maxLength="11"
                        id="phonenumber"
                        name="phonenumber"
                        type="text"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                    />
                    <span className="invalid-msg">This is not a valid phone number</span>
                </div>
            </div>
            <div className="select-wrapper">
                <ul>
                    {['Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech', 'Denmark', 'Estonia', 'Ethiopia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Norway', 'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden'].map(country => (
                        <li key={country} className={country}>
                            <label htmlFor={country}>
                                <span>{getFlagEmoji(country)}</span>{country} (+{getCountryCode(country)})
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

const getFlagEmoji = (country) => {
    const flags = {
        Austria: '🇦🇹',
        Belgium: '🇧🇪',
        Bulgaria: '🇧🇬',
        Croatia: '🇭🇷',
        Cyprus: '🇨🇾',
        Czech: '🇨🇿',
        Denmark: '🇩🇰',
        Estonia: '🇪🇪',
        Ethiopia: '🇪🇹',
        Finland: '🇫🇮',
        France: '🇫🇷',
        Germany: '🇩🇪',
        Greece: '🇬🇷',
        Hungary: '🇭🇺',
        Iceland: '🇮🇸',
        Ireland: '🇮🇪',
        Italy: '🇮🇹',
        Latvia: '🇱🇻',
        Liechtenstein: '🇱🇮',
        Lithuania: '🇱🇹',
        Luxembourg: '🇱🇺',
        Malta: '🇲🇹',
        Netherlands: '🇳🇱',
        Norway: '🇳🇴',
        Poland: '🇵🇱',
        Portugal: '🇵🇹',
        Romania: '🇷🇴',
        Slovakia: '🇸🇰',
        Slovenia: '🇸🇮',
        Spain: '🇪🇸',
        Sweden: '🇸🇪',
    };
    return flags[country];
};

const getCountryCode = (country) => {
    const codes = {
        Austria: '43',
        Belgium: '32',
        Bulgaria: '359',
        Croatia: '385',
        Cyprus: '357',
        Czech: '420',
        Denmark: '45',
        Estonia: '372',
        Ethiopia: '251',
        Finland: '358',
        France: '33',
        Germany: '49',
        Greece: '30',
        Hungary: '36',
        Iceland: '354',
        Ireland: '353',
        Italy: '39',
        Latvia: '371',
        Liechtenstein: '423',
        Lithuania: '370',
        Luxembourg: '352',
        Malta: '356',
        Netherlands: '31',
        Norway: '47',
        Poland: '48',
        Portugal: '351',
        Romania: '40',
        Slovakia: '421',
        Slovenia: '386',
        Spain: '34',
        Sweden: '46',
    };
    return codes[country];
};

export default PhoneNumberInput;
