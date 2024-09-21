import React from "react";
import { X } from "lucide-react"; // Using Lucide for a cross icon

export default function TableItem({ invoiceData, setInvoiceData }) {
  const { itemList } = invoiceData;

  // Handle input change to update item fields in itemList
  const handleChange = (index, field, value) => {
    const updatedItemList = [...itemList];
    updatedItemList[index][field] = value;
    setInvoiceData((prevData) => ({
      ...prevData,
      itemList: updatedItemList,
    }));
  };

  // Handle item deletion
  const handleDeleteItem = (index) => {
    const updatedItemList = itemList.filter((_, i) => i !== index); // Remove item by index
    setInvoiceData((prevData) => ({
      ...prevData,
      itemList: updatedItemList,
    }));
  };

  const numberTest = /^[0-9]*\.?[0-9]*$/;

  // Calculate percentage-based values
  const calculateAmount = (value, percentage) => {
    return ((parseFloat(value) || 0) * (parseFloat(percentage) || 0)) / 100;
  };

  return (
    <tbody>
      {itemList.map((item, index) => {
        const igstAmount = calculateAmount(item.value*item.quantity, item.igst);
        const cessAmount = calculateAmount(item.value*item.quantity, item.cess);
        const totalValue = parseFloat(item.value) * parseFloat(item.quantity);
        return (
          <tr key={index} className="group relative"> {/* Group for hover effect */}
            <td className="px-4 py-2 max-sm:px-0">
              <textarea
                className="w-full rounded-lg border border-white hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,40%)]"
                value={item.itemName}
                placeholder="Enter item name/description"
                onChange={(e) => handleChange(index, "itemName", e.target.value)}
              />
              <input
                type="text"
                placeholder="HSN/SAC"
                className="w-full rounded-lg border border-white hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,50%)]"
                value={item.hsn}
                onChange={(e) => handleChange(index, "hsn", e.target.value)}
              />
            </td>
            <td className="px-4 py-2 max-sm:px-0">
              <input
                type="number"
                value={item.quantity}
                className="w-full rounded-lg border border-white hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,50%)]"
                onChange={(e) => {numberTest.test(e.target.value) && handleChange(index, "quantity", e.target.value)}}
                
              />
            </td>
            <td className="px-4 py-2 max-sm:px-0">
              <input
                type="text"
                value={item.value}
                className="w-full rounded-lg border border-white hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,50%)]"
                onChange={(e) => handleChange(index, "value", e.target.value)}
              />
            </td>
            <td className="max-sm:hidden px-4 py-2">
              <input
                type="number"
                value={item.igst}
                className="w-full rounded-lg border border-white hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,50%)] text-center"
                onChange={(e) => {numberTest.test(e.target.value) && handleChange(index, "igst", e.target.value)}}
              />
              <div className="text-xs text-gray-500 text-center">
                {igstAmount.toFixed(2)}
              </div>
            </td>

            <td className="max-sm:hidden px-4 py-2">
              <input
                type="number"
                value={item.cess}
                className="w-full rounded-lg border border-white hover:border-purple-300 focus:border-purple-300 outline-none py-1 px-2 text-[hsl(0,0%,50%)] text-center"
                onChange={(e) => {numberTest.test(e.target.value) && handleChange(index, "cess", e.target.value)}}
              />
              <div className="text-xs text-gray-500 text-center">
                {cessAmount.toFixed(2)}
              </div>
            </td>
            
            <td className="px-7 py-2 text-right max-sm:pl-0">
              {item.quantity ? (totalValue + igstAmount + cessAmount).toFixed(2):'0.00'}
            </td>

            {/* Delete Button */}
            <td className="absolute top-1/2 right-[-10px] transform -translate-y-1/2 pr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[999]">
              <button onClick={() => handleDeleteItem(index)} className="mr-2 border-2 border-red-600 rounded-full text-red-500 hover:text-red-700 ">
                <X className="w-4 h-4"/>
              </button>
            </td>
          </tr>
        );
      })}
    </tbody>
  );
}
