import React, { useState } from "react";
import "../../Styles.css";
import { useNavigate } from "react-router-dom";
import { errorCodes } from "./ErrorCodes";

import {
  Typography,
  Button,
  Stepper,
  Step,
} from "@material-ui/core";
import axios from "axios";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(1),
  },
}));

const ImvMovement = ({ state, setOpenError,errorMsg, setErrorMsg }) => {
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
    reasonCode: 0,
    reasonRem: "",
    fromPlace: "",
    fromState: 0,
    toPlace: "",
    toState: 0,
    transMode: 0,
    totalQuantity: 0,
    unitCode: ""
  });

  const handleSave = async () => {
    await axios
      .post(`http://localhost:3500/generate-imv-movement`, {
        formData: formData,
        auth: state,
      })
      .then((res) => {
        if (res.data.ErrorDetails) {
          if (res.data.ErrorDetails[0]?.ErrorMessage === "Invalid Token") {
            navigation("/gst/e-invoice-auth");
          } else {
            errorMsg.push(res.data.ErrorDetails[0]?.ErrorMessage);
          }
        } else {
          if (res.data.AckDt) {
            console.log(res.data)
          } else if(res.data.errorMessage){
            errorMsg.push(res.data.errorMessage)
            setOpenError(true);
          }
          else {
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
    console.log(formData)
  };

  const [documentDate, setDocumentDate] = useState("");
  const handleTransInput = (e) => {
    if (e.target.name === "transDocDate") {
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
  
  function getSteps() {
    return [ ""];
  }

  console.log(formData);

  function getStepContent(step) {
    switch (step) {
      case 0: // BasicDtls
        return (
          <div>
          <div className="data-input-fields">
          <div class="mb-2 w-50">
            <label for="ewbNo" class="form-label">
            E-Way Bill Number **
            </label>
            <input
              type="text"
              class="form-control"
              id="ewbNo"
              name="ewbNo"
              value={formData.ewbNo}
              onChange={handleInputChange}
            />
          </div>
          <div class="mb-2 w-50">
          <label for="reasonCode" class="form-label">
          Reason Code 
          </label>
          <input
            type="number"
            class="form-control"
            id="reasonCode"
            name="reasonCode"
            value={formData.reasonCode}
            onChange={handleInputChange}
            />
        </div>
     </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="reasonRem" class="form-label">
                Reason for Removal **
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
              <div class="mb-2 w-50">
          <label for="transMode" class="form-label">
            Transaction Mode **
          </label>
          <input
            type="number"
            class="form-control"
            id="transMode"
            name="transMode"
            value={formData.transMode}
          onChange={handleInputChange}
          />
        </div>
    </div>
            <div className="data-input-fields">
            <div class="mb-2 w-50">
                <label for="fromPlace" class="form-label">
                  From Place 
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
            <div className="mb-2 w-50">
                <label htmlFor="fromState" className="form-label">
                  Ship to from State **
                </label>
                <select
                  className="form-select"
                  id="fromState"
                  name="fromState"
                  value={formData.fromState}
                  onChange={(e) => handleInputChange(e)}
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
              <label for="toPlace" class="form-label">
              To Place **
              </label>
              <input
                type="text"
                class="form-control"
                id="toPlace"
                name="toPlace"
                value={formData.toPlace}
              onChange={handleInputChange}
              />
            </div>
          <div className="mb-2 w-50">
                <label htmlFor="toState" className="form-label">
                To Destination state **
                </label>
                <select
                  className="form-select"
                  id="toState"
                  name="toState"
                  value={formData.toState}
                  onChange={(e) => handleInputChange(e)}
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
          <label for="totalQuantity" class="form-label">
          Total Quantity **
          </label>
          <input
            type="number"
            class="form-control"
            id="totalQuantity"
            name="totalQuantity"
            value={formData.totalQuantity}
          onChange={handleInputChange}
          />
        </div>
        <div class="mb-2 w-50">
          <label for="unitCode" class="form-label">
          Unit Code **
          </label>
          <input
            type="text"
            class="form-control"
            id="unitCode"
            name="unitCode"
            value={formData.unitCode}
          onChange={handleInputChange}
          />
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

export default ImvMovement;
