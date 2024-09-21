import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaAngleDown, FaEdit } from "react-icons/fa";
import { FcPrint } from "react-icons/fc";
import { MdCloudUpload, MdOutlineDownloadForOffline } from "react-icons/md";
import BillTo from "./Components/BillTo/BillTo";
import InvoiceItems from "./Components/Invoice/InvoiceItems";
// import InvoiceGenerator from "./Components/InvoiceGenerator";

export default function App() {
  const [selectedColor, setSelectedColor] = useState("orange-500");
  const [isStateFocused, setIsStateFocused] = useState(true);
  const [isCountryFocused, setIsCountryFocused] = useState(true);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [initialSetup, setInitialSetup] = useState(true);
  const [headerColor, setHeaderColor] = useState([0, 0, 0]);

  function createDataList(itemList) {
    return itemList.map((item, index) => [
      index + 1, // Sr. No (Index of the item starting from 1)
      item.itemName,
      item.hsn, // Description (Item Name)
      item.quantity, // Quantity
      item.value, // Price
      `${(item.igst*item.quantity * item.value / 100).toFixed(2)} (${item.igst}%)`, // igst
      `${(item.cess*item.quantity * item.value / 100).toFixed(2)} (${item.cess}%)`, 
      (item.quantity * item.value).toFixed(2), // Amount (Price multiplied by Quantity)
    ]);
  }

  const generateAndPreviewPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(25);
    
    const invoiceTopTagWidth = doc.getTextWidth(`${formData.invoiceTag}`);
    doc.text(`${formData.invoiceTag}`, 195-invoiceTopTagWidth, 32);

    // Make sure robotoMediumBase64 is correctly defined
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`${formData.company}`, 15, 25);

    doc.setFontSize(11);
    doc.addFont("Roboto-Medium.ttf", "Roboto-Medium", "normal");
    doc.setFont("Roboto-Medium", "normal");

    doc.text(`${formData.name==='' ? "_______________________________":formData.name}`, 15, 30);
    doc.text(`${formData.address==='' ? "_______________________________":formData.address}`, 15, 35);
    doc.text(`${formData.city==='' ? "________________":formData.city}`, 15, 40);
    doc.text(`${formData.state==='' ? "________________":formData.state}`, 15, 45);
    doc.text(`${formData.country}`, 15, 50);
    doc.text(`GSTIN ${formData.gstin==='' ? "________________":formData.gstin}`, 15, 55);

    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102);
    doc.text(`${billTo.billToTag}`, 15, 65);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(`${billTo.clientCompany==='' ? "_______________________________":billTo.clientCompany}`, 15, 70);
    doc.text(`${billTo.clientAddress==='' ? "_______________________________":billTo.clientAddress}`, 15, 75);
    doc.text(`${billTo.clientCity==='' ? "________________":billTo.clientCity===''}`, 15, 80);
    doc.text(`${billTo.clientCountry}`, 15, 85);
    doc.text(`GSTIN ${billTo.clientGstin==='' ? "________________":billTo.clientGstin}`, 15, 90);

    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102);
    doc.text(`Place Of Supply: ${billTo.clientState==='' ? "________________":billTo.clientState}`, 15, 100);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const invoiceTopNumber = doc.getTextWidth(`${billTo.invoiceNumber}`);
    const invoiceNumberTopTag = doc.getTextWidth(`${billTo.invoiceNumberTag}`);
    doc.text(`${billTo.invoiceNumberTag}`, 195-invoiceTopNumber-invoiceNumberTopTag-2, 38);
    doc.text(`${billTo.invoiceNumber}`, 195-invoiceTopNumber, 38);
    
    
    const invoiceDateWidth = doc.getTextWidth(`${billTo.invoiceDate}`);
    const invoiceDateTagWidth = doc.getTextWidth(`${billTo.invoiceDateTag}`);
    const dueDateWidth = doc.getTextWidth(`${billTo.dueDate}`);
    const dueDateTagWidth = doc.getTextWidth(`${billTo.dueDateTag}`);

    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102);
    doc.text(`${billTo.invoiceDateTag}`, 195-invoiceDateWidth-invoiceDateTagWidth, 83);
    doc.text(`${billTo.dueDateTag}`, 195-invoiceDateWidth-dueDateTagWidth, 93);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(`${billTo.invoiceDate}`, 195-invoiceDateWidth, 83);
    doc.text(`${billTo.dueDate}`, 195-dueDateWidth, 93);
    

    // Table Created
    const listData = createDataList(invoiceData.itemList);

    var offset = 0;
    

    const header = [
      [
        "Sr.",
        `${invoiceData.itemTag}`,
        "HSN/SAC",
        `${invoiceData.quantityTag}`,
        `${invoiceData.rateTag}`,
        "IGST",
        "Cess",
        `${invoiceData.amountTag}`,
      ],
    ];

    doc.autoTable({
      head: header,
      body: listData,
      startY: 110, // Set Y offset for the table

      // Header styles
      headStyles: {
        fillColor: headerColor, // Set your desired header color
        textColor: [255, 255, 255], // White text for the header
        lineWidth: 0, // Ensure no border for header
      },

      // Body styles
      bodyStyles: {
        textColor: [0, 0, 0], // Black text for body rows
        fillColor: [255, 255, 255], // Ensure white background for body rows
        lineWidth: 0, // Ensure no default borders for body rows
      },

      // Global table styles
      styles: {
        cellPadding: 4,
        fillColor: [255, 255, 255], // Set the fill color for all body rows to white
        lineWidth: 0, // Ensure no default borders globally
      },

      didDrawCell: (data) => {
        // Only draw the line after the last cell in each row
        const { cell } = data;
        const { x, y, width, height } = cell;
        doc.setDrawColor(...headerColor); // Black line
        doc.setLineWidth(0.5); // Set line width once, consistent for all cells
        doc.line(x, y + height, x + width, y + height); // Draw a line below the cell
        offset = y + height;
      },
      theme: "plain",
    });


    doc.setFont("helvetica", "normal");
    
    const subTotalWidth = doc.getTextWidth(`${invoiceData.subTotal.toFixed(2)}`);
    const totalIGSTWidth = doc.getTextWidth(`${invoiceData.totalIGST.toFixed(2)}`);
    const totalCESSWidth = doc.getTextWidth(`${invoiceData.totalCESS.toFixed(2)}`);
    const grandTotalWidth = doc.getTextWidth(`${invoiceData.grandTotal.toFixed(2)}`);
    const currencySymbolWidth = doc.getTextWidth(`${invoiceData.currencySymbol}`);

    offset+=15;
    
    doc.setFontSize(9);

    doc.text(`${invoiceData.subTotalTag}`, 130, offset);
    doc.text(`${invoiceData.subTotal.toFixed(2)}`, 191-subTotalWidth, offset);
    doc.text("IGST", 130, offset + 10);
    doc.text(`${invoiceData.totalIGST.toFixed(2)}`, 191-totalIGSTWidth, offset + 10);
    doc.text("CESS", 130, offset + 20);
    doc.text(`${invoiceData.totalCESS.toFixed(2)}`, 191-totalCESSWidth, offset + 20);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    
    doc.text(`${invoiceData.totalTag}`, 130, offset + 30);
    doc.text(`${invoiceData.currencySymbol}`, 191-grandTotalWidth-currencySymbolWidth-1, offset + 30);
    doc.text(`${invoiceData.grandTotal.toFixed(2)}`, 191-grandTotalWidth, offset + 30);
    
    offset+=30;

    doc.setFont("helvetica", "normal");
    // Notes
    doc.text(`${formData.notesTag}`, 15, offset + 30);
    doc.text(`${formData.notesText}`, 15, offset + 39);
    
    doc.output("dataurlnewwindow");

    // Create a Blob object from the PDF
    const pdfData = doc.output("blob");

    // Get the iframe and set its source as the PDF blob URL
    const iframe = document.getElementById("pdf-preview");
    iframe.src = URL.createObjectURL(pdfData);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(25);
    
    const invoiceTopTagWidth = doc.getTextWidth(`${formData.invoiceTag}`);
    doc.text(`${formData.invoiceTag}`, 195-invoiceTopTagWidth, 32);

    // Make sure robotoMediumBase64 is correctly defined
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`${formData.company}`, 15, 25);

    doc.setFontSize(11);
    doc.addFont("Roboto-Medium.ttf", "Roboto-Medium", "normal");
    doc.setFont("Roboto-Medium", "normal");

    doc.text(`${formData.name}`, 15, 30);
    doc.text(`${formData.address}`, 15, 35);
    doc.text(`${formData.city}`, 15, 40);
    doc.text(`${formData.state}`, 15, 45);
    doc.text(`${formData.country}`, 15, 50);
    doc.text(`GSTIN ${formData.gstin}`, 15, 55);

    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102);
    doc.text(`${billTo.billToTag}`, 15, 65);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(`${billTo.clientCompany}`, 15, 70);
    doc.text(`${billTo.clientAddress}`, 15, 75);
    doc.text(`${billTo.clientCity}`, 15, 80);
    doc.text(`${billTo.clientCountry}`, 15, 85);
    doc.text(`GSTIN ${billTo.clientGstin}`, 15, 90);

    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102);
    doc.text(`Place Of Supply: ${billTo.clientState}`, 15, 100);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const invoiceTopNumber = doc.getTextWidth(`${billTo.invoiceNumber}`);
    const invoiceNumberTopTag = doc.getTextWidth(`${billTo.invoiceNumberTag}`);
    doc.text(`${billTo.invoiceNumberTag}`, 195-invoiceTopNumber-invoiceNumberTopTag-2, 38);
    doc.text(`${billTo.invoiceNumber}`, 195-invoiceTopNumber, 38);
    
    
    const invoiceDateWidth = doc.getTextWidth(`${billTo.invoiceDate}`);
    const invoiceDateTagWidth = doc.getTextWidth(`${billTo.invoiceDateTag}`);
    const dueDateWidth = doc.getTextWidth(`${billTo.dueDate}`);
    const dueDateTagWidth = doc.getTextWidth(`${billTo.dueDateTag}`);

    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102);
    doc.text(`${billTo.invoiceDateTag}`, 195-invoiceDateWidth-invoiceDateTagWidth, 83);
    doc.text(`${billTo.dueDateTag}`, 195-invoiceDateWidth-dueDateTagWidth, 93);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(`${billTo.invoiceDate}`, 195-invoiceDateWidth, 83);
    doc.text(`${billTo.dueDate}`, 195-dueDateWidth, 93);
    

    // Table Created
    const listData = createDataList(invoiceData.itemList);

    var offset = 0;
    

    const header = [
      [
        "Sr.",
        `${invoiceData.itemTag}`,
        "HSN/SAC",
        `${invoiceData.quantityTag}`,
        `${invoiceData.rateTag}`,
        "IGST",
        "Cess",
        `${invoiceData.amountTag}`,
      ],
    ];

    doc.autoTable({
      head: header,
      body: listData,
      startY: 110, // Set Y offset for the table

      // Header styles
      headStyles: {
        fillColor: headerColor, // Set your desired header color
        textColor: [255, 255, 255], // White text for the header
        lineWidth: 0, // Ensure no border for header
      },

      // Body styles
      bodyStyles: {
        textColor: [0, 0, 0], // Black text for body rows
        fillColor: [255, 255, 255], // Ensure white background for body rows
        lineWidth: 0, // Ensure no default borders for body rows
      },

      // Global table styles
      styles: {
        cellPadding: 4,
        fillColor: [255, 255, 255], // Set the fill color for all body rows to white
        lineWidth: 0, // Ensure no default borders globally
      },

      didDrawCell: (data) => {
        // Only draw the line after the last cell in each row
        const { cell } = data;
        const { x, y, width, height } = cell;
        doc.setDrawColor(...headerColor); // Black line
        doc.setLineWidth(0.5); // Set line width once, consistent for all cells
        doc.line(x, y + height, x + width, y + height); // Draw a line below the cell
        offset = y + height;
      },
      theme: "plain",
    });


    doc.setFont("helvetica", "normal");
    
    const subTotalWidth = doc.getTextWidth(`${invoiceData.subTotal.toFixed(2)}`);
    const totalIGSTWidth = doc.getTextWidth(`${invoiceData.totalIGST.toFixed(2)}`);
    const totalCESSWidth = doc.getTextWidth(`${invoiceData.totalCESS.toFixed(2)}`);
    const grandTotalWidth = doc.getTextWidth(`${invoiceData.grandTotal.toFixed(2)}`);
    const currencySymbolWidth = doc.getTextWidth(`${invoiceData.currencySymbol}`);

    offset+=15;
    
    doc.setFontSize(9);

    doc.text(`${invoiceData.subTotalTag}`, 130, offset);
    doc.text(`${invoiceData.subTotal.toFixed(2)}`, 191-subTotalWidth, offset);
    doc.text("IGST", 130, offset + 10);
    doc.text(`${invoiceData.totalIGST.toFixed(2)}`, 191-totalIGSTWidth, offset + 10);
    doc.text("CESS", 130, offset + 20);
    doc.text(`${invoiceData.totalCESS.toFixed(2)}`, 191-totalCESSWidth, offset + 20);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    
    doc.text(`${invoiceData.totalTag}`, 130, offset + 30);
    doc.text(`${invoiceData.currencySymbol}`, 191-grandTotalWidth-currencySymbolWidth-1, offset + 30);
    doc.text(`${invoiceData.grandTotal.toFixed(2)}`, 191-grandTotalWidth, offset + 30);
    
    offset+=30;

    doc.setFont("helvetica", "normal");
    // Notes
    doc.text(`${formData.notesTag}`, 15, offset + 30);
    doc.text(`${formData.notesText}`, 15, offset + 39);
    
    
    doc.save("tax-invoice.pdf");
  };

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

  const [formData, setFormData] = useState({
    invoiceTag: "TAX INVOICE",
    company: "",
    name: "",
    gstin: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    notesTag: "Notes",
    notesText: "It was great doing business with you.",
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value, // Update the specific field in formData
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0]; // Get the first selected file
    if (file) {
      const reader = new FileReader(); // Create a FileReader instance
      reader.onloadend = () => {
        setUploadedImage(reader.result); // Set the image URL in state
      };
      reader.readAsDataURL(file); // Read file as Data URL
    }
    setInitialSetup(false);
  };

  const [billTo, setBillTo] = useState({
    billToTag: "Bill To:",
    clientCompany: "",
    clientGstin: "",
    clientAddress: "",
    clientCity: "",
    clientState: "",
    clientCountry: "India",
    invoiceNumberTag: "Invoice#",
    invoiceNumber: "INV-01",
    invoiceDateTag: "Invoice Date :",
    invoiceDate: "",
    dueDateTag: "Due Date :",
    dueDate: "",
  });

  const [invoiceData, setInvoiceData] = useState({
    itemTag: "Item Description",
    quantityTag: "Qty",
    rateTag: "Rate",
    amountTag: "Amount",
    subTotalTag: "Sub Total", // Added for subtotal tag name
    totalTag: "Total", // Added for total tag name
    itemList: [], // List of items
    state: "",
    country: "India",
    subTotal: 0,
    totalIGST: 0,
    totalCESS: 0,
    grandTotal: 0,
    currencySymbol: "", // Added currency symbol
  });

  const handleDeleteImage = () => {
    setUploadedImage(null);
    setInitialSetup(true);
  };

  const selectHeaderColor = (color) => {
    setSelectedColor(color);
    if (color === "black") setHeaderColor([0, 0, 0]);
    else if (color === "orange-500") setHeaderColor([255, 165, 0]);
    else if (color === "blue-500") setHeaderColor([0, 0, 255]);
    else if (color === "green-500") setHeaderColor([0, 128, 0]);
    else if (color === "red-500") setHeaderColor([255, 0, 0]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100 p-8">
      <div className="min-w-[350px] shadow-2xl bg-white p-6 rounded-lg shadow-md">
        <header className="bg-white p-3 rounded-[13px] mb-3">
          <h1 className="text-4xl text-center font-bold bg-white font-extrabold font-serif text-[hsl(0,0%,40%)]">
            GST <span className="text-purple-600">Invoice Generator</span>
          </h1>
        </header>

        <main className="w-full lg:px-8 py-4">
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
                      <span className="mt-2 text-blue-600 font-medium">
                        Upload
                      </span>
                    </label>
                    <div>
                      <h3 className="text-lg font-semibold text-[hsl(0,0%,40%)] whitespace-nowrap">
                        Upload Logo
                      </h3>
                      <p className="text-sm text-gray-500">
                        (240 x 240 pixels)
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Preview the uploaded image */}
              {!initialSetup && (
                <div className="lg:w-[40%] flex group">
                  <div className="py-1 border border-white hover:border hover:border-purple-300 focus:border-purple-300 px-5 rounded-lg">
                    <img
                      src={uploadedImage}
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

          <div className="border-b border-[hsl(0,0%,87%)] my-3"></div>

          {/* Bill To */}
          <BillTo billTo={billTo} setBillTo={setBillTo} />

          <div className="border-b border-[hsl(0,0%,87%)] my-3"></div>

          {/* Invoice Items */}

          <InvoiceItems
            invoiceData={invoiceData}
            setInvoiceData={setInvoiceData}
          />

          <div className="mt-8">
            <input className="w-full rounded-lg border border-white hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,40%)] font-medium mb-1" 
            value={formData.notesTag}
            onChange={handleChange}
            name="notesTag"
            />
            <textarea
              rows={4}
              onChange={handleChange}
              value={formData.notesText}
              name="notesText"
              className="w-full rounded-lg border border-white hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,40%)] text-sm"
            ></textarea>
          </div>
        </main>

        <div className=" min-h-[70vh] bg-white p-6 flex flex-col gap-7 ">
          <h2 className="text-4xl font-bold text-purple-500 font-extrabold">
            Download Invoice
          </h2>

          <div className="flex items-center gap-8">
            <h3 className="font-semibold text-[hsl(0,0%,50%)] text-xl">
              Theme
            </h3>
            <div className="flex space-x-3">              
                  <button
                    onClick={() => selectHeaderColor("black")}
                    className={`flex items-center justify-center w-6 h-6 rounded-full bg-black ${
                       selectedColor === 'black'
                        ? "ring-2 ring-offset-2 ring-black"
                        : ""
                    }`}
                  >
                    <svg
                      xmlSpace="preserve"
                      viewBox="0 0 24 24"
                      className={`w-[15px] h-[15px] text-sm hover:opacity-[0.9] ${
                        selectedColor === 'black' ? "opacity-[0.9]" : "opacity-0"
                      } opacity-0`}
                      alt="Gray Color"
                    >
                      <path
                        d="M8.9 20.7c-.6 0-1.2-.2-1.6-.6L1 15c-1.1-.9-1.3-2.5-.4-3.6s2.5-1.3 3.6-.4l4.5 3.7L19.6 4c1-1 2.7-1 3.7 0s1 2.7 0 3.7L10.7 20c-.5.5-1.2.7-1.8.7z"
                        fill="#fff"
                      ></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => selectHeaderColor("orange-500")}
                    className={`flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 ${
                      selectedColor === 'orange-500'
                       ? "ring-2 ring-offset-2 ring-orange-500"
                       : ""
                   }`}
                  >
                    <svg
                      xmlSpace="preserve"
                      viewBox="0 0 24 24"
                      className={`w-[15px] h-[15px] text-sm hover:opacity-[0.9] ${
                        selectedColor === 'orange-500' ? "opacity-[0.9]" : "opacity-0"
                      } opacity-0`}
                      alt="Gray Color"
                    >
                      <path
                        d="M8.9 20.7c-.6 0-1.2-.2-1.6-.6L1 15c-1.1-.9-1.3-2.5-.4-3.6s2.5-1.3 3.6-.4l4.5 3.7L19.6 4c1-1 2.7-1 3.7 0s1 2.7 0 3.7L10.7 20c-.5.5-1.2.7-1.8.7z"
                        fill="#fff"
                      ></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => selectHeaderColor("blue-500")}
                    className={`flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 ${
                      selectedColor === 'blue-500'
                       ? "ring-2 ring-offset-2 ring-blue-500"
                       : ""
                   }`}
                  >
                    <svg
                      xmlSpace="preserve"
                      viewBox="0 0 24 24"
                      className={`w-[15px] h-[15px] text-sm hover:opacity-[0.9] ${
                        selectedColor === 'blue-500' ? "opacity-[0.9]" : "opacity-0"
                      } opacity-0`}
                      alt="Gray Color"
                    >
                      <path
                        d="M8.9 20.7c-.6 0-1.2-.2-1.6-.6L1 15c-1.1-.9-1.3-2.5-.4-3.6s2.5-1.3 3.6-.4l4.5 3.7L19.6 4c1-1 2.7-1 3.7 0s1 2.7 0 3.7L10.7 20c-.5.5-1.2.7-1.8.7z"
                        fill="#fff"
                      ></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => selectHeaderColor("green-500")}
                    className={`flex items-center justify-center w-6 h-6 rounded-full bg-green-500 ${
                      selectedColor === 'green-500'
                       ? "ring-2 ring-offset-2 ring-green-500"
                       : ""
                   }`}
                  >
                    <svg
                      xmlSpace="preserve"
                      viewBox="0 0 24 24"
                      className={`w-[15px] h-[15px] text-sm hover:opacity-[0.9] ${
                        selectedColor === 'green-500' ? "opacity-[0.9]" : "opacity-0"
                      } opacity-0`}
                      alt="Gray Color"
                    >
                      <path
                        d="M8.9 20.7c-.6 0-1.2-.2-1.6-.6L1 15c-1.1-.9-1.3-2.5-.4-3.6s2.5-1.3 3.6-.4l4.5 3.7L19.6 4c1-1 2.7-1 3.7 0s1 2.7 0 3.7L10.7 20c-.5.5-1.2.7-1.8.7z"
                        fill="#fff"
                      ></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => selectHeaderColor("red-500")}
                    className={`flex items-center justify-center w-6 h-6 rounded-full bg-red-500 ${
                      selectedColor === 'red-500'
                       ? "ring-2 ring-offset-2 ring-red-500"
                       : ""
                   }`}
                  >
                    <svg
                      xmlSpace="preserve"
                      viewBox="0 0 24 24"
                      className={`w-[15px] h-[15px] text-sm hover:opacity-[0.9] ${
                        selectedColor === 'red-500' ? "opacity-[0.9]" : "opacity-0"
                      } opacity-0`}
                      alt="Gray Color"
                    >
                      <path
                        d="M8.9 20.7c-.6 0-1.2-.2-1.6-.6L1 15c-1.1-.9-1.3-2.5-.4-3.6s2.5-1.3 3.6-.4l4.5 3.7L19.6 4c1-1 2.7-1 3.7 0s1 2.7 0 3.7L10.7 20c-.5.5-1.2.7-1.8.7z"
                        fill="#fff"
                      ></path>
                    </svg>
                  </button>
            </div>
          </div>

          <div className="border-b-2 border-[hsl(0,0%,87%)]"></div>

          <div className="flex space-x-3 gap-14 justify-between">
            <button
              className="w-[30%] bg-gradient-to-br from-purple-100 to-indigo-100 hover:from-purple-00 hover:to-indigo-300 transition-all duration-300 transform hover:scale-105 hover:text-white font-medium py-2 px-4 rounded-[10px] flex items-center justify-center"
              onClick={generateAndPreviewPDF}
            >
              Preview Invoice
            </button>
            <div className="relative group">
              <button className="w-full transition-all duration-300 transform hover:scale-105 border-2 border-[hsl(0,0%,80%)] py-2 rounded-[10px] flex items-center justify-center gap-2  hover:bg-gray-100 font-medium px-4">
                <h2 className="flex max-sm:flex-col">Download/
                <span>Print</span></h2>
                <FaAngleDown />
              </button>
              <div className="absolute hidden group-hover:block rounded-lg w-full">
                <div className="block p-[4px] text-gray-800 hover:bg-gray-100 font-medium">
                  <div className="flex items-center bg-gradient-to-br hover:from-purple-300 hover:to-indigo-300 transition-all duration-300 transform hover:text-white rounded-lg px-4 py-2 gap-2 cursor-pointer">
                    <FcPrint className="w-[28px] h-[23px]" />
                    Print
                  </div>
                </div>
                <div className="block p-[4px] text-gray-800 hover:bg-gray-100 font-medium">
                  <div
                    className="flex items-center bg-gradient-to-br hover:from-purple-300 hover:to-indigo-300 transition-all duration-300 transform hover:text-white rounded-lg px-4 py-2 gap-2 cursor-pointer"
                    onClick={generatePDF}
                  >
                    <MdOutlineDownloadForOffline className="w-[28px] h-[23px] text-black" />
                    Download
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
