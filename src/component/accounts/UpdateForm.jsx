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

const UpdateForm = ({ state }) => {
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
    ewbNo: "",
    vehicleNo: "",
    fromPlace: "",
    fromState: "",
    reasonCode: "",
    reasonRem: "",
    transDocNo: "",
    transDocDate: "",
    transMode: "",
    vehicleType: "",
  });

  const handleSave = async () => {
    await axios
      .post(`http://localhost:3500/update/vehiclenumber`, {
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
        }
        //  else {
        //   if (res.data.AckDt) {
        //     saveIrn(
        //       res.data.AckDt,
        //       res.data.AckNo,
        //       res.data.Irn,
        //       res.data.SignedInvoice,
        //       res.data.SignedQRCode
        //     );
        //   }
        // }
      })
      .catch((err) => console.error(err));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };
  const [documentDate, setDocumentDate] = useState("");

  const handleDocInput = (e) => {
    const { name, value } = e.target;
    if (name === "transDocDate") {
      setDocumentDate(value);
      // Convert the selected date to a Date object
      const parsedDate = new Date(value);
      // Format the date as "day/month/year"
      const day = parsedDate.getDate().toString().padStart(2, "0");
      const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
      const year = parsedDate.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      setFormData((prevState) => ({
        ...prevState,
        [name]: formattedDate,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  function getSteps() {
    return [""];
  }

  console.log(formData);

  function getStepContent(step) {
    switch (step) {
      case 0: // BasicDtls
        return (
          <div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="No" class="form-label">
                  Ewb No **
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="ewbNo"
                  name="ewbNo"
                  value={formData.ewbNo}
                  onChange={handleInputChange}
                />
              </div>

              <div class="mb-2 w-50">
                <label for="No" class="form-label">
                  Vehicle Number **
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="vehicleNo"
                  name="vehicleNo"
                  value={formData.vehicleNo}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="No" class="form-label">
                  From place **
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="fromPlace"
                  name="fromPlace"
                  value={formData.fromPlace}
                  onChange={handleInputChange}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="Dt" class="form-label">
                  From state **
                </label>
                <select
                  className="form-select"
                  id="fromState"
                  name="fromState"
                  value={formData.fromState}
                  onChange={handleInputChange}
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
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="reasonCode" class="form-label">
                  Reason Code **
                </label>
                <select
                  className="form-select"
                  id="reasonCode"
                  name="reasonCode"
                  value={formData.reasonCode}
                  onChange={handleInputChange}
                >
                  <option value="1">Due to Break Down</option>
                  <option value="2">Due to Trans-shipment</option>
                  <option value="3">Others (Pls. Specify)</option>
                  <option value="4">First Time</option>
                </select>
              </div>
              <div class="mb-2 w-50">
                <label for="Dt" class="form-label">
                  Reason **
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="reasonRem"
                  name="reasonRem"
                  value={formData.reasonRem}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="No" class="form-label">
                Transportation Document No **
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="transDocNo"
                  name="transDocNo"
                  value={formData.transDocNo}
                  onChange={handleInputChange}
                />
              </div>
              <div class="mb-2 w-50">
                <label for="Dt" class="form-label">
                  Transportation Date **
                </label>
                <input
                  type="date"
                  class="form-control"
                  id="transDocDate"
                  name="transDocDate"
                  value={documentDate}
                  onChange={handleDocInput}
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="transMode" class="form-label">
                  Transportation Mode **
                </label>
                <select
                  className="form-select"
                  id="transMode"
                  name="transMode"
                  value={formData.transMode}
                  onChange={handleInputChange}
                >
                  <option value="">Select Transportation Mode</option>
                  <option value="1">Road</option>
                  <option value="2">Rail</option>
                  <option value="3">Air</option>
                  <option value="4">Ship</option>
                  <option value="5">inTransit</option>
                </select>
              </div>
              <div class="mb-2 w-50">
                <label for="Dt" class="form-label">
                  Vehicle type **
                </label>
                <select
                  type="text"
                  class="form-select"
                  id="vehicleType"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                >
                  <option value="">Select Vehicle Type</option>
                  <option value="R">Regular</option>
                  <option value="O">Over Dimentional Cargo</option>
                </select>
              </div>
            </div>
          </div>
        );

      default:
        return "unknown step";
    }
  }

  return (
    <div style={{ background: "#F8F6F2", padding: "0" }}>
      <Stepper alternativeLabel activeStep={activeStep}>
        {steps.map((step, index) => {
          const labelProps = {};
          const stepProps = {};

          return <Step {...stepProps} key={index}></Step>;
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
          {/* <Button
            style={{ marginBottom: "20px", marginLeft: "20px" }}
            className={classes.button}
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            back
        </Button>*/}

          <Button
            style={{ marginBottom: "20px", marginLeft: "30px" }}
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

export default UpdateForm;
