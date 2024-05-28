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

const AddMultiVehicles = ({ state }) => {
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
    "ewbNo": "",
    "groupNo": "",
    "vehicleNo": "",
    "transDocNo": "",
    "transDocDate": "",
    "quantity": ""
  });




  
  const handleSave = async () => {
    await axios
      .post(`http://localhost:3500/add/multi-vehicles`, {
        formData: formData,
        auth: state,
      })
      .then((res) => {
        if (res.data.ErrorDetails) {
          if (res.data.ErrorDetails[0]?.ErrorMessage === "Invalid Token") {
            navigation("/gst/e-invoice-auth");
          } else {
            console.log(res.data.ErrorDetails[0]?.ErrorMessage);
          }}
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
    console.log(formData)
  };
//   const [documentDate, setDocumentDate] = useState("");

//   const handleDocInput = (e) => {
//     const { name, value } = e.target;
//     if (name === "transDocDate") {
//       // Convert the selected date to a Date object
//       const parsedDate = new Date(value);
//       // Format the date as "day/month/year"
//       const day = parsedDate.getDate().toString().padStart(2, "0");
//       const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
//       const year = parsedDate.getFullYear();
//       const formattedDate = `${day}/${month}/${year}`;
//       setFormData((prevState) => ({
//         ...prevState,
//         [name]: formattedDate,
//       }));
//     } else {
//       setFormData((prevState) => ({
//         ...prevState,
//         [name]: value,
//       }));
//     }
//   };
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
    return [
      "",
     
    ];
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
            Group Number **
          </label>
          <input
            type="number"
            class="form-control"
            id="groupNo"
            name="groupNo"
            value={formData.groupNo}
            onChange={handleInputChange}
            />
        </div>
            </div>
            <div className="data-input-fields">
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
          <div class="mb-2 w-50">
          <label for="No" class="form-label">
          Transport Doucement No **
          </label>
          <input
            type="text"
            class="form-control"
            id="transDocNo"
            name="transDocNo"
            value={formData.transDocNo}
          onChange={handleInputChange}
          />
          </div>
            </div>
       
          <div className="data-input-fields">
          <div class="mb-2 w-50">
          <label for="transDocDate" class="form-label">
            Transport Document Date
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
          <div class="mb-2 w-50">
            <label for="No" class="form-label">
              Quantity **
            </label>
            <input
              type="number"
              class="form-control"
              id="quantity"
              name="quantity"
              value={formData.quantity}
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

          return (
            <Step {...stepProps} key={index}>
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

export default AddMultiVehicles;
