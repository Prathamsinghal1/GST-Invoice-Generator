import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaAngleDown, FaCheckCircle } from "react-icons/fa";
import { FcPrint } from "react-icons/fc";
import { MdOutlineDownloadForOffline } from "react-icons/md";
import BillTo from "./Components/BillTo/BillTo";
import InvoiceItems from "./Components/Invoice/InvoiceItems";
import CompanyFrom from "./Components/Company/CompanyFrom";
import { VscPreview } from "react-icons/vsc";

export default function App() {
  const [selectedColor, setSelectedColor] = useState("orange-500");
  const [headerColor, setHeaderColor] = useState([255, 165, 0]);

  function createDataList(itemList) {
    return itemList.map((item, index) => [
      index + 1, // Sr. No (Index of the item starting from 1)
      item.itemName,
      item.hsn, // Description (Item Name)
      item.quantity, // Quantity
      item.value, // Price
      `${((item.igst * item.quantity * item.value) / 100).toFixed(2)} (${
        item.igst
      }%)`, // igst
      `${((item.cess * item.quantity * item.value) / 100).toFixed(2)} (${
        item.cess
      }%)`,
      (item.quantity * item.value).toFixed(2), // Amount (Price multiplied by Quantity)
    ]);
  }

  const generateAndPreviewPDF = () => {
    const doc = new jsPDF();

    var offset = 20;

    // Adding Image
    if (formData.imageSrc && formData.imageExtension) {
      offset = 15;
      try {
        doc.addImage(
          formData.imageSrc,
          formData.imageExtension,
          15,
          offset,
          25,
          25
        );
      } catch (error) {
        alert(`Image not supported, try again!`);
      }
      offset += 30;
    }

    doc.setFontSize(25);

    const invoiceTopTagWidth = doc.getTextWidth(`${formData.invoiceTag}`);
    doc.text(`${formData.invoiceTag}`, 195 - invoiceTopTagWidth, 32);

    // Make sure robotoMediumBase64 is correctly defined
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`${formData.company}`, 15, (offset += 5));

    doc.setFontSize(11);
    doc.addFont("Roboto-Medium.ttf", "Roboto-Medium", "normal");
    doc.setFont("Roboto-Medium", "normal");

    doc.text(
      `${
        formData.name === "" ? "_______________________________" : formData.name
      }`,
      15,
      (offset += 5)
    );
    doc.text(
      `${
        formData.address === ""
          ? "_______________________________"
          : formData.address
      }`,
      15,
      (offset += 5)
    );
    doc.text(
      `${formData.city === "" ? "________________" : formData.city}`,
      15,
      (offset += 5)
    );
    doc.text(
      `${formData.state === "" ? "________________" : formData.state}`,
      15,
      (offset += 5)
    );
    doc.text(`${formData.country}`, 15, (offset += 5));
    doc.text(
      `GSTIN ${formData.gstin === "" ? "________________" : formData.gstin}`,
      15,
      (offset += 5)
    );

    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102);
    doc.text(`${billTo.billToTag}`, 15, (offset += 5));

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(
      `${
        billTo.clientCompany === ""
          ? "_______________________________"
          : billTo.clientCompany
      }`,
      15,
      (offset += 5)
    );
    doc.text(
      `${
        billTo.clientAddress === ""
          ? "_______________________________"
          : billTo.clientAddress
      }`,
      15,
      (offset += 5)
    );
    doc.text(
      `${billTo.clientCity === "" ? "________________" : billTo.clientCity}`,
      15,
      (offset += 5)
    );
    doc.text(`${billTo.clientCountry}`, 15, (offset += 5));
    doc.text(
      `GSTIN ${
        billTo.clientGstin === "" ? "________________" : billTo.clientGstin
      }`,
      15,
      (offset += 5)
    );

    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102);
    doc.text(
      `Place Of Supply: ${
        billTo.clientState === "" ? "________________" : billTo.clientState
      }`,
      15,
      (offset += 10)
    );

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const invoiceTopNumber = doc.getTextWidth(`${billTo.invoiceNumber}`);
    const invoiceNumberTopTag = doc.getTextWidth(`${billTo.invoiceNumberTag}`);
    doc.text(
      `${billTo.invoiceNumberTag}`,
      195 - invoiceTopNumber - invoiceNumberTopTag - 2,
      38
    );
    doc.text(`${billTo.invoiceNumber}`, 195 - invoiceTopNumber, 38);

    const invoiceDateWidth = doc.getTextWidth(`${billTo.invoiceDate}`);
    const invoiceDateTagWidth = doc.getTextWidth(`${billTo.invoiceDateTag}`);
    const dueDateWidth = doc.getTextWidth(`${billTo.dueDate}`);
    const dueDateTagWidth = doc.getTextWidth(`${billTo.dueDateTag}`);

    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102);
    doc.text(
      `${billTo.invoiceDateTag}`,
      195 - invoiceDateWidth - invoiceDateTagWidth,
      offset - 17
    );
    doc.text(
      `${billTo.dueDateTag}`,
      195 - invoiceDateWidth - dueDateTagWidth,
      offset - 7
    );
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(`${billTo.invoiceDate}`, 195 - invoiceDateWidth, offset - 17);
    doc.text(`${billTo.dueDate}`, 195 - dueDateWidth, offset - 7);

    // Table Created
    const listData = createDataList(invoiceData.itemList);

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

    offset += 10;

    doc.autoTable({
      head: header,
      body: listData,
      startY: offset, // Set Y offset for the table

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

    const subTotalWidth = doc.getTextWidth(
      `${invoiceData.subTotal.toFixed(2)}`
    );
    const totalIGSTWidth = doc.getTextWidth(
      `${invoiceData.totalIGST.toFixed(2)}`
    );
    const totalCESSWidth = doc.getTextWidth(
      `${invoiceData.totalCESS.toFixed(2)}`
    );
    const grandTotalWidth = doc.getTextWidth(
      `${invoiceData.grandTotal.toFixed(2)}`
    );
    const currencySymbolWidth = doc.getTextWidth(
      `${invoiceData.currencySymbol}`
    );

    offset += 15;

    doc.setFontSize(9);

    doc.text(`${invoiceData.subTotalTag}`, 130, offset);
    doc.text(`${invoiceData.subTotal.toFixed(2)}`, 191 - subTotalWidth, offset);
    doc.text("IGST", 130, offset + 10);
    doc.text(
      `${invoiceData.totalIGST.toFixed(2)}`,
      191 - totalIGSTWidth,
      offset + 10
    );
    doc.text("CESS", 130, offset + 20);
    doc.text(
      `${invoiceData.totalCESS.toFixed(2)}`,
      191 - totalCESSWidth,
      offset + 20
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);

    doc.text(`${invoiceData.totalTag}`, 130, offset + 30);
    doc.text(
      `${invoiceData.currencySymbol}`,
      191 - grandTotalWidth - currencySymbolWidth - 1,
      offset + 30
    );
    doc.text(
      `${invoiceData.grandTotal.toFixed(2)}`,
      191 - grandTotalWidth,
      offset + 30
    );

    offset += 30;

    doc.setFont("helvetica", "normal");
    // Notes
    doc.text(`${formData.notesTag}`, 15, offset + 30);
    doc.text(`${formData.notesText}`, 15, offset + 39);

    doc.output("dataurlnewwindow");

    // Create a Blob object from the PDF
    const pdfData = doc.output("blob");
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    var offset = 20;

    // Adding Image
    if (formData.imageSrc && formData.imageExtension) {
      offset = 15;
      try {
        doc.addImage(
          formData.imageSrc,
          formData.imageExtension,
          15,
          offset,
          25,
          25
        );
      } catch (error) {
        alert(`Image not supported, try again!`);
      }
      offset += 30;
    }

    doc.setFontSize(25);

    const invoiceTopTagWidth = doc.getTextWidth(`${formData.invoiceTag}`);
    doc.text(`${formData.invoiceTag}`, 195 - invoiceTopTagWidth, 32);

    // Make sure robotoMediumBase64 is correctly defined
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`${formData.company}`, 15, (offset += 5));

    doc.setFontSize(11);
    doc.addFont("Roboto-Medium.ttf", "Roboto-Medium", "normal");
    doc.setFont("Roboto-Medium", "normal");

    doc.text(
      `${
        formData.name === "" ? "_______________________________" : formData.name
      }`,
      15,
      (offset += 5)
    );
    doc.text(
      `${
        formData.address === ""
          ? "_______________________________"
          : formData.address
      }`,
      15,
      (offset += 5)
    );
    doc.text(
      `${formData.city === "" ? "________________" : formData.city}`,
      15,
      (offset += 5)
    );
    doc.text(
      `${formData.state === "" ? "________________" : formData.state}`,
      15,
      (offset += 5)
    );
    doc.text(`${formData.country}`, 15, (offset += 5));
    doc.text(
      `GSTIN ${formData.gstin === "" ? "________________" : formData.gstin}`,
      15,
      (offset += 5)
    );

    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102);
    doc.text(`${billTo.billToTag}`, 15, (offset += 5));

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(
      `${
        billTo.clientCompany === ""
          ? "_______________________________"
          : billTo.clientCompany
      }`,
      15,
      (offset += 5)
    );
    doc.text(
      `${
        billTo.clientAddress === ""
          ? "_______________________________"
          : billTo.clientAddress
      }`,
      15,
      (offset += 5)
    );
    doc.text(
      `${billTo.clientCity === "" ? "________________" : billTo.clientCity}`,
      15,
      (offset += 5)
    );
    doc.text(`${billTo.clientCountry}`, 15, (offset += 5));
    doc.text(
      `GSTIN ${
        billTo.clientGstin === "" ? "________________" : billTo.clientGstin
      }`,
      15,
      (offset += 5)
    );

    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102);
    doc.text(
      `Place Of Supply: ${
        billTo.clientState === "" ? "________________" : billTo.clientState
      }`,
      15,
      (offset += 10)
    );

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const invoiceTopNumber = doc.getTextWidth(`${billTo.invoiceNumber}`);
    const invoiceNumberTopTag = doc.getTextWidth(`${billTo.invoiceNumberTag}`);
    doc.text(
      `${billTo.invoiceNumberTag}`,
      195 - invoiceTopNumber - invoiceNumberTopTag - 2,
      38
    );
    doc.text(`${billTo.invoiceNumber}`, 195 - invoiceTopNumber, 38);

    const invoiceDateWidth = doc.getTextWidth(`${billTo.invoiceDate}`);
    const invoiceDateTagWidth = doc.getTextWidth(`${billTo.invoiceDateTag}`);
    const dueDateWidth = doc.getTextWidth(`${billTo.dueDate}`);
    const dueDateTagWidth = doc.getTextWidth(`${billTo.dueDateTag}`);

    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102);
    doc.text(
      `${billTo.invoiceDateTag}`,
      195 - invoiceDateWidth - invoiceDateTagWidth,
      offset - 17
    );
    doc.text(
      `${billTo.dueDateTag}`,
      195 - invoiceDateWidth - dueDateTagWidth,
      offset - 7
    );
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(`${billTo.invoiceDate}`, 195 - invoiceDateWidth, offset - 17);
    doc.text(`${billTo.dueDate}`, 195 - dueDateWidth, offset - 7);

    // Table Created
    const listData = createDataList(invoiceData.itemList);

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

    offset += 10;

    doc.autoTable({
      head: header,
      body: listData,
      startY: offset, // Set Y offset for the table

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

    const subTotalWidth = doc.getTextWidth(
      `${invoiceData.subTotal.toFixed(2)}`
    );
    const totalIGSTWidth = doc.getTextWidth(
      `${invoiceData.totalIGST.toFixed(2)}`
    );
    const totalCESSWidth = doc.getTextWidth(
      `${invoiceData.totalCESS.toFixed(2)}`
    );
    const grandTotalWidth = doc.getTextWidth(
      `${invoiceData.grandTotal.toFixed(2)}`
    );
    const currencySymbolWidth = doc.getTextWidth(
      `${invoiceData.currencySymbol}`
    );

    offset += 15;

    doc.setFontSize(9);

    doc.text(`${invoiceData.subTotalTag}`, 130, offset);
    doc.text(`${invoiceData.subTotal.toFixed(2)}`, 191 - subTotalWidth, offset);
    doc.text("IGST", 130, offset + 10);
    doc.text(
      `${invoiceData.totalIGST.toFixed(2)}`,
      191 - totalIGSTWidth,
      offset + 10
    );
    doc.text("CESS", 130, offset + 20);
    doc.text(
      `${invoiceData.totalCESS.toFixed(2)}`,
      191 - totalCESSWidth,
      offset + 20
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);

    doc.text(`${invoiceData.totalTag}`, 130, offset + 30);
    doc.text(
      `${invoiceData.currencySymbol}`,
      191 - grandTotalWidth - currencySymbolWidth - 1,
      offset + 30
    );
    doc.text(
      `${invoiceData.grandTotal.toFixed(2)}`,
      191 - grandTotalWidth,
      offset + 30
    );

    offset += 30;

    doc.setFont("helvetica", "normal");
    // Notes
    doc.text(`${formData.notesTag}`, 15, offset + 30);
    doc.text(`${formData.notesText}`, 15, offset + 39);

    doc.save("tax-invoice.pdf");
  };

  const [formData, setFormData] = useState({
    imageSrc: null,
    imageExtension: null,
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

  useEffect(() => {
    if (formData.imageSrc)
      setFormData((prevState) => ({
        ...prevState,
        ["imageExtension"]: formData.imageSrc.split(";")[0].split("/")[1],
      }));
  }, [formData.imageSrc]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value, // Update the specific field in formData
    }));
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

  const selectHeaderColor = (color) => {
    setSelectedColor(color);
    if (color === "black") setHeaderColor([0, 0, 0]);
    else if (color === "orange-500") setHeaderColor([255, 165, 0]);
    else if (color === "blue-500") setHeaderColor([0, 0, 255]);
    else if (color === "green-500") setHeaderColor([0, 128, 0]);
    else if (color === "red-500") setHeaderColor([255, 0, 0]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100 p-8 max-sm:px-2">
      <div className="min-w-[270px] shadow-2xl bg-white p-6 rounded-lg shadow-md">
        <header className="bg-white p-3 rounded-[13px] mb-3">
          <h1 className="text-4xl text-center font-bold bg-white font-extrabold font-serif text-[hsl(0,0%,40%)]">
            GST <span className="text-purple-600">Invoice Generator</span>
          </h1>
        </header>

        <main className="w-full lg:px-8 py-4">
          {/* Bill From */}
          <CompanyFrom formData={formData} setFormData={setFormData} />
          <div className="border-b border-[hsl(0,0%,87%)] my-3"></div>

          {/* Bill To */}
          <BillTo billTo={billTo} setBillTo={setBillTo} />

          <div className="border-b border-[hsl(0,0%,87%)] my-3"></div>

          {/* Invoice Items */}

          <InvoiceItems
            invoiceData={invoiceData}
            setInvoiceData={setInvoiceData}
          />

          {/* Notes */}
          <div className="mt-8">
            <input
              className="w-full rounded-lg border border-white hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,40%)] font-medium mb-1"
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

        <div className="bg-white p-6 flex flex-col gap-7 ">
          <h2 className="text-4xl font-bold text-purple-500 font-extrabold">
            Download Invoice
          </h2>

          <div className="flex items-center gap-8">
            <h3 className="font-semibold text-[hsl(0,0%,50%)] text-xl">
              Theme
            </h3>
            <div className="flex max-[375px]:grid max-[375px]:grid-cols-3 max-[375px]:gap-y-5 gap-x-4 ">
              <FaCheckCircle
                onClick={() => selectHeaderColor("orange-500")}
                className={`w-6 h-6 rounded-full hover:bg-white text-orange-500 ${
                  selectedColor === "orange-500"
                    ? "ring-2 ring-offset-2 ring-orange-500 "
                    : "bg-orange-500"
                }`}
              />

              <FaCheckCircle
                onClick={() => selectHeaderColor("black")}
                className={`w-6 h-6 rounded-full hover:bg-white ${
                  selectedColor === "black"
                    ? "ring-2 ring-offset-2 ring-black"
                    : "bg-black"
                }`}
              />

              <FaCheckCircle
                onClick={() => selectHeaderColor("blue-500")}
                className={`w-6 h-6 rounded-full hover:bg-white text-blue-500 ${
                  selectedColor === "blue-500"
                    ? "ring-2 ring-offset-2 ring-blue-500"
                    : "bg-blue-500"
                }`}
              />
  
              <FaCheckCircle
                onClick={() => selectHeaderColor("green-500")}
                className={`w-6 h-6 rounded-full hover:bg-white text-green-500 ${
                  selectedColor === "green-500"
                    ? "ring-2 ring-offset-2 ring-green-500"
                    : "bg-green-500"
                }`}
              />

              <FaCheckCircle
                onClick={() => selectHeaderColor("red-500")}
                className={`w-6 h-6 rounded-full hover:bg-white text-red-500 ${
                  selectedColor === "red-500"
                    ? "ring-2 ring-offset-2 ring-red-500"
                    : "bg-red-500"
                }`}
              />
            </div>
          </div>

          <div className="border-b-2 border-[hsl(0,0%,87%)]"></div>

          <div className="h-[120px] flex flex-col items-center justify-center">
          <div className="w-full flex space-x-3 justify-between">
            <button
              className="max-[350px]:w-[45%] max-[665px]:w-[40%] max-[740px]:w-[35%] w-[30%] bg-gradient-to-br from-purple-100 to-indigo-100 hover:from-purple-00 hover:to-indigo-300 transition-all duration-300 transform hover:scale-105 hover:text-white font-medium py-4 px-4 rounded-[10px] flex items-center justify-center gap-2 relative group"
              onClick={generateAndPreviewPDF}
            >
              <VscPreview className="w-full h-full absolute text-white hidden group-hover:block " />
              <span className="group-hover:hidden block w-full h-full flex justify-center items-center text-xl">
                Preview Invoice
              </span>
            </button>
            <button
              className="max-[350px]:w-[50%] max-[410px]:w-[45%] max-[665px]:w-[40%] max-[740px]:w-[35%] w-[30%] bg-gradient-to-br from-purple-100 to-indigo-100 hover:from-purple-00 hover:to-indigo-300 transition-all duration-300 transform hover:scale-105 hover:text-white font-medium py-4 px-4 rounded-[10px] flex items-center justify-center gap-2 relative group"
              onClick={generatePDF}
            >
              <MdOutlineDownloadForOffline className="w-full h-full absolute text-white hidden group-hover:block " />
              <span className="group-hover:hidden block w-full h-full flex justify-center items-center text-xl">
                Download
              </span>
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
