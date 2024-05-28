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

const GenConsolidatedEwayBill = ({ state }) => {
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const steps = getSteps();

    const handleNext = () => {
        setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const navigation = useNavigate();

    const [formData, setFormData] = useState({

        fromPlace: "",
        fromState: 0,
        vehicleNo: "",
        transMode: "",
        transDocNo: "",
        transDocDate: "",
        tripSheetEwbBills:[
                {
                    ewbNo: 0
                }]
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            tripSheetEwbBills: {
              ...prevState.tripSheetEwbBills,
              [e.target.name]: e.target.value,
            },
          }));
    };

    const handleSave = async () => {
        await axios
            .post(`http://localhost:3500/generate-gen-cons-ewaybill`, {
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
                                <label for="vehicleNo" class="form-label">
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
                                <label for="transMode" class="form-label">
                                   Transaction Mode **
                                </label>
                                <input
                                    type="text"
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
                                <label for="transDocNo" class="form-label">
                                     Transaction Document Number **
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
                                <label for="ewbNo" class="form-label">
                                    E-way Bill Number **
                                </label>
                                <input
                                    type="number"
                                    class="form-control"
                                    id="ewbNo"
                                    name="ewbNo"
                                    value={formData.tripSheetEwbBills[0].ewbNo}
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
};

export default GenConsolidatedEwayBill;
