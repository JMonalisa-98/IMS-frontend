import React, {  useState } from "react";
import "../../Styles.css";
import {  useNavigate } from "react-router-dom";
import { errorCodes } from "./ErrorCodes";
import { IoMdCloseCircleOutline } from "react-icons/io";


import {
  Typography,
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

const EwayIrn = ({ state,setOpenError, setErrorMsg }) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const navigation = useNavigate();

  const [formData, setFormData] = useState({
    Irn: "",
    Distance: 0,
    TransMode: "0",
    TransId: "",
    TransName: null,
    TransDocDt: "",
    TransDocNo: "",
    VehNo: "",
    VehType: "",
    ExpShipDtls: {
      Addr1: "",
      Addr2: null,
      Loc: "",
      Pin: 0,
      Stcd: ""
    },
    DispDtls: {
      Nm: "",
      Addr1: "",
      Addr2: null,
      Loc: "",
      Pin: 0,
      Stcd: ""
    }
  });

  const handleSave = async () => {
    await axios
      .post("http://localhost:3500/irn/generate-eway-bill", {
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
            // console.log(res.data);
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
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const [documentDate, setDocumentDate] = useState("");
  const handleTransInput = (e) => {
    if (e.target.name === "TransDocDt") {
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
    } else {
      setFormData((prevState) => ({
        ...prevState,
          [e.target.name]: e.target.value,
        
      }));
    }
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
      ExpShipDtls: {
        ...prevState.ExpShipDtls,
        [e.target.name]: e.target.value,
      },
    }));
  };



  function getSteps() {
    return [
      "Basic Details",
      "Shipping Details",
      "Dispatch Details",
    ];
  }

  function getStepContent(step) {
    switch (step) {
      case 0: // Basic Details
        return (
          <>
          <div className="data-input-fields">
          <div class="mb-2 w-50">
              <label for="Irn" class="form-label">
                Invoice Reference Number **
              </label>
              <input
                type="text"
                class="form-control"
                id="Irn"
                name="Irn"
                value={formData.Irn}
                onChange={(e) => handleTransInput(e)}
              />
            </div>
            <div class="mb-2 w-50">
              <label for="TransId" class="form-label">
                Transporter Id
              </label>
              <input
                type="text"
                class="form-control"
                id="TransId"
                name="TransId"
                value={formData.TransId}
                onChange={(e) => handleTransInput(e)}
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
                value={formData.TransName ? formData.TransName : ""}
                onChange={(e) => handleTransInput(e)}
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
                value={formData.Distance}
                onChange={(e) => handleTransInput(e)}
              />
            </div>
            <div className="mb-2 w-50">
              <label htmlFor="TransMode" className="form-label">
                Mode of Transportation **
              </label>
              <select
                className="form-select"
                id="TransMode"
                name="TransMode"
                value={formData.TransMode}
                onChange={(e) => handleTransInput(e)}
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
                value={formData.TransDocNo}
                onChange={(e) => handleTransInput(e)}
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
                value={documentDate}
                onChange={(e) => handleTransInput(e)}
              />
            </div>
          </div>
          <div className="data-input-fields">
            <div class="mb-2 w-50">
              <label for="VehNo" class="form-label">
                Vehicle Number **
              </label>
              <input
                type="text"
                class="form-control"
                id="VehNo"
                name="VehNo"
                value={formData.VehNo}
                onChange={(e) => handleTransInput(e)}
              />
            </div>
            <div class="mb-2 w-50">
              <label for="VehType" class="form-label">
                Vehicle Type **
              </label>
              <select
                type="text"
                class="form-select"
                id="VehType"
                name="VehType"
                value={formData.VehType}
                onChange={(e) => handleTransInput(e)}
              >
                <option value="">Select Vehicle Type</option>
                <option value="R">Regular</option>
                <option value="O">Over Dimentional Cargo</option>
              </select>
            </div>
          </div>
        </>
        );

      case 1: // Shipping Details
        return (
          <>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="Addr1" class="form-label">
                  Ship to Address 1 **
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="Addr1"
                  name="Addr1"
                  value={formData.ExpShipDtls.Addr1}
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
                  value={formData.ExpShipDtls.Addr2 ? formData.ExpShipDtls.Addr2 : ""}
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
                  value={formData.ExpShipDtls.Loc}
                  onChange={(e) => handleShipInput(e)}
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div className="mb-2 w-50">
                <label htmlFor="Stcd" className="form-label">
                  Ship to State Code **
                </label>
                <select
                  className="form-select"
                  id="Stcd"
                  name="Stcd"
                  value={formData.ExpShipDtls.Stcd}
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
                  value={formData.ExpShipDtls.Pin}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue.length <= 6) {
                      handleShipInput(e);
                    }
                  }}
                />
                {formData.ExpShipDtls.Pin.length < 6 && (
                  <div style={{ color: "red" }}>
                    Pincode should be 6 characters.
                  </div>
                )}
              </div>
            </div>
          </>
        );
      case 2: // Dispatch Details
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
              <label htmlFor="Stcd" className="form-label">
                Dispatch from State Code **
              </label>
              <select
                className="form-select"
                id="Stcd"
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
      
      
      default:
        return "unknown step";
    }
  }

 

//   const saveIrn = async (AckDt, AckNo, Irn, SignedInvoice, SignedQRCode) => {
//     await axios.post("http://localhost:3500/save-irn", {
//       AckDt,
//       AckNo,
//       Irn,
//       SignedInvoice,
//       SignedQRCode,
//     });
//   };

 

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

export default EwayIrn;