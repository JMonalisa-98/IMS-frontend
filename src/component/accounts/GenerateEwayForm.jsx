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

function GenerateEwayForm({ state }) {
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
    tripSheetNo: "",
    vehicleNo: "",
    fromPlace: "",
    fromState: "",
    transDocNo: "",
    transDocDate: "",
    transMode: "",
    reasonCode: "",
    reasonRem: "",
  });

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
                  Trip Sheet No **
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="tripSheetNo"
                  name="tripSheetNo"
                  value={formData.tripSheetNo}
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
                <input
                  type="number"
                  class="form-control"
                  id="fromState"
                  name="fromState"
                  value={formData.fromState}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="No" class="form-label">
                  Transaction No **
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
                <label for="TransDocDt" class="form-label">
                  Transaction Date **
                </label>
                <input
                  type="date"
                  class="form-control"
                  id="transDocDate"
                  name="transDocDate"
                  value={documentDate}
                  onChange={(e) => handleTransInput(e)}
                />
              </div>

            
            </div>
            <div className="data-input-fields">
              <div class="mb-2 w-50">
                <label for="No" class="form-label">
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
              <div class="mb-2 w-50">
                <label for="No" class="form-label">
                  Reason Code **
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
              <div class="mb-2 w-100">
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
}

export default GenerateEwayForm;
