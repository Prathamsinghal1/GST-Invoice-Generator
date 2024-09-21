import React, { useEffect, useState } from "react";

// Mock country and state data
const countries = [
  "India",
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo, Democratic Republic of the",
  "Congo, Republic of the",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "East Timor",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea, North",
  "Korea, South",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
  "Delhi (National Capital Territory)",
  "Puducherry",
  "Jammu and Kashmir",
  "Ladakh",
];

const BillTo = ({ billTo, setBillTo }) => {
  // Single state to manage all form inputs

  // State management for focus handling
  const [focusedCountry, setFocusedCountry] = useState(false);
  const [focusedState, setFocusedState] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [formattedDate, setFormattedDate] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDueDate, setSelectedDueDate] = useState("");
  const [formattedDueDate, setFormattedDueDate] = useState("");
  const [showDuePicker, setShowDuePicker] = useState(false);

  // Function to handle changes for all inputs
  const handleChange = (event) => {
    const { name, value } = event.target;
    setBillTo((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    const { name } = e.target;
    setBillTo((prevData) => ({
      ...prevData,
      [name]: formatDate(date),
    }));
    setFormattedDate(formatDate(date));
    setSelectedDate(date);
  };
  const handleDueDateChange = (e) => {
    const date = e.target.value;
    const { name } = e.target;
    setBillTo((prevData) => ({
      ...prevData,
      [name]: formatDate(date),
    }));
    setFormattedDueDate(formatDate(date));
    setSelectedDueDate(date);
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    const formattedDate = new Date(date).toLocaleDateString(undefined, options);

    // Split the formatted date to reorder
    const [day, month, year] = formattedDate.split(" ");

    return `${month} ${day>9 ? day : '0'+day}, ${year}`;
  };

  useEffect(() => {
    const currentDate = formatDate(
      new Date().getMonth() +
        1 +
        "/" +
        new Date().getDate() +
        "/" +
        new Date().getFullYear()
    );
    setFormattedDate(currentDate);
    setFormattedDueDate(currentDate);
    setSelectedDate(`${new Date().getFullYear()}-${new Date().getMonth() + 1 < 10? "0" + (new Date().getMonth() + 1) : new Date().getMonth() + 1}-${new Date().getDate()}`);
    setSelectedDueDate(`${new Date().getFullYear()}-${new Date().getMonth() + 1 < 10 ? "0" + (new Date().getMonth() + 1) : new Date().getMonth() + 1}-${new Date().getDate()}`
    );
    setBillTo((prevData) => ({
      ...prevData,
      ["dueDate"]: currentDate,
      ["invoiceDate"]: currentDate,
    }));

  }, []);

  return (
    <>
      <div className="flex">
        {/* Client Information Section */}
        <div className="flex flex-col gap-1 w-1/2">
          <div className="w-[80%] mt-2">
            <input
              type="text"
              name="billToTag"
              className="w-full rounded-lg border border-white hover:border hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,40%)] font-semibold text-xl"
              value={billTo.billToTag}
              onChange={handleChange}
            />
          </div>
          <div className="w-[80%]">
            <input
              type="text"
              name="clientCompany"
              className="w-full rounded-lg border border-white hover:border hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,50%)]"
              placeholder="Your Client's Company"
              value={billTo.clientCompany}
              onChange={handleChange}
            />
          </div>
          <div className="w-[80%]">
            <input
              type="text"
              name="clientGstin"
              className="w-full rounded-lg border border-white hover:border hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,50%)]"
              placeholder="Client's GSTIN"
              value={billTo.clientGstin}
              onChange={handleChange}
            />
          </div>
          <div className="w-[80%]">
            <input
              type="text"
              name="clientAddress"
              className="w-full rounded-lg border border-white hover:border hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,50%)]"
              placeholder="Client's Address"
              value={billTo.clientAddress}
              onChange={handleChange}
            />
          </div>
          <div className="w-[80%]">
            <input
              type="text"
              name="clientCity"
              className="w-full rounded-lg border border-white hover:border hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,50%)]"
              placeholder="City"
              value={billTo.clientCity}
              onChange={handleChange}
            />
          </div>
          {/* State and Country Fields with onFocus and onBlur */}
          <div className="w-[80%]">
            {focusedState || billTo.clientCountry !== "India" ? (
              <input
                type="text"
                name="clientState"
                className="w-full rounded-lg border border-white hover:border hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,50%)]"
                placeholder="State"
                value={billTo.clientState}
                onChange={handleChange}
                onFocus={() => setFocusedState(false)} // On focus, show the select dropdown
              />
            ) : (
              <select
                name="clientState"
                value={billTo.clientState}
                onChange={handleChange}
                onBlur={() => setFocusedState(true)} // On blur, return to input mode
                className="w-full rounded-lg border border-white hover:border hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,50%)]"
              >
                {states.map((state, index) => (
                  <option key={index} value={state} readOnly>
                    {state}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="w-[80%]">
            {focusedCountry ? (
              <select
                name="clientCountry"
                value={billTo.clientCountry}
                onChange={handleChange}
                onBlur={() => setFocusedCountry(false)}
                className="w-full rounded-lg border border-white hover:border hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,50%)]"
              >
                {countries.map((country, index) => (
                  <option key={index} value={country} readOnly>
                    {country}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name="clientCountry"
                placeholder="Country"
                value={billTo.clientCountry}
                readOnly
                onFocus={() => setFocusedCountry(true)}
                className="w-full rounded-lg border border-white hover:border hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,50%)]"
              />
            )}
          </div>
        </div>

        {/* Invoice Information Section */}
        <div className="grid grid-cols-2 w-1/2 mt-3 mb-auto">
          <div className="w-[80%] mb-2">
            <input
              type="text"
              name="invoiceNumberTag"
              className="w-full rounded-lg border border-white hover:border hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,40%)] font-semibold"
              value={billTo.invoiceNumberTag}
              onChange={handleChange}
            />
          </div>
          <div className="w-[80%] mb-2">
            <input
              type="text"
              name="invoiceNumber"
              className="w-full rounded-lg border border-white hover:border hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,50%)]"
              placeholder="INV-1"
              value={billTo.invoiceNumber}
              onChange={handleChange}
            />
          </div>
          <div className="w-[80%] mb-2">
            <input
              type="text"
              name="invoiceDateTag"
              className="w-full rounded-lg border border-white hover:border hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,40%)] font-semibold"
              value={billTo.invoiceDateTag}
              onChange={handleChange}
            />
          </div>
          <div className="relative w-[80%] mb-2">
            {!showPicker && (
              <div
                className="w-full rounded-lg border border-white hover:border hover:border-purple-300 focus:border-purple-300 outline-none py-1 pl-2 text-[hsl(0,0%,50%)]"
                onClick={() => setShowPicker(true)}
              >
                {formattedDate}
              </div>
            )}
            {showPicker && (
              <input
                type="date"
                name="invoiceDate"
                className={`opacity-${
                  showPicker ? 1 : 0
                } cursor-pointer rounded-lg border border-white hover:border hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,50%)] pl-2 w-full`}
                onChange={handleDateChange}
                onFocus={() => setShowPicker(true)}
                onBlur={() => setShowPicker(false)}
                value={selectedDate}
              />
            )}
          </div>

          <div className="w-[80%] mb-2">
            <input
              type="text"
              name="dueDateTag"
              className="w-full rounded-lg border border-white hover:border hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,40%)] font-semibold"
              value={billTo.dueDateTag}
              onChange={handleChange}
            />
          </div>
          <div className="relative w-[80%] mb-2">
            {!showDuePicker && (
              <div className="w-full rounded-lg border border-white hover:border hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,40%)]" onClick={() => setShowDuePicker(true)}>
                {formattedDueDate}
              </div>
            )}
            {showDuePicker && (
              <input
                type="date"
                name="dueDate"
                className={`opacity-${
                  showDuePicker ? 1 : 0
                } cursor-pointer rounded-lg border border-white hover:border hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,50%)] pl-2 w-full`}
                onChange={handleDueDateChange}
                onFocus={() => setShowDuePicker(true)}
                onBlur={() => setShowDuePicker(false)}
                value={selectedDueDate}
              />
            )}
          </div>
        </div>
      </div>

      {/* Last State place */}
      <div className="w-[80%] my-4 flex items-center gap-2">
        <label
          htmlFor=""
          className="whitespace-nowrap text-[hsl(0,0%,40%)] font-medium"
        >
          Place Of Supply:
        </label>
        <input
          type="text"
          name="clientState"
          className="w-[40%] rounded-lg border border-white hover:border hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,50%)]"
          placeholder="State"
          value={billTo.clientState}
          onChange={handleChange}
        />
      </div>
    </>
  );
};

export default BillTo;
