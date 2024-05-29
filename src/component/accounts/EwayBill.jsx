import React, { useEffect, useState } from "react";
import "../../Styles.css";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { errorCodes } from "./ErrorCodes";
import { IoMdCloseCircleOutline } from "react-icons/io";

import {
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
} from "@material-ui/core";
import axios from "axios";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(1),
  },
}));

const EwayBill = ({ state, setOpenError, setErrorMsg }) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const [totalVal, setTotalVal] = useState(0);
  const [cgstVal, setCgstVal] = useState(0);
  const [sgstVal, setSgstVal] = useState(0);
  const [igstVal, setIgstVal] = useState(0);
  const [totalInvVal, setTotalInvVal] = useState(0);
  const [cesval, setCesVal] = useState(0);
  const [nonAdvolval, setNonAdvolVal] = useState(0);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const navigation = useNavigate();

  const [formData, setFormData] = useState({
    supplyType: "",
    subSupplyType: "",
    subSupplyDesc: "",
    docType: "",
    docNo: "",
    docDate: "",
    fromGstin: "",
    fromTrdName: "",
    fromAddr1: "",
    fromAddr2: "",
    fromPlace: "",
    fromPincode: 0,
    actFromStateCode: 0,
    fromStateCode: 0,
    toGstin: "",
    toTrdName: "",
    toAddr1: "",
    toAddr2: "",
    toPlace: "",
    toPincode: 0,
    actToStateCode: 0,
    toStateCode: 0,
    transactionType: "",
    otherValue: 0,
    totalValue: 0,
    cgstValue: 0,
    sgstValue: 0,
    igstValue: 0,
    cessValue: 0,
    cessNonAdvolValue: 0,
    totInvValue: 0,
    transporterId: "",
    transporterName: "",
    transDocNo: "",
    transMode: "",
    transDistance: "",
    transDocDate: "",
    vehicleNo: "",
    vehicleType: "",
    itemList: [
      {
        productName: "",
        productDesc: "",
        hsnCode: 0,
        quantity: 0,
        qtyUnit: "",
        cgstRate: 0,
        sgstRate: 0,
        igstRate: 0,
        cessRate: 0,
        cessNonadvol: 0,
        taxableAmount: 0,
      },
    ],
  });

  const [documentDate, setDocumentDate] = useState("");
  const [transDocDate, setTransDocDate] = useState(null);

  const handleDocInput = (e) => {
    if (e.target.name === "docDate") {
      const parsedDate = new Date(e.target.value);
      setDocumentDate(e.target.value);
      const day = parsedDate.getDate().toString().padStart(2, "0");
      const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
      const year = parsedDate.getFullYear();

      const formattedDate = `${day}/${month}/${year}`;
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: formattedDate,
      }));
    } else if (e.target.name === "transDocDate") {
      const parsedDate = new Date(e.target.value);
      setTransDocDate(e.target.value);
      const day = parsedDate.getDate().toString().padStart(2, "0");
      const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
      const year = parsedDate.getFullYear();

      const formattedDate = `${day}/${month}/${year}`;
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: formattedDate,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const [item, setItem] = useState([]);
  const [ID, setID] = useState("");

  const handleItemChange = (e, id) => {
    const updateData = item.map((elem) => {
      return elem.id === id
        ? {
            ...elem,
            [e.target.name]: e.target.value,
            ["TotItemVal"]: elem.UnitPrice,
          }
        : elem;
    });
    setItem(updateData);
  };

  useEffect(() => {
    const calcTotalVal = item.reduce((total, elem) => {
      return total + parseFloat(elem.taxableAmount || 0);
    }, 0);
    const calcCgstVal = item.reduce((total, elem) => {
      return (
        total +
        parseFloat(elem.taxableAmount || 0) *
          (parseFloat(elem.cgstRate || 0) / 100)
      );
    }, 0);
    const calcSgstVal = item.reduce((total, elem) => {
      return (
        total +
        parseFloat(elem.taxableAmount || 0) *
          (parseFloat(elem.sgstRate || 0) / 100)
      );
    }, 0);
    const calcIgstVal = item.reduce((total, elem) => {
      return (
        total +
        parseFloat(elem.taxableAmount || 0) *
          (parseFloat(elem.igstRate || 0) / 100)
      );
    }, 0);

    const calcCesVal = item.reduce((total, elem) => {
      return (
        total +
        parseFloat(elem.taxableAmount || 0) *
          (parseFloat(elem.cessRate || 0) / 100)
      );
    }, 0);
    const calcNonAdvolVal = item.reduce((total, elem) => {
      return total + parseFloat(elem.cessNonadvol || 0);
    }, 0);

    setTotalVal(calcTotalVal.toFixed(2));
    if (movementType === "one") {
      setCgstVal(0);
      setSgstVal(0);
      setIgstVal(calcIgstVal.toFixed(2));
    } else {
      setCgstVal(calcCgstVal.toFixed(2));
      setSgstVal(calcSgstVal.toFixed(2));
      setIgstVal(0);
    }

    const total = (
      calcTotalVal +
      calcCgstVal +
      calcSgstVal +
      calcIgstVal +
      calcCesVal +
      calcNonAdvolVal
    ).toFixed(2);

    setTotalInvVal(total);
    setCesVal(calcCesVal.toFixed(2));
    setNonAdvolVal(calcNonAdvolVal.toFixed(2));
  });

  useEffect(() => {
    const data = item.map((elem) => {
      let price = parseFloat(elem.price) || 0;
      let qty = parseFloat(elem.quantity) || 0;
      let igst = parseFloat(elem.gstRate) || 0;
      let sgst = parseFloat(elem.gstRate) / 2 || 0;
      let cgst = parseFloat(elem.gstRate) / 2 || 0;
      let withoutGstAmt = price * qty;
      let calculatedAmount = elem.price * qty + igst;
      if (calculatedAmount !== elem.TotItemVal) {
        return {
          ...elem,
          taxableAmount: withoutGstAmt.toFixed(2),
          igstRate: movementType === "one" ? igst.toFixed(2) : 0,
          cgstRate: movementType === "one" ? 0 : cgst.toFixed(2),
          sgstRate: movementType === "one" ? 0 : sgst.toFixed(2),
        };
      }
      return elem;
    });
    if (JSON.stringify(data) !== JSON.stringify(item)) {
      setItem(data);
    }

    const modifiedItem = item.map((item) => {
      const { gstRate, price, TotItemVal, ...rest } = item;
      return rest;
    });

    setFormData({
      ...formData,
      itemList: modifiedItem,
    });
  }, [item]);

  console.log(formData);

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      totalValue: totalVal,
      cgstValue: cgstVal,
      sgstValue: sgstVal,
      igstValue: igstVal,
      cessValue: cesval,
      cessNonAdvolValue: nonAdvolval,
      totInvValue: totalInvVal,
    }));
  }, [totalVal, sgstVal, cgstVal, igstVal, cesval, nonAdvolval, totalInvVal]);

  const deleteRow = (id) => {
    const updatedData = item.filter((elem) => {
      return elem.id !== id;
    });
    setItem(updatedData);
  };

  const addItem = () => {
    const newItem = {
      id: new Date().getTime().toString(),
      productName: "",
      productDesc: "",
      hsnCode: 0,
      price: 0,
      quantity: 0,
      qtyUnit: "",
      gstRate: 0,
      cgstRate: 0,
      sgstRate: 0,
      igstRate: 0,
      cessRate: 0,
      cessNonadvol: 0,
      taxableAmount: 0,
    };
    setItem([...item, newItem]);
    setID(newItem.id);
  };

  const [movementType, setMovementType] = useState(null);

  function getSteps() {
    return [
      "Basic Details",
      "Seller Details",
      "Buyer Details",
      "Item Details",
      "Value Details",
      "Transporter Details",
    ];
  }

  function getStepContent(step) {
    switch (step) {
      case 0: // BasicDtls
        return (
          <>
            <div className="data-input-fields">
              <div className="mb-2 w-50">
                <label htmlFor="supplyType" className="form-label">
                  Code for Supply Type **
                </label>
                <select
                  className="form-select"
                  id="supplyType"
                  name="supplyType"
                  value={formData.supplyType}
                  onChange={(e) => handleDocInput(e)}
                >
                  <option value="">Select Supply Type</option>
                  <option value="I">Inward</option>
                  <option value="O">Outward</option>
                </select>
              </div>

              <div className="mb-2 w-50">
                <label htmlFor="subSupplyType" className="form-label">
                  Code for Sub Supply Type **
                </label>
                <select
                  className="form-select"
                  id="subSupplyType"
                  name="subSupplyType"
                  value={formData.subSupplyType}
                  onChange={(e) => handleDocInput(e)}
                >
                  <option value="">Select Sub Supply Type</option>
                  <option value="1">Supply</option>
                  <option value="2">Import</option>
                  <option value="3">Export</option>
                  <option value="4">Job Work</option>
                  <option value="5">For Own Use</option>
                  <option value="6">Job work Returns</option>
                  <option value="7">Sales Returns</option>
                  <option value="8">Others</option>
                  <option value="9">SKD/CKD/Lots</option>
                  <option value="10">Line Sales</option>
                  <option value="11">Recipient Not Known</option>
                  <option value="12">Exhibition or Fairs</option>
                </select>
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="subSupplyDesc" class="form-label">
                  Sub-Supply Description
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="subSupplyDesc"
                  name="subSupplyDesc"
                  value={formData.subSupplyDesc}
                  onChange={(e) => handleDocInput(e)}
                />
              </div>
              <div className="mb-2 w-50">
                <label htmlFor="docType" className="form-label">
                  Document Type Code **
                </label>
                <select
                  className="form-select"
                  id="docType"
                  name="docType"
                  value={formData.docType}
                  onChange={(e) => handleDocInput(e)}
                >
                  <option value="">Select Document Type</option>
                  <option value="INV">INV: Invoice</option>
                  <option value="CRN">CRN: Credit Note</option>
                  <option value="DBN">DBN: Debit Note</option>
                </select>
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="docNo" class="form-label">
                  Document Number **
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="docNo"
                  name="docNo"
                  value={formData.docNo}
                  onChange={(e) => handleDocInput(e)}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="docDate" class="form-label">
                  Document Date **
                </label>
                <input
                  type="date"
                  class="form-control"
                  id="docDate"
                  name="docDate"
                  value={documentDate}
                  onChange={(e) => handleDocInput(e)}
                />
              </div>
            </div>
          </>
        );

      case 1: // SellerDtls
        return (
          <>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="fromTrdName" class="form-label">
                  Supplier Trade Name **
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="fromTrdName"
                  name="fromTrdName"
                  value={formData.fromTrdName}
                  onChange={(e) => handleDocInput(e)}
                />
              </div>
              <div className="mb-2 w-50">
                <label htmlFor="fromGstin" className="form-label">
                  Supplier GSTIN **
                </label>
                <input
                  type="text"
                  className={`form-control`}
                  id="fromGstin"
                  name="fromGstin"
                  value={formData.fromGstin}
                  onChange={(e) => {
                    handleDocInput(e);
                  }}
                  maxLength={15}
                />
                {formData.fromGstin.length != "" &&
                  formData.fromGstin.length < 15 && (
                    <div style={{ color: "red" }}>
                      GSTIN should be 15 characters.
                    </div>
                  )}
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="fromAddr1" class="form-label">
                  Supplier Address 1 **
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="fromAddr1"
                  name="fromAddr1"
                  value={formData.fromAddr1}
                  onChange={(e) => handleDocInput(e)}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="fromAddr2" class="form-label">
                  Supplier Address 2
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="fromAddr2"
                  name="fromAddr2"
                  value={formData.fromAddr2}
                  onChange={(e) => handleDocInput(e)}
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="fromPlace" class="form-label">
                  Supplier Place **
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="fromPlace"
                  name="fromPlace"
                  value={formData.fromPlace}
                  onChange={(e) => handleDocInput(e)}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="fromPincode" class="form-label">
                  Supplier Pincode **
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="fromPincode"
                  name="fromPincode"
                  value={formData.fromPincode}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue.length <= 6) {
                      handleDocInput(e);
                    }
                  }}
                />
                {formData.fromPincode.length < 6 && (
                  <div style={{ color: "red" }}>
                    Pincode should be 6 digits.
                  </div>
                )}
              </div>
            </div>
            <div className="data-input-fields">
              <div className="mb-2 w-50">
                <label htmlFor="actFromStateCode" className="form-label">
                  Supplier State Code **
                </label>
                <select
                  className="form-select"
                  id="actFromStateCode"
                  name="actFromStateCode"
                  value={formData.actFromStateCode}
                  onChange={(e) => handleDocInput(e)}
                >
                  <option value="">Select State</option>
                  <option value="01">01 - Jammu & Kashmir</option>
                  <option value="02">02 - Himachal Pradesh</option>
                  <option value="03">03 - Punjab</option>
                  <option value="04">04 - Chandigarh</option>
                  <option value="05">05 - Uttarakhand</option>
                  <option value="06">06 - Haryana</option>
                  <option value="07">07 - Delhi</option>
                  <option value="08">08 - Rajasthan</option>
                  <option value="09">09 - Uttar Pradesh</option>
                  <option value="10">10 - Bihar</option>
                  <option value="11">11 - Sikkim</option>
                  <option value="12">12 - Arunachal Pradesh</option>
                  <option value="13">13 - Nagaland</option>
                  <option value="14">14 - Manipur</option>
                  <option value="15">15 - Mizoram</option>
                  <option value="16">16 - Tripura</option>
                  <option value="17">17 - Meghalaya</option>
                  <option value="18">18 - Assam</option>
                  <option value="19">19 - West Bengal</option>
                  <option value="20">20 - Jharkhand</option>
                  <option value="21">21 - Orissa</option>
                  <option value="22">22 - Chhattisgarh</option>
                  <option value="23">23 - Madhya Pradesh</option>
                  <option value="24">24 - Gujarat</option>
                  <option value="25">25 - Daman & Diu</option>
                  <option value="26">26 - Dadra & Nagar Haveli</option>
                  <option value="27">27 - Maharashtra</option>
                  <option value="28">28 - Andhra Pradesh (Old)</option>
                  <option value="29">29 - Karnataka</option>
                  <option value="30">30 - Goa</option>
                  <option value="31">31 - Lakshadweep</option>
                  <option value="32">32 - Kerala</option>
                  <option value="33">33 - Tamil Nadu</option>
                  <option value="34">34 - Puducherry</option>
                  <option value="35">35 - Andaman & Nicobar Islands</option>
                  <option value="36">36 - Telangana</option>
                  <option value="37">37 - Andhra Pradesh (New)</option>
                </select>
              </div>
              <div className="mb-2 w-50">
                <label htmlFor="fromStateCode" className="form-label">
                  Consignor State Code **
                </label>
                <select
                  className="form-select"
                  id="fromStateCode"
                  name="fromStateCode"
                  value={formData.fromStateCode}
                  onChange={(e) => handleDocInput(e)}
                >
                  <option value="">Select State</option>
                  <option value="01">01 - Jammu & Kashmir</option>
                  <option value="02">02 - Himachal Pradesh</option>
                  <option value="03">03 - Punjab</option>
                  <option value="04">04 - Chandigarh</option>
                  <option value="05">05 - Uttarakhand</option>
                  <option value="06">06 - Haryana</option>
                  <option value="07">07 - Delhi</option>
                  <option value="08">08 - Rajasthan</option>
                  <option value="09">09 - Uttar Pradesh</option>
                  <option value="10">10 - Bihar</option>
                  <option value="11">11 - Sikkim</option>
                  <option value="12">12 - Arunachal Pradesh</option>
                  <option value="13">13 - Nagaland</option>
                  <option value="14">14 - Manipur</option>
                  <option value="15">15 - Mizoram</option>
                  <option value="16">16 - Tripura</option>
                  <option value="17">17 - Meghalaya</option>
                  <option value="18">18 - Assam</option>
                  <option value="19">19 - West Bengal</option>
                  <option value="20">20 - Jharkhand</option>
                  <option value="21">21 - Orissa</option>
                  <option value="22">22 - Chhattisgarh</option>
                  <option value="23">23 - Madhya Pradesh</option>
                  <option value="24">24 - Gujarat</option>
                  <option value="25">25 - Daman & Diu</option>
                  <option value="26">26 - Dadra & Nagar Haveli</option>
                  <option value="27">27 - Maharashtra</option>
                  <option value="28">28 - Andhra Pradesh (Old)</option>
                  <option value="29">29 - Karnataka</option>
                  <option value="30">30 - Goa</option>
                  <option value="31">31 - Lakshadweep</option>
                  <option value="32">32 - Kerala</option>
                  <option value="33">33 - Tamil Nadu</option>
                  <option value="34">34 - Puducherry</option>
                  <option value="35">35 - Andaman & Nicobar Islands</option>
                  <option value="36">36 - Telangana</option>
                  <option value="37">37 - Andhra Pradesh (New)</option>
                </select>
              </div>
            </div>
          </>
        );
      case 2: // BuyerDtls
        return (
          <>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="toTrdName" class="form-label">
                  Buyer Trade Name **
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="toTrdName"
                  name="toTrdName"
                  value={formData.toTrdName}
                  onChange={(e) => handleDocInput(e)}
                />
              </div>
              <div className="mb-2 w-50">
                <label htmlFor="toGstin" className="form-label">
                  Buyer GSTIN **
                </label>
                <input
                  type="text"
                  className={`form-control`}
                  id="toGstin"
                  name="toGstin"
                  value={formData.toGstin}
                  onChange={(e) => {
                    handleDocInput(e);
                  }}
                  maxLength={15}
                />
                {formData.toGstin.length != "" &&
                  formData.toGstin.length < 15 && (
                    <div style={{ color: "red" }}>
                      GSTIN should be 15 characters.
                    </div>
                  )}
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="toAddr1" class="form-label">
                  Buyer Address 1 **
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="toAddr1"
                  name="toAddr1"
                  value={formData.toAddr1}
                  onChange={(e) => handleDocInput(e)}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="toAddr2" class="form-label">
                  Buyer Address 2
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="toAddr2"
                  name="toAddr2"
                  value={formData.toAddr2}
                  onChange={(e) => handleDocInput(e)}
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="toPlace" class="form-label">
                  Buyer Place **
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="toPlace"
                  name="toPlace"
                  value={formData.toPlace}
                  onChange={(e) => handleDocInput(e)}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="toPincode" class="form-label">
                  Buyer Pincode **
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="toPincode"
                  name="toPincode"
                  value={formData.toPincode}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue.length <= 6) {
                      handleDocInput(e);
                    }
                  }}
                />
                {formData.toPincode.length < 6 && (
                  <div style={{ color: "red" }}>
                    Pincode should be 6 digits.
                  </div>
                )}
              </div>
            </div>
            <div className="data-input-fields">
              <div className="mb-2 w-50">
                <label htmlFor="actToStateCode" className="form-label">
                  Buyer State Code **
                </label>
                <select
                  className="form-select"
                  id="actToStateCode"
                  name="actToStateCode"
                  value={formData.actToStateCode}
                  onChange={(e) => handleDocInput(e)}
                >
                  <option value="">Select State</option>
                  <option value="01">01 - Jammu & Kashmir</option>
                  <option value="02">02 - Himachal Pradesh</option>
                  <option value="03">03 - Punjab</option>
                  <option value="04">04 - Chandigarh</option>
                  <option value="05">05 - Uttarakhand</option>
                  <option value="06">06 - Haryana</option>
                  <option value="07">07 - Delhi</option>
                  <option value="08">08 - Rajasthan</option>
                  <option value="09">09 - Uttar Pradesh</option>
                  <option value="10">10 - Bihar</option>
                  <option value="11">11 - Sikkim</option>
                  <option value="12">12 - Arunachal Pradesh</option>
                  <option value="13">13 - Nagaland</option>
                  <option value="14">14 - Manipur</option>
                  <option value="15">15 - Mizoram</option>
                  <option value="16">16 - Tripura</option>
                  <option value="17">17 - Meghalaya</option>
                  <option value="18">18 - Assam</option>
                  <option value="19">19 - West Bengal</option>
                  <option value="20">20 - Jharkhand</option>
                  <option value="21">21 - Orissa</option>
                  <option value="22">22 - Chhattisgarh</option>
                  <option value="23">23 - Madhya Pradesh</option>
                  <option value="24">24 - Gujarat</option>
                  <option value="25">25 - Daman & Diu</option>
                  <option value="26">26 - Dadra & Nagar Haveli</option>
                  <option value="27">27 - Maharashtra</option>
                  <option value="28">28 - Andhra Pradesh (Old)</option>
                  <option value="29">29 - Karnataka</option>
                  <option value="30">30 - Goa</option>
                  <option value="31">31 - Lakshadweep</option>
                  <option value="32">32 - Kerala</option>
                  <option value="33">33 - Tamil Nadu</option>
                  <option value="34">34 - Puducherry</option>
                  <option value="35">35 - Andaman & Nicobar Islands</option>
                  <option value="36">36 - Telangana</option>
                  <option value="37">37 - Andhra Pradesh (New)</option>
                </select>
              </div>
              <div className="mb-2 w-50">
                <label htmlFor="toStateCode" className="form-label">
                  Consignee State Code **
                </label>
                <select
                  className="form-select"
                  id="toStateCode"
                  name="toStateCode"
                  value={formData.toStateCode}
                  onChange={(e) => handleDocInput(e)}
                >
                  <option value="">Select State</option>
                  <option value="01">01 - Jammu & Kashmir</option>
                  <option value="02">02 - Himachal Pradesh</option>
                  <option value="03">03 - Punjab</option>
                  <option value="04">04 - Chandigarh</option>
                  <option value="05">05 - Uttarakhand</option>
                  <option value="06">06 - Haryana</option>
                  <option value="07">07 - Delhi</option>
                  <option value="08">08 - Rajasthan</option>
                  <option value="09">09 - Uttar Pradesh</option>
                  <option value="10">10 - Bihar</option>
                  <option value="11">11 - Sikkim</option>
                  <option value="12">12 - Arunachal Pradesh</option>
                  <option value="13">13 - Nagaland</option>
                  <option value="14">14 - Manipur</option>
                  <option value="15">15 - Mizoram</option>
                  <option value="16">16 - Tripura</option>
                  <option value="17">17 - Meghalaya</option>
                  <option value="18">18 - Assam</option>
                  <option value="19">19 - West Bengal</option>
                  <option value="20">20 - Jharkhand</option>
                  <option value="21">21 - Orissa</option>
                  <option value="22">22 - Chhattisgarh</option>
                  <option value="23">23 - Madhya Pradesh</option>
                  <option value="24">24 - Gujarat</option>
                  <option value="25">25 - Daman & Diu</option>
                  <option value="26">26 - Dadra & Nagar Haveli</option>
                  <option value="27">27 - Maharashtra</option>
                  <option value="28">28 - Andhra Pradesh (Old)</option>
                  <option value="29">29 - Karnataka</option>
                  <option value="30">30 - Goa</option>
                  <option value="31">31 - Lakshadweep</option>
                  <option value="32">32 - Kerala</option>
                  <option value="33">33 - Tamil Nadu</option>
                  <option value="34">34 - Puducherry</option>
                  <option value="35">35 - Andaman & Nicobar Islands</option>
                  <option value="36">36 - Telangana</option>
                  <option value="37">37 - Andhra Pradesh (New)</option>
                </select>
              </div>
              <div className="mb-2 w-50">
                <label htmlFor="transactionType" className="form-label">
                  Transaction Type **
                </label>
                <select
                  className="form-select"
                  id="transactionType"
                  name="transactionType"
                  value={formData.transactionType}
                  onChange={(e) => handleDocInput(e)}
                >
                  <option value="">Select Transaction Type</option>
                  <option value="01">Regular</option>
                  <option value="02">Bill To - Ship To</option>
                  <option value="03">Bill From - Dispatch From</option>
                  <option value="04">Combination of 2 and 3</option>
                </select>
              </div>
            </div>
          </>
        );

      case 3: // ItemDtls
        return (
          <>
            <div
              className="salesviewtable"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <div className="mb-2 w-50">
                <label htmlFor="MovTyp" className="form-label">
                  Movement Type
                </label>
                <select
                  style={{ width: "50%" }}
                  className="form-select"
                  id="MovTyp"
                  value={movementType}
                  onChange={(e) => setMovementType(e.target.value)}
                >
                  <option value="">Select Movement Type</option>
                  <option value="one">Inter State</option>
                  <option value="two">Intra State</option>
                </select>
              </div>
              <div className="table-wrapper">
                {" "}
                <table className="table">
                  <thead>
                    <tr>
                      <th>NO</th>
                      <th>Product Name</th>
                      <th>Product Desc</th>
                      <th>HSN Code</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Unit</th>
                      <th>GST Rate</th>
                      <th>Cess Rate (%)</th>
                      <th>Cess Non-Advolerum</th>
                      <th>taxable Amount</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.map((row, index) => (
                      <tr key={row.id}>
                        <td>{index + 1}</td>
                        <td>
                          <TextField
                            type="text"
                            value={row.productName}
                            name="productName"
                            onChange={(e) => handleItemChange(e, row.id)}
                          />
                        </td>
                        <td>
                          <TextField
                            type="text"
                            value={row.productDesc}
                            name="productDesc"
                            onChange={(e) => handleItemChange(e, row.id)}
                          />
                        </td>

                        <td>
                          <TextField
                            type="text"
                            name="hsnCode"
                            value={row.hsnCode}
                            onChange={(e) => handleItemChange(e, row.id)}
                          />
                        </td>
                        <td>
                          <TextField
                            type="text"
                            name="price"
                            value={row.price}
                            onChange={(e) => handleItemChange(e, row.id)}
                          />
                        </td>

                        <td>
                          <TextField
                            type="number"
                            name="quantity"
                            value={row.quantity}
                            onChange={(e) => handleItemChange(e, row.id)}
                          />
                        </td>
                        <td>
                          <TextField
                            type="text"
                            name="qtyUnit"
                            value={row.qtyUnit}
                            onChange={(e) => handleItemChange(e, row.id)}
                          />
                        </td>

                        <td>
                          <select
                            className="form-select"
                            id="gstRate"
                            name="gstRate"
                            value={row.gstRate}
                            onChange={(e) => handleItemChange(e, row.id)}
                          >
                            <option value="0">0</option>
                            <option value="0.1">0.1</option>
                            <option value="0.5">0.25</option>
                            <option value="3">3</option>
                            <option value="5">5</option>
                            <option value="12">12</option>
                            <option value="18">18</option>
                            <option value="24">24</option>
                          </select>
                        </td>

                        <td>
                          <select
                            className="form-select"
                            id="cessRate"
                            name="cessRate"
                            value={row.cessRate}
                            onChange={(e) => handleItemChange(e, row.id)}
                          >
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="3">3</option>
                            <option value="5">5</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="12.5">12.5</option>
                            <option value="15">15</option>
                            <option value="17">17</option>
                            <option value="21">21</option>
                            <option value="22">22</option>
                            <option value="36">36</option>
                            <option value="49">49</option>
                            <option value="60">60</option>
                            <option value="61">61</option>
                            <option value="65">65</option>
                            <option value="71">71</option>
                            <option value="72">72</option>
                            <option value="89">89</option>
                            <option value="96">96</option>
                            <option value="142">142</option>
                            <option value="160">160</option>
                            <option value="204">204</option>
                          </select>
                        </td>
                        <td>
                          <select
                            className="form-select"
                            id="cessNonadvol"
                            name="cessNonadvol"
                            value={row.cessNonadvol}
                            onChange={(e) => handleItemChange(e, row.id)}
                          >
                            <option value="0">0</option>
                            <option value="400">400</option>
                            <option value="2076">2076</option>
                            <option value="2747">2747</option>
                            <option value="3668">3668</option>
                            <option value="4006">4006</option>
                            <option value="4170">4170</option>
                          </select>
                        </td>

                        <td>
                          <TextField
                            type="number"
                            value={row.taxableAmount}
                            onChange={(e) => handleItemChange(e, row.id)}
                            name="taxableAmount"
                          />
                        </td>
                        <td>
                          <IconButton onClick={() => deleteRow(row.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>{" "}
              </div>
              <Button
                style={{
                  height: "40px",
                  display: "flex",
                  left: "10rem",
                  width: "150px",
                  alignItems: "right",
                  justifyContent: "center",
                  border: "2px solid #565A5C",
                  fontSize: "15px",
                  color: " #565A5C",
                }}
                variant="outlined"
                startIcon={<AddCircleOutlineOutlinedIcon />}
                onClick={addItem}
                disabled={movementType ? false : true}
              >
                Add
              </Button>
            </div>
          </>
        );

      case 4: // ValDtls
        return (
          <>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="totalValue" class="form-label">
                  Total Value
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="totalValue"
                  name="totalValue"
                  value={formData.totalValue}
                  disabled
                />
              </div>
              <div class="mb-2 w-50">
                <label for="cgstValue" class="form-label">
                  Cgst Value
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="cgstValue"
                  name="cgstValue"
                  value={formData.cgstValue}
                  disabled
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="sgstValue" class="form-label">
                  Sgst Value
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="sgstValue"
                  name="sgstValue"
                  value={formData.sgstValue}
                  disabled
                />
              </div>
              <div class="mb-2 w-50">
                <label for="igstValue" class="form-label">
                  Igst Value
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="igstValue"
                  name="igstValue"
                  value={formData.igstValue}
                  disabled
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="cessValue" class="form-label">
                  Cess Value
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="cessValue"
                  name="cessValue"
                  value={formData.cessValue}
                  disabled
                />
              </div>
              <div class="mb-2 w-50">
                <label for="StCesVal" class="form-label">
                  Cess Non-Advolerum Value
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="cessNonAdvolValue"
                  name="cessNonAdvolValue"
                  value={formData.cessNonAdvolValue}
                  disabled
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="totInvValue" class="form-label">
                  Total Invoice Value
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="totInvValue"
                  name="totInvValue"
                  value={formData.totInvValue}
                  disabled
                />
              </div>
            </div>
          </>
        );

      case 5: // TransDtls
        return (
          <>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="transporterId" class="form-label">
                  Transporter Id
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="transporterId"
                  name="transporterId"
                  value={formData.transporterId}
                  onChange={(e) => handleDocInput(e)}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="transporterName" class="form-label">
                  Transporter Name
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="transporterName"
                  name="transporterName"
                  value={formData.transporterName}
                  onChange={(e) => handleDocInput(e)}
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="transDistance" class="form-label">
                  Distance of Transportation **
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="transDistance"
                  name="transDistance"
                  value={formData.transDistance}
                  onChange={(e) => handleDocInput(e)}
                />
              </div>
              <div className="mb-2 w-50">
                <label htmlFor="transMode" className="form-label">
                  Mode of Transportation **
                </label>
                <select
                  className="form-select"
                  id="transMode"
                  name="transMode"
                  value={formData.transMode}
                  onChange={(e) => handleDocInput(e)}
                >
                  <option value="">Select Transportation Mode</option>
                  <option value="1">Road</option>
                  <option value="2">Rail</option>
                  <option value="3">Air</option>
                  <option value="4">Ship</option>
                  <option value="5">inTransit</option>
                </select>
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="transDocNo" class="form-label">
                  Transport Document Number
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="transDocNo"
                  name="transDocNo"
                  value={formData.transDocNo}
                  onChange={(e) => handleDocInput(e)}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="transDocDate" class="form-label">
                  Transport Document Date
                </label>
                <input
                  type="date"
                  class="form-control"
                  id="transDocDate"
                  name="transDocDate"
                  value={transDocDate}
                  onChange={(e) => handleDocInput(e)}
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="vehicleNo" class="form-label">
                  Vehicle Number **
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="vehicleNo"
                  name="vehicleNo"
                  value={formData.vehicleNo}
                  onChange={(e) => handleDocInput(e)}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="vehicleType" class="form-label">
                  Vehicle Type **
                </label>
                <select
                  type="text"
                  class="form-select"
                  id="vehicleType"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={(e) => handleDocInput(e)}
                >
                  <option value="">Select Transaction Type</option>
                  <option value="R">Regular</option>
                  <option value="O">Over Dimentional Cargo</option>
                </select>
              </div>
            </div>
          </>
        );

      default:
        return "unknown step";
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // const saveIrn = async (AckDt, AckNo, Irn, SignedInvoice, SignedQRCode) => {
  //   await axios.post("http://localhost:3500/save-irn", {
  //     AckDt,
  //     AckNo,
  //     Irn,
  //     SignedInvoice,
  //     SignedQRCode,
  //   });
  // };

  const handleSave = async () => {
    await axios
      .post("http://localhost:3500/generate-eway-bill", {
        formData: formData,
        auth: state,
      })
      .then((res) => {
        if (res.data.ErrorDetails) {
          if (res.data.ErrorDetails[0]?.ErrorMessage === "Invalid Token") {
            navigation("/gst/e-invoice-auth");
          } else {
            alert(res.data.ErrorDetails[0]?.ErrorMessage);
          }
        } else {
          if (res.data.AckDt) {
            console.log(res.data);
          } else {
            if (res.data.error.errorCodes) {
              const output = res.data.error.errorCodes;

              const outputArray = output
                .split(",")
                .map((item) => parseInt(item.trim()));

              const errorMessages = [];
              outputArray.forEach((code) => {
                const error = errorCodes.find(
                  (entry) => Object.keys(entry)[0] === code.toString()
                );
                if (error) {
                  errorMessages.push(Object.values(error)[0]);
                } else {
                  errorMessages.push(
                    `Error message for code ${code} not found`
                  );
                }
              });
              setOpenError(true);
              setErrorMsg(errorMessages);
            }
          }
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div style={{ background: "#F8F6F2", padding: "0" }}>
      <Stepper alternativeLabel activeStep={activeStep}>
        {steps.map((step, index) => {
          const labelProps = {};
          const stepProps = {};

          return (
            <Step {...stepProps} key={index}>
              <StepLabel {...labelProps}>{step}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {activeStep === steps.length ? (
        <Typography variant="h3" align="center">
          Thank You
        </Typography>
      ) : (
        <>
          {
            <form className="form-input-fields" onSubmit={handleSubmit}>
              {getStepContent(activeStep)}
            </form>
          }
          <Button
            style={{ marginBottom: "20px", marginLeft: "20px" }}
            className={classes.button}
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            back
          </Button>

          <Button
            style={{ marginBottom: "20px", marginLeft: "10px" }}
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={activeStep === steps.length - 1 ? handleSave : handleNext}
          >
            {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </>
      )}
    </div>
  );
};

export default EwayBill;
