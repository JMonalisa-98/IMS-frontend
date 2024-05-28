import React, { useEffect, useState } from "react";
import "../../Styles.css";
import { useLocation, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

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

const InvForm = ({ state }) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const [assval, setAssVal] = useState(0);
  const [cgstval, setCgstVal] = useState(0);
  const [sgstval, setSgstVal] = useState(0);
  const [igstval, setIgstVal] = useState(0);
  const [discountval, setDiscountVal] = useState(0);
  const [totalInvValFcval, setTotalInvValFcVal] = useState(0);
  const [cesval, setCesVal] = useState(0);
  const [stCesval, setStCesVal] = useState(0);
  const [rndOffAmt, setRndOffAmt] = useState(0);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const navigation = useNavigate();

  const [formData, setFormData] = useState({
    Version: "1.1",
    Irn: null,
    TranDtls: {
      TaxSch: "GST",
      SupTyp: "",
      RegRev: "Y",
      EcmGstin: null,
      IgstOnIntra: "N",
    },
    DocDtls: {
      Typ: "",
      No: "",
      Dt: "",
    },
    SellerDtls: {
      Gstin: "",
      LglNm: "",
      TrdNm: null,
      Addr1: "",
      Addr2: null,
      Loc: "",
      Pin: 0,
      Stcd: "",
      Ph: null,
      Em: null,
    },
    BuyerDtls: {
      Gstin: "",
      LglNm: "",
      TrdNm: null,
      Pos: "",
      Addr1: "",
      Addr2: null,
      Loc: "",
      Pin: 0,
      Stcd: "",
      Ph: null,
      Em: null,
    },
    DispDtls: {
      Nm: "",
      Addr1: "",
      Addr2: null,
      Loc: "",
      Pin: 0,
      Stcd: "",
    },
    ShipDtls: {
      Gstin: "",
      LglNm: "",
      TrdNm: null,
      Addr1: "",
      Addr2: null,
      Loc: "",
      Pin: 0,
      Stcd: "",
    },
    ItemList: [
      {
        SlNo: "",
        PrdDesc: "",
        IsServc: "N",
        HsnCd: "",
        Barcde: null,
        Qty: 0,
        FreeQty: 0,
        Unit: "",
        UnitPrice: 0,
        TotAmt: 0,
        Discount: 0,
        PreTaxVal: 0,
        AssAmt: 0,
        GstRt: 0,
        IgstAmt: 0,
        CgstAmt: 0,
        SgstAmt: 0,
        CesRt: 0,
        CesAmt: 0,
        CesNonAdvlAmt: 0,
        StateCesRt: 0,
        StateCesAmt: 0,
        StateCesNonAdvlAmt: 0,
        OthChrg: 0,
        TotItemVal: 0,
        OrdLineRef: null,
        OrgCntry: null,
        PrdSlNo: null,
        BchDtls: null,
        AttribDtls: null,
      },
    ],
    ValDtls: {
      AssVal: 0,
      CgstVal: 0,
      SgstVal: 0,
      IgstVal: 0,
      CesVal: 0,
      StCesVal: 0,
      Discount: 0,
      OthChrg: 0,
      RndOffAmt: 0,
      TotInvVal: 0,
      TotInvValFc: 0,
    },
    PayDtls: {
      Nm: null,
      AccDet: null,
      Mode: null,
      FinInsBr: null,
      PayTerm: null,
      PayInstr: null,
      CrTrn: null,
      DirDr: null,
      CrDay: null,
      PaidAmt: null,
      PaymtDue: null,
    },
    RefDtls: null,
    PrecDocDtls: null,
    ContrDtls: null,
    AddlDocDtls: null,
    EwbDtls: {
      TransId: null,
      TransName: null,
      TransMode: null,
      Distance: "",
      TransDocNo: null,
      TransDocDt: null,
      VehNo: null,
      VehType: null,
    },
  });

  const handleTranInput = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      TranDtls: {
        ...prevState.TranDtls,
        [e.target.name]: e.target.value,
      },
    }));
  };

  const [documentDate, setDocumentDate] = useState("");
  const handleDocInput = (e) => {
    if (e.target.name === "Dt") {
      const parsedDate = new Date(e.target.value);
      setDocumentDate(e.target.value);
      const day = parsedDate.getDate().toString().padStart(2, "0"); // Add leading zero if needed
      const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
      const year = parsedDate.getFullYear();

      const formattedDate = `${day}/${month}/${year}`;
      setFormData((prevState) => ({
        ...prevState,
        DocDtls: {
          ...prevState.DocDtls,
          [e.target.name]: formattedDate,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        DocDtls: {
          ...prevState.DocDtls,
          [e.target.name]: e.target.value,
        },
      }));
    }
  };
  const handleSellerInput = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      SellerDtls: {
        ...prevState.SellerDtls,
        [name]: value,
      },
    }));
  };

  const handleBuyerInput = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      BuyerDtls: {
        ...prevState.BuyerDtls,
        [name]: value,
      },
    }));
  };
  const handleDispInput = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      DispDtls: {
        ...prevState.DispDtls,
        [e.target.name]: e.target.value,
      },
    }));
  };
  const handleShipInput = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      ShipDtls: {
        ...prevState.ShipDtls,
        [e.target.name]: e.target.value,
      },
    }));
  };
  const handlePayInput = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      PayDtls: {
        ...prevState.PayDtls,
        [e.target.name]: e.target.value,
      },
    }));
  };

  const [transDocDate, setTransDocDate] = useState(null);
  const handleEwabInput = (e) => {
    if (e.target.name === "TransDocDt") {
      const parsedDate = new Date(e.target.value);
      setTransDocDate(e.target.value);
      const day = parsedDate.getDate().toString().padStart(2, "0"); // Add leading zero if needed
      const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
      const year = parsedDate.getFullYear();

      const formattedDate = `${day}/${month}/${year}`;
      setFormData((prevState) => ({
        ...prevState,
        EwbDtls: {
          ...prevState.EwbDtls,
          [e.target.name]: formattedDate,
        },
      }));
    } else if (e.target.name === "VehType" && e.target.value === "") {
      setFormData((prevState) => ({
        ...prevState,
        EwbDtls: {
          ...prevState.EwbDtls,
          [e.target.name]: null,
        },
      }));
    } else if (e.target.name === "TransMode" && e.target.value === "") {
      setFormData((prevState) => ({
        ...prevState,
        EwbDtls: {
          ...prevState.EwbDtls,
          [e.target.name]: null,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        EwbDtls: {
          ...prevState.EwbDtls,
          [e.target.name]: e.target.value,
        },
      }));
    }
  };
  const handleValInput = (e) => {
    setRndOffAmt(e.target.value);
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
            ["SlNo"]: `${item.length}`,
          }
        : elem;
    });
    setItem(updateData);
  };

  useEffect(() => {
    const calcAssVal = item.reduce((total, elem) => {
      return total + parseFloat(elem.AssAmt || 0);
    }, 0);
    const calcCgstVal = item.reduce((total, elem) => {
      return total + parseFloat(elem.CgstAmt || 0);
    }, 0);
    const calcSgstVal = item.reduce((total, elem) => {
      return total + parseFloat(elem.SgstAmt || 0);
    }, 0);
    const calcIgstVal = item.reduce((total, elem) => {
      return total + parseFloat(elem.IgstAmt || 0);
    }, 0);
    const calcDiscount = item.reduce((total, elem) => {
      return total + parseFloat(elem.Discount || 0);
    }, 0);
    const calcTotInvValFc = item.reduce((total, elem) => {
      return total + parseFloat(elem.TotItemVal || 0);
    }, 0);
    const calcCesVal = item.reduce((total, elem) => {
      return (
        total +
        parseFloat(elem.CesAmt || 0) +
        parseFloat(elem.CesNonAdvlAmt || 0)
      );
    }, 0);
    const calcStCesVal = item.reduce((total, elem) => {
      return (
        total +
        parseFloat(elem.StateCesAmt || 0) +
        parseFloat(elem.StateCesNonAdvlAmt || 0)
      );
    }, 0);
    setAssVal(calcAssVal.toFixed(2));
    if (movementType === "one") {
      setCgstVal(0);
      setSgstVal(0);
      setIgstVal(calcIgstVal.toFixed(2));
    } else {
      setCgstVal(calcCgstVal.toFixed(2));
      setSgstVal(calcSgstVal.toFixed(2));
      setIgstVal(0);
    }

    setDiscountVal(calcDiscount.toFixed(2));
    setTotalInvValFcVal(calcTotInvValFc.toFixed(2));
    setCesVal(calcCesVal.toFixed(2));
    setStCesVal(calcStCesVal.toFixed(2));
  });

  useEffect(() => {
    const data = item.map((elem) => {
      let price = parseFloat(elem.UnitPrice) || 0;
      let qty = parseFloat(elem.Qty) || 0;
      let discount = parseFloat(elem.Discount) || 0;
      let igst = (price * qty - discount) * (parseFloat(elem.GstRt) / 100) || 0;
      let sgst =
        (price * qty - discount) * (parseFloat(elem.GstRt) / 2 / 100) || 0;
      let cgst =
        (price * qty - discount) * (parseFloat(elem.GstRt) / 2 / 100) || 0;
      let withoutGstAmt = price * qty;
      let calculatedAmount = elem.UnitPrice * qty + igst;
      let cessAmt =
        (price * qty - discount) * (parseFloat(elem.CesRt) / 100) || 0;
      let stateCesAmt =
        (price * qty - discount) * (parseFloat(elem.StateCesRt) / 100) || 0;
      if (calculatedAmount !== elem.TotItemVal) {
        return {
          ...elem,
          TotItemVal: (
            calculatedAmount -
            discount +
            cessAmt +
            stateCesAmt +
            parseFloat(elem.CesNonAdvlAmt) +
            parseFloat(elem.StateCesNonAdvlAmt)
          ).toFixed(2),
          TotAmt: withoutGstAmt.toFixed(2),
          IgstAmt: movementType === "one" ? igst.toFixed(2) : 0,
          CgstAmt: movementType === "one" ? 0 : cgst.toFixed(2),
          SgstAmt: movementType === "one" ? 0 : sgst.toFixed(2),
          PreTaxVal: withoutGstAmt - discount,
          AssAmt: withoutGstAmt - discount,
          StateCesAmt: stateCesAmt.toFixed(2),
          CesAmt: cessAmt.toFixed(2),
        };
      }
      return elem;
    });
    if (JSON.stringify(data) !== JSON.stringify(item)) {
      setItem(data);
    }

    setFormData({
      ...formData,
      ItemList: item,
    });
  }, [item]);

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      ValDtls: {
        ...prevState.ValDtls,
        AssVal: assval,
        CgstVal: cgstval,
        SgstVal: sgstval,
        IgstVal: igstval,
        CesVal: cesval,
        StCesVal: stCesval,
        Discount: discountval,
        RndOffAmt: rndOffAmt ? parseFloat(rndOffAmt) : 0,
        TotInvVal:
          totalInvValFcval -
          discountval +
          parseFloat(rndOffAmt ? rndOffAmt : 0),
        TotInvValFc: totalInvValFcval,
      },
    }));
  }, [
    assval,
    cgstval,
    igstval,
    cesval,
    stCesval,
    discountval,
    totalInvValFcval,
    rndOffAmt,
  ]);

  const deleteRow = (id) => {
    const updatedData = item.filter((elem) => {
      return elem.id !== id;
    });
    setItem(updatedData);
  };

  const addItem = () => {
    const newItem = {
      id: new Date().getTime().toString(),
      SlNo: "",
      PrdDesc: "",
      IsServc: "N",
      HsnCd: "",
      Barcde: null,
      Qty: 0,
      FreeQty: 0,
      Unit: "",
      UnitPrice: 0,
      TotAmt: 0,
      Discount: 0,
      PreTaxVal: 0,
      AssAmt: 0,
      GstRt: 0,
      IgstAmt: 0,
      CgstAmt: 0,
      SgstAmt: 0,
      CesRt: 0,
      CesAmt: 0,
      CesNonAdvlAmt: 0,
      StateCesRt: 0,
      StateCesAmt: 0,
      StateCesNonAdvlAmt: 0,
      OthChrg: 0,
      TotItemVal: 0,
      OrdLineRef: null,
      OrgCntry: null,
      PrdSlNo: null,
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
      "Dispatch Details",
      "Shipping Details",
      "Item Details",
      "Value Details",
      "Payee Details",
      "E-Way Bill Details",
    ];
  }

  console.log(formData);

  function getStepContent(step) {
    switch (step) {
      case 0: // BasicDtls
        return (
          <>
            <div className="data-input-fields">
              <div className="mb-2 w-50">
                <label htmlFor="SupTyp" className="form-label">
                  Code for Supply Type **
                </label>
                <select
                  className="form-select"
                  id="SupTyp"
                  name="SupTyp"
                  value={formData.TranDtls.SupTyp}
                  onChange={(e) => handleTranInput(e)}
                >
                  <option value="">Select Transaction Type</option>
                  <option value="B2B">B2B: Business to Business</option>
                  <option value="B2C">B2C: Business to Consumer</option>
                  <option value="SEZWP">SEZWP: To SEZ with Payment</option>
                  <option value="SEZWOP">SEZWOP: To SEZ without Payment</option>
                  <option value="EXPWP">EXPWP: Export with Payment</option>
                  <option value="EXPWOP">EXPWOP: Export without Payment</option>
                  <option value="DEXP">DEXP: Deemed Export</option>
                </select>
              </div>

              <div className="mb-2 w-50">
                <label htmlFor="Typ" className="form-label">
                  Document Type Code **
                </label>
                <select
                  className="form-select"
                  id="Typ"
                  name="Typ"
                  value={formData.DocDtls.Typ}
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
                <label for="No" class="form-label">
                  Document Number **
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="exampleInputEmail1"
                  name="No"
                  value={formData.DocDtls.No}
                  onChange={(e) => handleDocInput(e)}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="Dt" class="form-label">
                  Document Date **
                </label>
                <input
                  type="date"
                  class="form-control"
                  id="Dt"
                  name="Dt"
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
                <label for="LglNm" class="form-label">
                  Supplier Legal Name **
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="LglNm"
                  name="LglNm"
                  value={formData.SellerDtls.LglNm}
                  onChange={(e) => handleSellerInput(e)}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="TrdNm" class="form-label">
                  Supplier Trade Name
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="TrdNm"
                  name="TrdNm"
                  value={
                    formData.SellerDtls.TrdNm ? formData.SellerDtls.TrdNm : ""
                  }
                  onChange={(e) => handleSellerInput(e)}
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div className="mb-2 w-50">
                <label htmlFor="Gstin" className="form-label">
                  Supplier GSTIN **
                </label>
                <input
                  type="text"
                  className={`form-control`}
                  id="Gstin"
                  name="Gstin"
                  value={formData.SellerDtls.Gstin}
                  onChange={(e) => {
                    handleSellerInput(e);
                  }}
                  maxLength={15}
                />
                {formData.SellerDtls.Gstin.length != "" &&
                  formData.SellerDtls.Gstin.length < 15 && (
                    <div style={{ color: "red" }}>
                      GSTIN should be 15 characters.
                    </div>
                  )}
              </div>

              <div class="mb-2 w-50">
                <label for="Addr1" class="form-label">
                  Supplier Address 1 **
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="Addr1"
                  name="Addr1"
                  value={formData.SellerDtls.Addr1}
                  onChange={(e) => handleSellerInput(e)}
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="Addr2" class="form-label">
                  Supplier Address 2
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="Addr2"
                  name="Addr2"
                  value={
                    formData.SellerDtls.Addr2 ? formData.SellerDtls.Addr2 : ""
                  }
                  onChange={(e) => handleSellerInput(e)}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="Loc" class="form-label">
                  Supplier Place **
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="Loc"
                  name="Loc"
                  value={formData.SellerDtls.Loc}
                  onChange={(e) => handleSellerInput(e)}
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div className="mb-2 w-50">
                <label htmlFor="Pos" className="form-label">
                  Supplier State Code **
                </label>
                <select
                  className="form-select"
                  id="Typ"
                  name="Stcd"
                  value={formData.SellerDtls.Stcd}
                  onChange={(e) => handleSellerInput(e)}
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
              <div class="mb-2 w-50">
                <label for="Pin" class="form-label">
                  Supplier Pincode **
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="Pin"
                  name="Pin"
                  value={formData.SellerDtls.Pin}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue.length <= 6) {
                      handleSellerInput(e);
                    }
                  }}
                />
                {formData.SellerDtls.Pin.length < 6 && (
                  <div style={{ color: "red" }}>
                    Pincode should be 6 digits.
                  </div>
                )}
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="Ph" class="form-label">
                  Supplier Phone
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="Ph"
                  name="Ph"
                  value={formData.SellerDtls.Ph ? formData.SellerDtls.Ph : ""}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue.length <= 10) {
                      handleSellerInput(e);
                    }
                  }}
                />
                {formData.SellerDtls.Ph &&
                  formData.SellerDtls.Ph.length < 10 && (
                    <div style={{ color: "red" }}>
                      Number should be 10 digits.
                    </div>
                  )}
              </div>
              <div class="mb-2 w-50">
                <label for="Em" class="form-label">
                  Supplier Email
                </label>
                <input
                  type="email"
                  class="form-control"
                  id="Em"
                  name="Em"
                  value={formData.SellerDtls.Em ? formData.SellerDtls.Em : ""}
                  onChange={(e) => handleSellerInput(e)}
                />
              </div>
            </div>
          </>
        );
      case 2: // BuyerDtls
        return (
          <>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="LglNm" class="form-label">
                  Buyer Legal Name **
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="LglNm"
                  name="LglNm"
                  value={formData.BuyerDtls.LglNm}
                  onChange={(e) => handleBuyerInput(e)}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="TrdNm" class="form-label">
                  Buyer Trade Name
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="TrdNm"
                  name="TrdNm"
                  value={
                    formData.BuyerDtls.TrdNm ? formData.BuyerDtls.TrdNm : ""
                  }
                  onChange={(e) => handleBuyerInput(e)}
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="Gstin" class="form-label">
                  Buyer GSTIN **
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="Gstin"
                  name="Gstin"
                  value={formData.BuyerDtls.Gstin}
                  onChange={(e) => handleBuyerInput(e)}
                  maxLength={15}
                />
                {formData.BuyerDtls.Gstin.length != "" &&
                  formData.BuyerDtls.Gstin.length < 15 && (
                    <div style={{ color: "red" }}>
                      GSTIN should be 15 characters.
                    </div>
                  )}
              </div>
              <div className="mb-2 w-50">
                <label htmlFor="Pos" className="form-label">
                  Place of Supply (State Code) **
                </label>
                <select
                  className="form-select"
                  id="Typ"
                  name="Pos"
                  value={formData.BuyerDtls.Pos}
                  onChange={(e) => handleBuyerInput(e)}
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
              <div class="mb-2 w-50">
                <label for="Addr1" class="form-label">
                  Buyer Address 1 **
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="Addr1"
                  name="Addr1"
                  value={formData.BuyerDtls.Addr1}
                  onChange={(e) => handleBuyerInput(e)}
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="Addr2" class="form-label">
                  Buyer Address 2
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="Addr2"
                  name="Addr2"
                  value={
                    formData.BuyerDtls.Addr2 ? formData.BuyerDtls.Addr2 : ""
                  }
                  onChange={(e) => handleBuyerInput(e)}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="Loc" class="form-label">
                  Buyer Place **
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="Loc"
                  name="Loc"
                  value={formData.BuyerDtls.Loc}
                  onChange={(e) => handleBuyerInput(e)}
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div className="mb-2 w-50">
                <label htmlFor="Pos" className="form-label">
                  Buyer State Code **
                </label>
                <select
                  className="form-select"
                  id="Typ"
                  name="Stcd"
                  value={formData.BuyerDtls.Stcd}
                  onChange={(e) => handleBuyerInput(e)}
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
              <div class="mb-2 w-50">
                <label for="Pin" class="form-label">
                  Buyer Pincode **
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="Pin"
                  name="Pin"
                  value={formData.BuyerDtls.Pin}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue.length <= 6) {
                      handleBuyerInput(e);
                    }
                  }}
                />
                {formData.BuyerDtls.Pin.length < 6 && (
                  <div style={{ color: "red" }}>
                    Pincode should be 6 digits.
                  </div>
                )}
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="Ph" class="form-label">
                  Buyer Phone
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="Ph"
                  maxLength={10}
                  name="Ph"
                  value={formData.BuyerDtls.Ph ? formData.BuyerDtls.Ph : ""}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue.length <= 10) {
                      handleBuyerInput(e);
                    }
                  }}
                />
                {formData.BuyerDtls.Ph && formData.BuyerDtls.Ph.length < 10 && (
                  <div style={{ color: "red" }}>
                    Number should be 10 digits.
                  </div>
                )}
              </div>
              <div class="mb-2 w-50">
                <label for="Em" class="form-label">
                  Buyer Email
                </label>
                <input
                  type="email"
                  class="form-control"
                  id="Em"
                  name="Em"
                  value={formData.BuyerDtls.Em ? formData.BuyerDtls.Em : ""}
                  onChange={(e) => handleBuyerInput(e)}
                />
              </div>
            </div>
          </>
        );
      case 3: // DispDtls
        return (
          <>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="Nm" class="form-label">
                  Dispatch From Name **
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="Nm"
                  name="Nm"
                  value={formData.DispDtls.Nm}
                  onChange={(e) => handleDispInput(e)}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="Addr1" class="form-label">
                  Dispatch from Address 1 **
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="Addr1"
                  name="Addr1"
                  value={formData.DispDtls.Addr1}
                  onChange={(e) => handleDispInput(e)}
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="Addr2" class="form-label">
                  Dispatch from Address 2
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="Addr2"
                  name="Addr2"
                  value={formData.DispDtls.Addr2 ? formData.DispDtls.Addr2 : ""}
                  onChange={(e) => handleDispInput(e)}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="Loc" class="form-label">
                  Dispatch from Place **
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="Loc"
                  name="Loc"
                  value={formData.DispDtls.Loc}
                  onChange={(e) => handleDispInput(e)}
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div className="mb-2 w-50">
                <label htmlFor="Pos" className="form-label">
                  Dispatch from State Code **
                </label>
                <select
                  className="form-select"
                  id="Typ"
                  name="Stcd"
                  value={formData.DispDtls.Stcd}
                  onChange={(e) => handleDispInput(e)}
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
              <div class="mb-2 w-50">
                <label for="Pin" class="form-label">
                  Dispatch from Pincode **
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="Pin"
                  name="Pin"
                  value={formData.DispDtls.Pin}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue.length <= 6) {
                      handleDispInput(e);
                    }
                  }}
                />
                {formData.DispDtls.Pin.length < 6 && (
                  <div style={{ color: "red" }}>
                    Pincode should be 6 characters.
                  </div>
                )}
              </div>
            </div>
          </>
        );

      case 4: // ShipDtls
        return (
          <>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="LglNm" class="form-label">
                  Ship to Legal Name **
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="LglNm"
                  name="LglNm"
                  value={formData.ShipDtls.LglNm}
                  onChange={(e) => handleShipInput(e)}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="TrdNm" class="form-label">
                  Ship to Trade Name
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="TrdNm"
                  name="TrdNm"
                  value={formData.ShipDtls.TrdNm ? formData.ShipDtls.TrdNm : ""}
                  onChange={(e) => handleShipInput(e)}
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="Gstin" class="form-label">
                  Ship to GSTIN **
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="Gstin"
                  name="Gstin"
                  value={formData.ShipDtls.Gstin}
                  onChange={(e) => handleShipInput(e)}
                  maxLength={15}
                />
                {formData.ShipDtls.Gstin.length != "" &&
                  formData.ShipDtls.Gstin.length < 15 && (
                    <div style={{ color: "red" }}>
                      GSTIN should be 15 characters.
                    </div>
                  )}
              </div>
              <div class="mb-2 w-50">
                <label for="Addr1" class="form-label">
                  Ship to Address 1 **
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="Addr1"
                  name="Addr1"
                  value={formData.ShipDtls.Addr1}
                  onChange={(e) => handleShipInput(e)}
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="Addr2" class="form-label">
                  Ship to Address 2
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="Addr2"
                  name="Addr2"
                  value={formData.ShipDtls.Addr2 ? formData.ShipDtls.Addr2 : ""}
                  onChange={(e) => handleShipInput(e)}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="Loc" class="form-label">
                  Ship to Place **
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="Loc"
                  name="Loc"
                  value={formData.ShipDtls.Loc}
                  onChange={(e) => handleShipInput(e)}
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div className="mb-2 w-50">
                <label htmlFor="Pos" className="form-label">
                  Ship to State Code **
                </label>
                <select
                  className="form-select"
                  id="Typ"
                  name="Stcd"
                  value={formData.ShipDtls.Stcd}
                  onChange={(e) => handleShipInput(e)}
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
              <div class="mb-2 w-50">
                <label for="Pin" class="form-label">
                  Ship to Pincode **
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="Pin"
                  name="Pin"
                  value={formData.ShipDtls.Pin}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue.length <= 6) {
                      handleShipInput(e);
                    }
                  }}
                />
                {formData.ShipDtls.Pin.length < 6 && (
                  <div style={{ color: "red" }}>
                    Pincode should be 6 characters.
                  </div>
                )}
              </div>
            </div>
          </>
        );
      case 5: // ItemDtls
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
                      <th>Product</th>
                      <th>HSN Code</th>
                      <th>Qty</th>
                      <th>Unit</th>
                      <th>Unit Price</th>
                      <th>Discount</th>
                      <th>GST Rate</th>
                      <th>Cess Rate (%)</th>
                      <th>Cess Exmp (Rs)</th>
                      <th>State Cess (%)</th>
                      <th>State C-Exmp (Rs)</th>
                      <th>Total Value</th>
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
                            value={row.PrdDesc}
                            name="PrdDesc"
                            onChange={(e) => handleItemChange(e, row.id)}
                          />
                        </td>

                        <td>
                          <TextField
                            type="text"
                            name="HsnCd"
                            value={row.HsnCd}
                            onChange={(e) => handleItemChange(e, row.id)}
                          />
                        </td>

                        <td>
                          <TextField
                            type="number"
                            name="Qty"
                            value={row.Qty}
                            onChange={(e) => handleItemChange(e, row.id)}
                          />
                        </td>
                        <td>
                          <TextField
                            type="text"
                            name="Unit"
                            value={row.Unit}
                            onChange={(e) => handleItemChange(e, row.id)}
                          />
                        </td>
                        <td>
                          <TextField
                            type="number"
                            name="UnitPrice"
                            value={row.UnitPrice}
                            onChange={(e) => handleItemChange(e, row.id)}
                          />
                        </td>
                        <td>
                          <TextField
                            type="number"
                            value={row.Discount}
                            onChange={(e) => handleItemChange(e, row.id)}
                            name="Discount"
                          />
                        </td>
                        <td>
                          <TextField
                            type="number"
                            name="GstRt"
                            value={row.GstRt}
                            onChange={(e) => handleItemChange(e, row.id)}
                          />
                        </td>
                        <td>
                          <TextField
                            type="number"
                            name="CesRt"
                            value={row.CesRt}
                            onChange={(e) => handleItemChange(e, row.id)}
                          />
                        </td>
                        <td>
                          <TextField
                            type="number"
                            name="CesNonAdvlAmt"
                            value={row.CesNonAdvlAmt}
                            onChange={(e) => handleItemChange(e, row.id)}
                          />
                        </td>
                        <td>
                          <TextField
                            type="number"
                            name="StateCesRt"
                            value={row.StateCesRt}
                            onChange={(e) => handleItemChange(e, row.id)}
                          />
                        </td>
                        <td>
                          <TextField
                            type="number"
                            name="StateCesNonAdvlAmt"
                            value={row.StateCesNonAdvlAmt}
                            onChange={(e) => handleItemChange(e, row.id)}
                          />
                        </td>
                        <td>
                          <TextField
                            type="number"
                            value={row.TotItemVal}
                            onChange={(e) => handleItemChange(e, row.id)}
                            name="TotItemVal"
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

      case 6: // ValDtls
        return (
          <>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="AssVal" class="form-label">
                  Assessed Value
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="AssVal"
                  name="AssVal"
                  value={formData.ValDtls.AssVal}
                  disabled
                  // onChange={(e) => handleShipInput(e)}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="CgstVal" class="form-label">
                  Cgst Value
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="CgstVal"
                  name="CgstVal"
                  value={formData.ValDtls.CgstVal}
                  disabled
                  // onChange={(e) => handleShipInput(e)}
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="SgstVal" class="form-label">
                  Sgst Value
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="SgstVal"
                  name="SgstVal"
                  value={formData.ValDtls.SgstVal}
                  disabled
                  //onChange={(e) => handleShipInput(e)}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="IgstVal" class="form-label">
                  Igst Value
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="IgstVal"
                  name="IgstVal"
                  value={formData.ValDtls.IgstVal}
                  disabled
                  //onChange={(e) => handleShipInput(e)}
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="CesVal" class="form-label">
                  Cess Value
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="CesVal"
                  name="CesVal"
                  value={formData.ValDtls.CesVal}
                  disabled
                  // onChange={(e) => handleShipInput(e)}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="StCesVal" class="form-label">
                  State Cess Value
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="StCesVal"
                  name="StCesVal"
                  value={formData.ValDtls.StCesVal}
                  disabled
                  //onChange={(e) => handleShipInput(e)}
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="Discount" class="form-label">
                  Discount
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="Discount"
                  name="Discount"
                  value={formData.ValDtls.Discount}
                  disabled
                  //onChange={(e) => handleShipInput(e)}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="RndOffAmt" class="form-label">
                  Round Off Amount
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="RndOffAmt"
                  name="RndOffAmt"
                  value={rndOffAmt}
                  onChange={(e) => handleValInput(e)}
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="TotInvVal" class="form-label">
                  Total Invoice Value
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="TotInvVal"
                  name="TotInvVal"
                  value={formData.ValDtls.TotInvVal}
                  disabled
                  //onChange={(e) => handleShipInput(e)}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="TotInvValFc" class="form-label">
                  Total Invoice Value in Foreign Currency
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="TotInvValFc"
                  name="TotInvValFc"
                  value={formData.ValDtls.TotInvValFc}
                  disabled
                  //onChange={(e) => handleValInput(e)}
                />
              </div>
            </div>
          </>
        );

      case 7: // PayDtls
        return (
          <>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="Nm" class="form-label">
                  Payee Name
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="Nm"
                  name="Nm"
                  value={formData.PayDtls.Nm ? formData.PayDtls.Nm : ""}
                  onChange={(e) => handlePayInput(e)}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="AccDet" class="form-label">
                  Payee Bank Account Number
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="AccDet"
                  name="AccDet"
                  value={formData.PayDtls.AccDet ? formData.PayDtls.AccDet : ""}
                  onChange={(e) => handlePayInput(e)}
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="Mode" class="form-label">
                  Mode of Payment
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="Mode"
                  name="Mode"
                  value={formData.PayDtls.Mode ? formData.PayDtls.Mode : ""}
                  onChange={(e) => handlePayInput(e)}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="FinInsBr" class="form-label">
                  Bank Branch Code
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="FinInsBr"
                  name="FinInsBr"
                  value={
                    formData.PayDtls.FinInsBr ? formData.PayDtls.FinInsBr : ""
                  }
                  onChange={(e) => handlePayInput(e)}
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="PayTerm" class="form-label">
                  Payment Terms
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="PayTerm"
                  name="PayTerm"
                  value={
                    formData.PayDtls.PayTerm ? formData.PayDtls.PayTerm : ""
                  }
                  onChange={(e) => handlePayInput(e)}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="PayInstr" class="form-label">
                  Payment Instructions
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="PayInstr"
                  name="PayInstr"
                  value={
                    formData.PayDtls.PayInstr ? formData.PayDtls.PayInstr : ""
                  }
                  onChange={(e) => handlePayInput(e)}
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="CrTrn" class="form-label">
                  Credit Transfer Terms
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="CrTrn"
                  name="CrTrn"
                  value={formData.PayDtls.CrTrn ? formData.PayDtls.CrTrn : ""}
                  onChange={(e) => handlePayInput(e)}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="DirDr" class="form-label">
                  Direct Debit Terms
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="DirDr"
                  name="DirDr"
                  value={formData.PayDtls.DirDr ? formData.PayDtls.DirDr : ""}
                  onChange={(e) => handlePayInput(e)}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="CrDay" class="form-label">
                  Credit Days
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="CrDay"
                  name="CrDay"
                  value={formData.PayDtls.CrDay ? formData.PayDtls.CrDay : ""}
                  onChange={(e) => handlePayInput(e)}
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="PaidAmt" class="form-label">
                  Paid Amount
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="PaidAmt"
                  name="PaidAmt"
                  value={
                    formData.PayDtls.PaidAmt ? formData.PayDtls.PaidAmt : ""
                  }
                  onChange={(e) => handlePayInput(e)}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="PaymtDue" class="form-label">
                  Payment Due
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="PaymtDue"
                  name="PaymtDue"
                  value={
                    formData.PayDtls.PaymtDue ? formData.PayDtls.PaymtDue : ""
                  }
                  onChange={(e) => handlePayInput(e)}
                />
              </div>
            </div>
          </>
        );

      case 8: // EwbDtls
        return (
          <>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="TransId" class="form-label">
                  Transporter Id
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="TransId"
                  name="TransId"
                  value={
                    formData.EwbDtls.TransId ? formData.EwbDtls.TransId : ""
                  }
                  onChange={(e) => handleEwabInput(e)}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="TransName" class="form-label">
                  Transporter Name
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="TransName"
                  name="TransName"
                  value={
                    formData.EwbDtls.TransName ? formData.EwbDtls.TransName : ""
                  }
                  onChange={(e) => handleEwabInput(e)}
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="Distance" class="form-label">
                  Distance of Transportation **
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="Distance"
                  name="Distance"
                  value={
                    formData.EwbDtls.Distance ? formData.EwbDtls.Distance : ""
                  }
                  onChange={(e) => handleEwabInput(e)}
                />
              </div>
              <div className="mb-2 w-50">
                <label htmlFor="TransMode" className="form-label">
                  Mode of Transportation
                </label>
                <select
                  className="form-select"
                  id="TransMode"
                  name="TransMode"
                  value={
                    formData.EwbDtls.TransMode ? formData.EwbDtls.TransMode : ""
                  }
                  onChange={(e) => handleEwabInput(e)}
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
                <label for="TransDocNo" class="form-label">
                  Transport Document Number
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="TransDocNo"
                  name="TransDocNo"
                  value={
                    formData.EwbDtls.TransDocNo
                      ? formData.EwbDtls.TransDocNo
                      : ""
                  }
                  onChange={(e) => handleEwabInput(e)}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="TransDocDt" class="form-label">
                  Transport Document Date
                </label>
                <input
                  type="date"
                  class="form-control"
                  id="TransDocDt"
                  name="TransDocDt"
                  value={transDocDate}
                  onChange={(e) => handleEwabInput(e)}
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="VehNo" class="form-label">
                  Vehicle No
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="VehNo"
                  name="VehNo"
                  value={formData.EwbDtls.VehNo ? formData.EwbDtls.VehNo : ""}
                  onChange={(e) => handleEwabInput(e)}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="VehType" class="form-label">
                  Vehicle Type
                </label>
                <select
                  type="text"
                  class="form-select"
                  id="VehType"
                  name="VehType"
                  value={
                    formData.EwbDtls.VehType ? formData.EwbDtls.VehType : ""
                  }
                  onChange={(e) => handleEwabInput(e)}
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

  const saveIrn = async (AckDt, AckNo, Irn, SignedInvoice, SignedQRCode) => {
    await axios.post("http://localhost:3500/save-irn", {
      AckDt,
      AckNo,
      Irn,
      SignedInvoice,
      SignedQRCode,
    });
  };

  const handleSave = async () => {
    await axios
      .post(`http://localhost:3500/generate-invoice`, {
        formData: formData,
        auth: state,
      })
      .then((res) => {
        if (res.data.ErrorDetails) {
          if (res.data.ErrorDetails[0]?.ErrorMessage === "Invalid Token") {
            navigation("/gst/e-invoice-auth");
          } else {
            console.log(res.data.ErrorDetails[0]?.ErrorMessage);
          }
        } else {
          if (res.data.AckDt) {
            saveIrn(
              res.data.AckDt,
              res.data.AckNo,
              res.data.Irn,
              res.data.SignedInvoice,
              res.data.SignedQRCode
            );
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

export default InvForm;
