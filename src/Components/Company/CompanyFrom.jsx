import React, { useState } from "react";
import { countries, states } from "./../Data/Data";
import { Trash2 } from "lucide-react";
import { MdCloudUpload } from "react-icons/md";

export default function CompanyFrom({ formData, setFormData }) {
  const [isStateFocused, setIsStateFocused] = useState(true);
  const [isCountryFocused, setIsCountryFocused] = useState(true);
  const [initialSetup, setInitialSetup] = useState(true);

  const handleDeleteImage = () => {
    setFormData((prevState) => ({
      ...prevState,
      ["imageSrc"]: null, // Update the specific field in formData
    }));
    setInitialSetup(true);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0]; // Get the first selected file
    if (file) {
      const reader = new FileReader(); // Create a FileReader instance
      reader.onloadend = () => {
        setFormData((prevState) => ({
          ...prevState,
          ["imageSrc"]: reader.result, // Update the specific field in formData
        }));
      };
      reader.readAsDataURL(file); // Read file as Data URL
    }
    setInitialSetup(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value, // Update the specific field in formData
    }));
  };
  
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="w-[60%]">
          {initialSetup && (
            <>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  id="logoImage"
                  name="logo"
                  accept="image/*"
                  className="opacity-0 hidden cursor-pointer"
                  onChange={handleImageUpload} // Handle image upload
                />
                <label
                  htmlFor="logoImage"
                  className="lg:min-w-[145px] py-3 bg-blue-50 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors duration-195 "
                >
                  <MdCloudUpload className="text-blue-600 w-[30px] h-[30px]" />
                  <span className="mt-2 text-blue-600 font-medium">Upload</span>
                </label>
                <div>
                  <h3 className="text-lg font-semibold text-[hsl(0,0%,40%)] whitespace-nowrap">
                    Upload Logo
                  </h3>
                  <p className="text-sm text-gray-500">(240 x 240 pixels)</p>
                </div>
              </div>
            </>
          )}

          {/* Preview the uploaded image */}
          {!initialSetup && (
            <div className="lg:w-[40%] flex group">
              <div className="py-1 border border-white hover:border hover:border-purple-300 focus:border-purple-300 px-5 rounded-lg">
                <img
                  src={formData.imageSrc}
                  alt="Uploaded Logo"
                  className="h-[80px] w-[80px] rounded-md border shadow-xl"
                />
              </div>
              <div className="flex flex-col justify-center hidden group-hover:flex">
                <div
                  className="p-2 border-y border-r border-purple-300 rounded-r-lg"
                  onClick={handleDeleteImage}
                >
                  <Trash2 className="text-red-500 w-[16px] h-[16px]" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-[40%]">
          <input
            type="text"
            name="invoiceTag"
            className="w-full md:text-5xl sm:text-3xl text-2xl font-semibold text-[hsl(0,0%,40%)] outline-none focus:border focus:border-purple-300 hover:border hover:border-purple-300 rounded-lg p-4 py-2"
            value={formData.invoiceTag}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Bill From */}
      <div className="flex flex-col gap-1 mt-3">
        <div className="w-[40%] mt-2">
          <input
            type="text"
            name="company" // Input name corresponds to state key
            className="w-full rounded-lg border border-white hover:border hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,50%)]"
            placeholder="Your Company"
            value={formData.company} // Controlled input bound to state
            onChange={handleChange} // Update state on change
          />
        </div>
        <div className="w-[40%]">
          <input
            type="text"
            name="name"
            className="w-full rounded-lg border border-white hover:border hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,50%)]"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="w-[40%]">
          <input
            type="text"
            name="gstin"
            className="w-full rounded-lg border border-white hover:border hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,50%)]"
            placeholder="Company's GSTIN"
            value={formData.gstin}
            onChange={handleChange}
          />
        </div>
        <div className="w-[40%]">
          <input
            type="text"
            name="address"
            className="w-full rounded-lg border border-white hover:border hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,50%)]"
            placeholder="Company's Address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div className="w-[40%]">
          <input
            type="text"
            name="city"
            className="w-full rounded-lg border border-white hover:border hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,50%)]"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
          />
        </div>
        <div
          className="w-[40%]"
          onFocus={() => setIsStateFocused(false)}
          onBlur={() => setIsStateFocused(true)}
        >
          {isStateFocused || formData.country !== "India" ? (
            <input
              type="text"
              name="state"
              className="w-full rounded-lg border border-white hover:border hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,50%)]"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
            />
          ) : (
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full rounded-lg border border-white hover:border hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-1 text-[hsl(0,0%,50%)]"
            >
              {states.map((state, index) => (
                <option key={index} value={state}>
                  {state}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Country Field with onFocus and onBlur */}
        <div
          className="w-[40%]"
          onFocus={() => setIsCountryFocused(false)}
          onBlur={() => setIsCountryFocused(true)}
        >
          {isCountryFocused ? (
            <input
              type="text"
              name="country"
              className="w-full rounded-lg border border-white hover:border hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,50%)]"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
            />
          ) : (
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full rounded-lg border border-white hover:border hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-1 text-[hsl(0,0%,50%)]"
            >
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
}
