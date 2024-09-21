import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import TableItem from "./TableItem";

export default function InvoiceItems({invoiceData,setInvoiceData}) {

  const currencies = [
    { name: "US Dollar", code: "USD", symbol: "$" },
    { name: "Euro", code: "EUR", symbol: "€" },
    { name: "British Pound", code: "GBP", symbol: "£" },
    { name: "Japanese Yen", code: "JPY", symbol: "¥" },
    { name: "Australian Dollar", code: "AUD", symbol: "A$" },
    { name: "Canadian Dollar", code: "CAD", symbol: "C$" },
    { name: "Swiss Franc", code: "CHF", symbol: "CHF" },
    { name: "Chinese Yuan", code: "CNY", symbol: "¥" },
    { name: "Indian Rupee", code: "INR", symbol: "₹" },
    { name: "South Korean Won", code: "KRW", symbol: "₩" },
    { name: "Singapore Dollar", code: "SGD", symbol: "S$" },
    { name: "Hong Kong Dollar", code: "HKD", symbol: "HK$" },
    { name: "New Zealand Dollar", code: "NZD", symbol: "NZ$" },
    { name: "Mexican Peso", code: "MXN", symbol: "$" },
    { name: "Russian Ruble", code: "RUB", symbol: "₽" },
    { name: "Brazilian Real", code: "BRL", symbol: "R$" },
    { name: "South African Rand", code: "ZAR", symbol: "R" },
    { name: "Norwegian Krone", code: "NOK", symbol: "kr" },
    { name: "Swedish Krona", code: "SEK", symbol: "kr" },
    { name: "Danish Krone", code: "DKK", symbol: "kr" },
    { name: "Turkish Lira", code: "TRY", symbol: "₺" },
    { name: "Thai Baht", code: "THB", symbol: "฿" },
    { name: "Malaysian Ringgit", code: "MYR", symbol: "RM" },
    { name: "Indonesian Rupiah", code: "IDR", symbol: "Rp" },
    { name: "Philippine Peso", code: "PHP", symbol: "₱" },
    { name: "Israeli New Shekel", code: "ILS", symbol: "₪" },
    { name: "Chilean Peso", code: "CLP", symbol: "$" },
    { name: "Colombian Peso", code: "COP", symbol: "$" },
    { name: "Argentine Peso", code: "ARS", symbol: "$" },
    { name: "Vietnamese Dong", code: "VND", symbol: "₫" },
    { name: "Ukrainian Hryvnia", code: "UAH", symbol: "₴" },
    { name: "Czech Koruna", code: "CZK", symbol: "Kč" },
    { name: "Hungarian Forint", code: "HUF", symbol: "Ft" },
    { name: "Romanian Leu", code: "RON", symbol: "lei" },
    { name: "Bulgarian Lev", code: "BGN", symbol: "лв" },
    { name: "Serbian Dinar", code: "RSD", symbol: "дин" },
    { name: "Egyptian Pound", code: "EGP", symbol: "ج.م" },
    { name: "Kuwaiti Dinar", code: "KWD", symbol: "د.ك" },
    { name: "Bahraini Dinar", code: "BHD", symbol: ".د.ب" },
    { name: "Omani Rial", code: "OMR", symbol: "ر.ع." },
    { name: "Qatari Rial", code: "QAR", symbol: "ر.ق" },
    { name: "Saudi Riyal", code: "SAR", symbol: "ر.س" },
    { name: "UAE Dirham", code: "AED", symbol: "د.إ" },
    { name: "Jordanian Dinar", code: "JOD", symbol: "د.أ" },
    { name: "Lebanese Pound", code: "LBP", symbol: "ل.ل" },
    { name: "Moroccan Dirham", code: "MAD", symbol: "د.م." },
    { name: "Tunisian Dinar", code: "TND", symbol: "د.ت" },
    { name: "Algerian Dinar", code: "DZD", symbol: "د.ج" },
    { name: "Libyan Dinar", code: "LYD", symbol: "ل.د" },
    { name: "Iraqi Dinar", code: "IQD", symbol: "ع.د" },
  ];

  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [currencyVal, setCurrencyVal] = useState("₹");

  // Calculate subtotal, igst, and total
  useEffect(() => {
    const calculateTotals = () => {
      let subTotal = 0;
      let totalIGST = 0;
      let totalCESS = 0;

      invoiceData.itemList.forEach((item) => {
        const itemValue = parseFloat(item.value) || 0;
        const quantity = parseFloat(item.quantity) || 1;
        const igstPercentage = parseFloat(item.igst) || 0;
        const cessPercentage = parseFloat(item.cess) || 0;

        const itemSubTotal = itemValue * quantity;
        subTotal += itemSubTotal;

        totalIGST += itemValue * (igstPercentage / 100) * quantity;
        totalCESS += itemValue * (cessPercentage / 100) * quantity;
      });

      const grandTotal = subTotal + totalIGST + totalCESS;

      setInvoiceData((prevData) => ({
        ...prevData,
        subTotal,
        totalIGST,
        totalCESS,
        grandTotal,
      }));
    };

    calculateTotals();
    if(invoiceData.itemList.length===0){
      const newItem = {
        itemName: "",
        hsn: "",
        quantity: 1,
        value: "0.00",
        igst: "0",
        cess: "0",
      };
  
      setInvoiceData((prevData) => ({
        ...prevData,
        itemList: [...prevData.itemList, newItem], // Add new item to itemList
      }));
    }
  }, [invoiceData.itemList]);

  // Handle input changes for item and form data
  const handleChange = (event) => {
    const { name, value } = event.target;
    setInvoiceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Add a new line item
  const handleAddItem = () => {
    const newItem = {
      itemName: "",
      hsn: "",
      quantity: 1,
      value: "0.00",
      igst: "0",
      cess: "0",
    };

    setInvoiceData((prevData) => ({
      ...prevData,
      itemList: [...prevData.itemList, newItem], // Add new item to itemList
    }));
  };

  const handleCurrencyChange = (event) => {
    const selectedCurrency = event.target.value;
    const selectedSymbol = currencies.find(
      (currency) =>
        `${currency.code} - ${currency.name} (${currency.symbol})` ===
        selectedCurrency
    ).symbol;

    setCurrencyVal(selectedCurrency);
    setInvoiceData((prevData) => ({
      ...prevData,
      currencySymbol: selectedSymbol, // Store the selected symbol in form data
    }));
  };

  return (
    <div className="max-w-4xl overflow-hidden mt-6">
      <table className="text-sm text-left text-gray-700">
        <thead>
          <tr className="uppercase text-white py-10">
            <th className="px-4 py-2 max-sm:px-0 bg-purple-500 rounded-l-lg">
              <div className="w-[95%]">
                <input
                  type="text"
                  name="itemTag"
                  className="w-full rounded-lg border border-purple-500 hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 bg-purple-500 text-l cursor-pointer"
                  value={invoiceData.itemTag}
                  onChange={handleChange}
                />
              </div>
            </th>
            <th className="px-4 py-2 max-sm:px-0 bg-purple-500">
              <div className="w-[80%]">
                <input
                  type="text"
                  name="quantityTag"
                  className="w-full rounded-lg border border-purple-500 hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 bg-purple-500 text-l cursor-pointer"
                  value={invoiceData.quantityTag}
                  onChange={handleChange}
                />
              </div>
            </th>
            <th className="px-4 py-2 max-sm:px-0 bg-purple-500">
              <div className="w-[80%]">
                <input
                  type="text"
                  name="rateTag"
                  className="w-full rounded-lg border border-purple-500 hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 bg-purple-500 text-l cursor-pointer"
                  value={invoiceData.rateTag}
                  onChange={handleChange}
                />
              </div>
            </th>
            <th className="max-sm:hidden px-4 py-2 bg-purple-500">IGST</th>
            <th className="max-sm:hidden  px-4 py-2 bg-purple-500">Cess</th>
            <th className="px-4 py-2 max-sm:px-0 bg-purple-500 rounded-r-lg">
              <div className="w-[80%]">
                <input
                  type="text"
                  name="amountTag"
                  className="w-full rounded-lg border border-purple-500 hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 bg-purple-500 text-l cursor-pointer"
                  value={invoiceData.amountTag}
                  onChange={handleChange}
                />
              </div>
            </th>
          </tr>
        </thead>
        {invoiceData.itemList && invoiceData.itemList.length > 0 && (
  <TableItem invoiceData={invoiceData} setInvoiceData={setInvoiceData} />
)}
      </table>
      <div className="px-4 py-3 border-t border-gray-200 grid grid-cols-2">
        <button
          className="flex items-center text-blue-600 hover:text-blue-800 mb-auto"
          onClick={handleAddItem}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Line Item
        </button>
        <div className="px-4 py-3 bg-gray-50">
          <div className="space-y-1">
            <div className="min-h-[200px] flex flex-col justify-between">
              <div className="flex justify-between">
                <input
                  type="text"
                  name="subTotalTag"
                  value={invoiceData.subTotalTag}
                  className="w-[70%] rounded-lg border border-white hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-1 text-[hsl(0,0%,50%)] font-medium"
                  onChange={handleChange}
                />
                <span className="font-medium text-[hsl(0,0%,30%)] flex items-center">
                  {invoiceData.subTotal.toFixed(2)}
                </span>
              </div>

              <div className="max-sm:hidden flex justify-between">
                <span className="w-[70%] rounded-lg py-1 px-1 text-[hsl(0,0%,50%)] font-medium">
                  IGST
                </span>
                <span className="font-medium text-[hsl(0,0%,30%)] flex items-center">
                  {invoiceData.totalIGST.toFixed(2)}
                </span>
              </div>

              <div className="max-sm:hidden flex justify-between">
                <span className="w-[70%] rounded-lg py-1 px-1 text-[hsl(0,0%,50%)] font-medium">
                  CESS
                </span>
                <span className="font-medium text-[hsl(0,0%,30%)] flex items-center">
                  {invoiceData.totalCESS.toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between pt-2">
                <input
                  type="text"
                  name="totalTag"
                  value={invoiceData.totalTag}
                  className="w-[40%] rounded-lg border border-white hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-1 text-[hsl(0,0%,50%)] font-medium"
                  onChange={handleChange}
                />

                <div className="text-[hsl(0,0%,30%)] flex items-center">
                  <div className="md:block hidden">
                    {!currencyOpen ? (
                      <input
                        type="text"
                        name="clientState"
                        className=" rounded-lg border border-white hover:border hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,50%)] text-right"
                        placeholder="INR"
                        value={
                          currencyVal.split(" ")[
                            currencyVal.split(" ").length - 1
                          ]
                        }
                        onFocus={() => setCurrencyOpen(true)}
                        readOnly
                      />
                    ) : (
                      <select
                        name="clientState"
                        value={currencyVal}
                        onChange={handleCurrencyChange}
                        onBlur={() => setCurrencyOpen(false)}
                        className="w-full rounded-lg border border-white hover:border hover:border-purple-300 focus:border-purple-300 outline-none py-1  text-[hsl(0,0%,50%)]"
                      >
                        {currencies.map((currency, index) => (
                          <option
                            key={index}
                            value={`${currency.code} - ${currency.name} (${currency.symbol})`}
                          >
                            {`${currency.code} - ${currency.name} (${currency.symbol})`}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <span className="font-medium mr-0">
                    {invoiceData.grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
