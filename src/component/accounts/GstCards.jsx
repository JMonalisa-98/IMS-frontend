import React, { useState, useEffect } from "react";
import { Bars } from "react-loader-spinner";
import NavBar from "../NavBar";
import SideBar from "../SideBar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import select from "react-select";
import { Link } from "react-router-dom";
import authentication from "../../assets/Authetication.png";
import generate from "../../assets/Generate E-way Bill.png";
import update from "../../assets/Update Vehicle number (2).png";
import cancel from "../../assets/Cancel E-way Bill (2).png";
import reject from "../../assets/Reject E-way Bill (2).png";
import updateTransport from "../../assets/Update Transporter.png";
import extend from "../../assets/Extend Validity.png";
import ewayDeatails from "../../assets/Generate E-way Bill.png";
import otherPart from "../../assets/Get Other Party E-bill Details.png";
import addVehicle from "../../assets/Add Multi Vehcile.png";
import changeVehicle from "../../assets/Change Multi Vehicle.png";
import consigner from "../../assets/Get E-way bill by Consigner.png";
import date from "../../assets/get.png";
import rejectDetails from "../../assets/reject.png";
import initiate from "../../assets/Intiate Multi Vehicle Movement.png";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { errorCodes } from "./ErrorCodes";

function GstCards() {

  const navigation = useNavigate()
  const [ewayBillRejectedByDate, setEwayBillRejectedByDate] = useState(false);
  const [openCancelEWayBill, setOpenCancelEWayBill] = useState(false);
  const [ewayBillByDate, setEwayBillByDate] = useState(false);
  const [otherPartyEWayBill, setOtherPartyEWayBill] = useState(false);
  const [ewayGenConsigner, setEwayGenConsigner] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMsg, setErrorMsg] = useState([]);
  const [formDataEwayGenConsigner, setFormDataEwayGenConsigner] = useState({
    docType: "",
    docNo: "",
  });
  const [formDataOtherPartyEWayBill, setFormDataOtherPartyEWayBill] = useState({
    date: "",
  });
  const [formDataEwayBillRejectedByDate, setFormDataEwayBillRejectedByDate] =
    useState({
      date: "",
    });
  const [formDataEwayBillByDate, setFormDataEwayBillByDate] = useState({
    date: "",
  });
  const [formDataEWayBillDetails, setFormDataEWayBillDetails] = useState({
    ewbNo: "",
  });
  const [formDataCancelEBill, setFormDataCancelEBill] = useState({
    ewbNo: "",
    cancelRsnCode: 2,
    cancelRmrk: "Cancelled the order",
  });
  const [formDataRejectEBill, setFormDataRejectEBill] = useState({
    ewbNo: "",
  });
  const [formDataUpdateTransporter, setFormDataUpdateTransporter] = useState({
    ewbNo: "",
    transporterId: "",
  });
  const [formDataUpdateGetConsEwayBill, setFormDataUpdateGetConsEwayBill] =
    useState({
      tripSheetNo: "",
    });
  const [formDataExtendValidity, setFormDataExtendValidity] = useState({
    ewbNo: "",
    vehicleNo: "",
    fromPlace: "",
    fromState: "",
    remainingDistance: "",
    transDocNo: "",
    transDocDate: "",
    transMode: "",
    extnRsnCode: "",
    extnRemarks: "",
    fromPincode: "",
    consignmentStatus: "",
    transitType: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
  });

  const [eWayBillDetails, setEWayBillDetails] = useState(false);
  const [openRejectEWayBill, setOpenRejectEWayBill] = useState(false);
  const [updateTransporter, setUpdateTransporter] = useState(false);
  const [extendValidity, setExtendValidity] = useState(false);
  const [genConsEwayBill, setGenConsEwayBill] = useState(false);
  const nav = useNavigate();
  const { state } = useLocation();
  const [navClick, setNavClick] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [side, setSide] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleCancelEBill = (e) => {
    setFormDataCancelEBill({
      ...formDataCancelEBill,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitCancelEBill = async () => {
    await axios
      .post("http://localhost:3500/api/eway/enhanced/cancel", {
        formData: formDataCancelEBill,
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
              setOpenCancelEWayBill(false)
            }
          }
        }
      })
      .catch((err) => console.error(err));
  };

  const handleRejectEBill = (e) => {
    setFormDataRejectEBill({
      ...formDataRejectEBill,
      [e.target.name]: e.target.value,
    });
  };
  const handleUpdateTransport = (e) => {
    setFormDataUpdateTransporter({
      ...formDataUpdateTransporter,
      [e.target.name]: e.target.value,
    });
  };
  const [transDate, setTransDate] = useState("");
  const handleExtendValidity = (e) => {
    let formattedDate;
    if (e.target.name === "transDocDate") {
      const parsedDate = new Date(e.target.value);
      setTransDate(e.target.value);
      const day = parsedDate.getDate().toString().padStart(2, "0");
      const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
      const year = parsedDate.getFullYear();

      formattedDate = `${day}/${month}/${year}`;
      setFormDataExtendValidity({
        ...formDataExtendValidity,
        transDocDate: formattedDate,
      });
    } else {
      setFormDataExtendValidity({
        ...formDataExtendValidity,
        [e.target.name]: e.target.value,
      });
    }
  };
  const handleSubmitRejectEBill = async () => {
   await axios.post(
        "http://localhost:3500/api/eway/enhanced/reject",
        { formData: formDataRejectEBill, auth: state }
      ).then((res) => {
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
              setOpenRejectEWayBill(false)
            }
          }
        }
      })
      .catch((err) => console.error(err));
  };

  
  const handleSubmitUpdateTransporter = async () => {
     await axios.post(
        "http://localhost:3500/api/eway/enhanced/update-transporter",
        { formData: formDataUpdateTransporter, auth: state }
      )
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
              setUpdateTransporter(false)
            }
          }
        }
      })
      .catch((err) => console.error(err));
  };

  const handleSubmitExtendValidity = async () => {
     await axios.post(
        "http://localhost:3500/api/eway/enhanced/extend",
        { formData: formDataExtendValidity, auth: state }
      ) .then((res) => {
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
              setExtendValidity(false)
            }
          }
        }
      })
      .catch((err) => console.error(err));
    
  };

  const handleSubmitEWayBillDetails = async () => {
     await axios.post(
        `http://localhost:3500/get/api/eway/enhanced/details`,
        { formData: formDataEWayBillDetails.ewbNo, auth: state }
      ).then((res) => {
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
              setEWayBillDetails(false)
            }
          }
        }
      })
      .catch((err) => console.error(err));
  };

  const handleSubmitOtherPartyEWayBill = async () => {
   await axios.post(
        `http://localhost:3500/get/api/eway/enhanced/other-parties`,
        { formData: formDataOtherPartyEWayBill.date, auth: state }
      ).then((res) => {
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
              setOtherPartyEWayBill(false)
            }
          }
        }
      })
      .catch((err) => console.error(err));
  };


const handleSubmitEwayGenConsigner = async () => {
   await axios.post(
        `http://localhost:3500/get/api/eway/enhanced/bills-generated-consigner`,
        { formData: formDataEwayGenConsigner, auth: state }
      ).then((res) => {
        console.log()
        if (res.data.ErrorDetails) {
          if (res.data.ErrorDetails[0]?.ErrorMessage === "Invalid Token") {
            navigation("/gst/e-invoice-auth");
          } else {
            alert(res.data.ErrorDetails[0]?.ErrorMessage);
          }
        } else if(res.data.errorMessage){
          setOpenError(true);
              errorMsg.push(res.data.errorMessage)
              setEwayGenConsigner(false)
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
              setEwayGenConsigner(false)
            }
          }
        }
      })
      .catch((err) => console.error(err));
  };

  const handleSubmitEwayBillByDate = async () => {
   await axios.post(
        `http://localhost:3500/get/api/eway/enhanced/bills-by-date`,
        { formData: formDataEwayBillByDate, auth: state }
      ).then((res) => {
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
              setEwayBillByDate(false)
            }
          }
        }
      })
      .catch((err) => console.error(err));
  };

  const handleSubmitEwayBillRejectedByDate = async () => {
   await axios.post(
        `http://localhost:3500/get/api/eway/enhanced/bills-rejected-by-date`,
        { formData: formDataEwayBillRejectedByDate, auth: state }
      ).then((res) => {
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
              setEwayBillRejectedByDate(false)
            }
          }
        }
      })
      .catch((err) => console.error(err));
  };

  const handleEwayBillByDate = (e) => {
    setFormDataEwayBillByDate({
      ...formDataEwayBillByDate,
      [e.target.name]: e.target.value,
    });
  };
  const handleEwayBillRejectedByDate = (e) => {
    setFormDataEwayBillRejectedByDate({
      ...formDataEwayBillRejectedByDate,
      [e.target.name]: e.target.value,
    });
  };

  const handleEWayBillDetails = (e) => {
    setFormDataEWayBillDetails({
      ...formDataEWayBillDetails,
      [e.target.name]: e.target.value,
    });
  };
  

  

  const handleOtherPartyEWayBill = (e) => {
    
      
      setFormDataOtherPartyEWayBill({
        ...formDataOtherPartyEWayBill,
        [e.target.name]: e.target.value,
      });
    
  };

  const handleEwayGenConsigner = (e) => {
    setFormDataEwayGenConsigner({
      ...formDataEwayGenConsigner,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    setFormDataExtendValidity({
      ...formDataExtendValidity,
      consignmentStatus:
      formDataExtendValidity.transMode >= 1 &&
      formDataExtendValidity.transMode <= 4
          ? "M"
          : "T",
      transitType:
      formDataExtendValidity.transMode >= 1 &&
        formDataExtendValidity.transMode <= 4
          ? ""
          : "",
    });
  }, [formDataExtendValidity.transMode]);

  console.log(state)

  return (
    <div>
      {isLoading ? (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <Bars
            height="80"
            width="80"
            color="#40a1ed"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : (
        <div className="layout-1">
          {openError ? (
            <div className="modal-ka-baap">
              <div
                className="add-item-modal-in"
                style={{ width: "30%", height: "auto" }}
              >
                <div className="add-item-modal-top d-flex align-items-center justify-content-between">
                  <div className="fw-bold fs-5">Error Messages</div>
                  <IoMdCloseCircleOutline
                    className="fs-5 close-modal-in"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setOpenError(false);
                      setErrorMsg([]);
                    }}
                  />
                </div>

                <div className="row g-3 mt-3 mb-5">
                  <ul>
                    {errorMsg.map((item) => (
                      <li style={{ color: "red" }} key={item}>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="col-12 text-center mt-3">
                    <span
                      className="text-muted"
                      style={{
                        cursor: "pointer",
                        position: "absolute",
                        bottom: "20px",
                        left: "20px",
                        background: "black",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        fontWeight: "600",
                      }}
                    >
                      <a
                        onClick={() => {
                          setOpenError(false);
                          setErrorMsg([]);
                        }}
                      >
                        Back
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {ewayGenConsigner ? (
            <div className="modal-ka-baap">
              <div
                className="add-item-modal-in"
                style={{ width: "35%", height: "auto" }}
              >
                <div className="add-item-modal-top d-flex align-items-center justify-content-between">
                  <div className="fw-bold fs-5">
                    E-Way bill generated by consigner
                  </div>
                  <IoMdCloseCircleOutline
                    className="fs-5 close-modal-in"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setEwayGenConsigner(false);
                    }}
                  />
                </div>

                <form className="row g-3 mt-5" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={formDataEwayGenConsigner.docType}
                    placeholder="Doc Type"
                    name="docType"
                    onChange={(e) => handleEwayGenConsigner(e)}
                  />
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={formDataEwayGenConsigner.docNo}
                    placeholder="Doc No."
                    name="docNo"
                    onChange={(e) => handleEwayGenConsigner(e)}
                  />
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="text-center mt-3">
                      <a
                        onClick={handleSubmitEwayGenConsigner}
                        className="btn btn-lg btn-block btn-danger lift text-uppercase"
                      >
                        GET
                      </a>
                    </div>
                    <div className="text-center mt-3">
                      <a
                        className="btn btn-lg btn-block btn-outline-secondary lift text-uppercase"
                        onClick={() => {
                          setEwayGenConsigner(false);
                        }}
                      >
                        Back
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
          {ewayBillByDate ? (
            <div className="modal-ka-baap">
              <div
                className="add-item-modal-in"
                style={{ width: "35%", height: "auto" }}
              >
                <div className="add-item-modal-top d-flex align-items-center justify-content-between">
                  <div className="fw-bold fs-5">E-Way Bill Details By Date</div>
                  <IoMdCloseCircleOutline
                    className="fs-5 close-modal-in"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setEwayBillByDate(false);
                    }}
                  />
                </div>

                <form className="row g-3 mt-5" onSubmit={handleSubmit}>
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    value={formDataEwayBillByDate.date}
                    name="date"
                    onChange={(e) => handleEwayBillByDate(e)}
                  />
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="text-center mt-3">
                      <a
                        onClick={handleSubmitEwayBillByDate}
                        className="btn btn-lg btn-block btn-danger lift text-uppercase"
                      >
                        GET
                      </a>
                    </div>
                    <div className="text-center mt-3">
                      <a
                        className="btn btn-lg btn-block btn-outline-secondary lift text-uppercase"
                        onClick={() => {
                          setEwayBillByDate(false);
                        }}
                      >
                        Back
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
          {ewayBillRejectedByDate ? (
            <div className="modal-ka-baap">
              <div
                className="add-item-modal-in"
                style={{ width: "35%", height: "auto" }}
              >
                <div className="add-item-modal-top d-flex align-items-center justify-content-between">
                  <div className="fw-bold fs-5">
                    E-Way Bill Details Rejected By Date
                  </div>
                  <IoMdCloseCircleOutline
                    className="fs-5 close-modal-in"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setEwayBillRejectedByDate(false);
                    }}
                  />
                </div>

                <form className="row g-3 mt-5" onSubmit={handleSubmit}>
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    value={formDataEwayBillRejectedByDate.date}
                    name="date"
                    onChange={(e) => handleEwayBillRejectedByDate(e)}
                  />
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="text-center mt-3">
                      <a
                        onClick={handleSubmitEwayBillRejectedByDate}
                        className="btn btn-lg btn-block btn-danger lift text-uppercase"
                      >
                        GET
                      </a>
                    </div>
                    <div className="text-center mt-3">
                      <a
                        className="btn btn-lg btn-block btn-outline-secondary lift text-uppercase"
                        onClick={() => {
                          setEwayBillRejectedByDate(false);
                        }}
                      >
                        Back
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
          {eWayBillDetails ? (
            <div className="modal-ka-baap">
              <div
                className="add-item-modal-in"
                style={{ width: "35%", height: "auto" }}
              >
                <div className="add-item-modal-top d-flex align-items-center justify-content-between">
                  <div className="fw-bold fs-5">E-Way Bill Details</div>
                  <IoMdCloseCircleOutline
                    className="fs-5 close-modal-in"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setEWayBillDetails(false);
                    }}
                  />
                </div>

                <form className="row g-3 mt-5" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={formDataEWayBillDetails.ewbNo}
                    placeholder="Ewb No."
                    name="ewbNo"
                    onChange={(e) => handleEWayBillDetails(e)}
                  />
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="text-center mt-3">
                      <a
                        onClick={handleSubmitEWayBillDetails}
                        className="btn btn-lg btn-block btn-danger lift text-uppercase"
                      >
                        GET
                      </a>
                    </div>
                    <div className="text-center mt-3">
                      <a
                        className="btn btn-lg btn-block btn-outline-secondary lift text-uppercase"
                        onClick={() => {
                          setEWayBillDetails(false);
                        }}
                      >
                        Back
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
          {otherPartyEWayBill ? (
            <div className="modal-ka-baap">
              <div
                className="add-item-modal-in"
                style={{ width: "35%", height: "auto" }}
              >
                <div className="add-item-modal-top d-flex align-items-center justify-content-between">
                  <div className="fw-bold fs-5">Other Party E-Way Bills</div>
                  <IoMdCloseCircleOutline
                    className="fs-5 close-modal-in"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setOtherPartyEWayBill(false);
                    }}
                  />
                </div>

                <form className="row g-3 mt-5" onSubmit={handleSubmit}>
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    value={formDataOtherPartyEWayBill.date}
                    name="date"
                    onChange={(e) => handleOtherPartyEWayBill(e)}
                  />
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="text-center mt-3">
                      <a
                        onClick={handleSubmitOtherPartyEWayBill}
                        className="btn btn-lg btn-block btn-danger lift text-uppercase"
                      >
                        Cancel
                      </a>
                    </div>
                    <div className="text-center mt-3">
                      <a
                        className="btn btn-lg btn-block btn-outline-secondary lift text-uppercase"
                        onClick={() => {
                          setOtherPartyEWayBill(false);
                        }}
                      >
                        Back
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
          {openCancelEWayBill ? (
            <div className="modal-ka-baap">
              <div
                className="add-item-modal-in"
                style={{ width: "35%", height: "auto" }}
              >
                <div className="add-item-modal-top d-flex align-items-center justify-content-between">
                  <div className="fw-bold fs-5">Cancel E-Way Bill</div>
                  <IoMdCloseCircleOutline
                    className="fs-5 close-modal-in"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setOpenCancelEWayBill(false);
                    }}
                  />
                </div>

                <form className="row g-3 mt-5" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={formDataCancelEBill.ewbNo}
                    placeholder="Ewb No."
                    name="ewbNo"
                    onChange={(e) => handleCancelEBill(e)}
                  />
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="text-center mt-3">
                      <a
                        onClick={handleSubmitCancelEBill}
                        className="btn btn-lg btn-block btn-danger lift text-uppercase"
                      >
                        Cancel
                      </a>
                    </div>
                    <div className="text-center mt-3">
                      <a
                        className="btn btn-lg btn-block btn-outline-secondary lift text-uppercase"
                        onClick={() => {
                          setOpenCancelEWayBill(false);
                        }}
                      >
                        Back
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
          {extendValidity ? (
            <div className="modal-ka-baap">
              <div
                className="add-item-modal-in"
                style={{
                  width: "35%",
                  height: "auto",
                }}
              >
                <div className="add-item-modal-top d-flex align-items-center justify-content-between">
                  <div className="fw-bold fs-5">Extend Validity</div>
                  <IoMdCloseCircleOutline
                    className="fs-5 close-modal-in"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setExtendValidity(false);
                    }}
                  />
                </div>

                <form className="row g-3 mt-5" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={formDataExtendValidity.ewbNo}
                    placeholder="Ewb No."
                    name="ewbNo"
                    onChange={(e) => handleExtendValidity(e)}
                  />
                  <div className="d-flex">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={formDataExtendValidity.vehicleNo}
                      placeholder="Vehicle No"
                      name="vehicleNo"
                      onChange={(e) => handleExtendValidity(e)}
                    />
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={formDataExtendValidity.fromPlace}
                      placeholder="From Place"
                      name="fromPlace"
                      onChange={(e) => handleExtendValidity(e)}
                    />
                  </div>
                  <div className="d-flex">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={formDataExtendValidity.fromState}
                      placeholder="From State"
                      name="fromState"
                      onChange={(e) => handleExtendValidity(e)}
                    />
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={formDataExtendValidity.remainingDistance}
                      placeholder="Remaining Distance"
                      name="remainingDistance"
                      onChange={(e) => handleExtendValidity(e)}
                    />
                  </div>
                  <div className="d-flex">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={formDataExtendValidity.transDocNo}
                      placeholder="Trans Doc No"
                      name="transDocNo"
                      onChange={(e) => handleExtendValidity(e)}
                    />
                    <input
                      type="date"
                      className="form-control form-control-lg"
                      value={transDate}
                      placeholder="Trans Doc Date"
                      name="transDocDate"
                      onChange={(e) => handleExtendValidity(e)}
                    />
                  </div>
                  <div className="d-flex">
                    <select
                      className="form-control form-control-lg"
                      value={formDataExtendValidity.transMode}
                      name="transMode"
                      onChange={(e) => handleExtendValidity(e)}
                    >
                      <option disabled>Trans Mode</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={formDataExtendValidity.extnRsnCode}
                      placeholder="Extn Rsn Code"
                      name="extnRsnCode"
                      onChange={(e) => handleExtendValidity(e)}
                    />
                  </div>
                  <div className="d-flex">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={formDataExtendValidity.extnRemarks}
                      placeholder="Extn Remarks"
                      name="extnRemarks"
                      onChange={(e) => handleExtendValidity(e)}
                    />
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={formDataExtendValidity.fromPincode}
                      placeholder="From Pincode"
                      name="fromPincode"
                      onChange={(e) => handleExtendValidity(e)}
                    />
                  </div>
                  <div className="d-flex">
                    {formDataExtendValidity.transMode >= 1 &&
                    formDataExtendValidity.transMode <= 4 ? (
                      <select
                        className="form-control form-control-lg"
                        value={formDataExtendValidity.consignmentStatus}
                        name="consignmentStatus"
                        onChange={(e) => handleExtendValidity(e)}
                        disabled
                      >
                        <option value="M">M</option>
                      </select>
                    ) : (
                      <select
                        className="form-control form-control-lg"
                        value={formDataExtendValidity.consignmentStatus}
                        name="consignmentStatus"
                        onChange={(e) => handleExtendValidity(e)}
                        disabled
                      >
                        <option value="T">T</option>
                      </select>
                    )}
                    {formDataExtendValidity.transMode >= 1 &&
                    formDataExtendValidity.transMode <= 4 ? (
                      <select
                        className="form-control form-control-lg"
                        value={formDataExtendValidity.transitType}
                        name="transitType"
                        onChange={(e) => handleExtendValidity(e)}
                        disabled
                      >
                        <option value=""></option>
                      </select>
                    ) : (
                      <select
                        className="form-control form-control-lg"
                        value={formDataExtendValidity.transitType}
                        name="transitType"
                        onChange={(e) => handleExtendValidity(e)}
                      >
                        <option value="">Transit Type</option>
                        <option value="R">Road</option>
                        <option value="W">Warehouse</option>
                        <option value="O">Others</option>
                      </select>
                    )}
                  </div>
                  <div className="d-flex">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={formDataExtendValidity.addressLine1}
                      placeholder="Address Line1"
                      name="addressLine1"
                      onChange={(e) => handleExtendValidity(e)}
                    />
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={formDataExtendValidity.addressLine2}
                      placeholder="Address Line2"
                      name="addressLine2"
                      onChange={(e) => handleExtendValidity(e)}
                    />
                  </div>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={formDataExtendValidity.addressLine3}
                    placeholder="Address Line3"
                    name="addressLine3"
                    onChange={(e) => handleExtendValidity(e)}
                  />
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="text-center mt-3">
                      <a
                        onClick={handleSubmitExtendValidity}
                        className="btn btn-lg btn-block btn-danger lift text-uppercase"
                      >
                        SUBMIT
                      </a>
                    </div>
                    <div className="text-center mt-3">
                      <a
                        className="btn btn-lg btn-block btn-outline-secondary lift text-uppercase"
                        onClick={() => {
                          setExtendValidity(false);
                        }}
                      >
                        Back
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
          {openRejectEWayBill ? (
            <div className="modal-ka-baap">
              <div
                className="add-item-modal-in"
                style={{ width: "35%", height: "auto" }}
              >
                <div className="add-item-modal-top d-flex align-items-center justify-content-between">
                  <div className="fw-bold fs-5">Reject E-Way Bill</div>
                  <IoMdCloseCircleOutline
                    className="fs-5 close-modal-in"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setOpenRejectEWayBill(false);
                    }}
                  />
                </div>

                <form className="row g-3 mt-5" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={formDataRejectEBill.ewbNo}
                    placeholder="Ewb No."
                    name="ewbNo"
                    onChange={(e) => handleRejectEBill(e)}
                  />
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="text-center mt-3">
                      <a
                        onClick={handleSubmitRejectEBill}
                        className="btn btn-lg btn-block btn-danger lift text-uppercase"
                      >
                        Reject
                      </a>
                    </div>
                    <div className="text-center mt-3">
                      <a
                        className="btn btn-lg btn-block btn-outline-secondary lift text-uppercase"
                        onClick={() => {
                          setOpenRejectEWayBill(false);
                        }}
                      >
                        Back
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
          {updateTransporter ? (
            <div className="modal-ka-baap">
              <div
                className="add-item-modal-in"
                style={{ width: "35%", height: "auto" }}
              >
                <div className="add-item-modal-top d-flex align-items-center justify-content-between">
                  <div className="fw-bold fs-5">Update Transporter</div>
                  <IoMdCloseCircleOutline
                    className="fs-5 close-modal-in"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setUpdateTransporter(false);
                    }}
                  />
                </div>

                <form className="row g-3 mt-5" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={formDataUpdateTransporter.ewbNo}
                    placeholder="Ewb No."
                    name="ewbNo"
                    onChange={(e) => handleUpdateTransport(e)}
                  />
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={formDataUpdateTransporter.transporterId}
                    placeholder="Transporter Id"
                    name="transporterId"
                    onChange={(e) => handleUpdateTransport(e)}
                  />
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="text-center mt-3">
                      <a
                        onClick={handleSubmitUpdateTransporter}
                        className="btn btn-lg btn-block btn-success lift text-uppercase"
                      >
                        Update
                      </a>
                    </div>
                    <div className="text-center mt-3">
                      <a
                        className="btn btn-lg btn-block btn-outline-secondary lift text-uppercase"
                        onClick={() => {
                          setUpdateTransporter(false);
                        }}
                      >
                        Back
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
         
          <SideBar navClick={navClick} side={side} />
          {/* start: body area */}
          <div className="wrapper">
            {/* start: page header */}
            <NavBar
              navClick={navClick}
              setNavClick={setNavClick}
              side={side}
              setSide={setSide}
            />

            <div className="contain">
              <div className="api-head">Get Info E-Way Bills</div>
              <hr className="custom-hr" />
              <div className="row-div">
                <div
                  className=" mt-4 card-items"
                  onClick={() => {
                    nav("/gst/generate/e-way-bill", { state: state });
                  }}
                >
                  <div className="bill-img">
                    <img src={generate} alt="" />
                  </div>
                  <div className="card-heading">Generate E-Way Bill</div>
                </div>

                <div
                  className=" mt-4 card-items"
                  onClick={() => {
                    nav("/gst/generate/irn/e-way-bill", { state: state });
                  }}
                >
                  <div className="bill-img">
                    <img src={authentication} alt="" />
                  </div>
                  <div className="card-heading">Generate E-Way Bill by IRN</div>
                </div>

                <div
                  className=" mt-4 card-items"
                  onClick={() => nav("/gst/e-way-update-vehicle-number", { state: state })}
                >
                  <div className="bill-img">
                    <img src={update} alt="" />
                  </div>
                  <div className="card-heading">Update vehicle Number</div>
                </div>
                <div
                  className=" mt-4 card-items"
                  onClick={() => {
                    setOpenCancelEWayBill(true);
                  }}
                >
                  <div className="bill-img">
                    <img src={cancel} alt="" />
                  </div>
                  <div className="card-heading">Cancel E-Way Bill</div>
                </div>
                <div
                  className=" mt-4 card-items"
                  onClick={() => {
                    setOpenRejectEWayBill(true);
                  }}
                >
                  <div className="bill-img">
                    <img src={reject} alt="" />
                  </div>
                  <div className="card-heading">Reject E-Way Bill</div>
                </div>

                <div
                  className=" mt-4 card-items"
                  onClick={() => {
                    setUpdateTransporter(true);
                  }}
                >
                  <div className="bill-img">
                    <img src={updateTransport} alt="" />
                  </div>
                  <div className="card-heading">Update Transporter</div>
                </div>

                <div
                  className=" mt-4 card-items"
                  onClick={() => {
                    setExtendValidity(true);
                  }}
                >
                  <div className="bill-img">
                    <img src={extend} alt="" />
                  </div>
                  <div className="card-heading">Extend Validity</div>
                </div>

                <div
                  className="mt-4 card-items"
                  onClick={() => setEWayBillDetails(true)}
                >
                  <div className="bill-img">
                    <img src={ewayDeatails} alt="" />
                  </div>
                  <div className="card-heading">E-Way Bill Details</div>
                </div>
                <div
                  className=" mt-4 card-items"
                  onClick={() => setOtherPartyEWayBill(true)}
                >
                  <div className="bill-img">
                    <img src={otherPart} alt="" />
                  </div>
                  <div className="card-heading">
                    Get Other Party E-Way Bill Details
                  </div>
                </div>
                <div className=" mt-4 card-items" onClick={() =>
                    nav("/gst/imv-movement", { state: state })
                  }>
                  <div className="bill-img">
                    <img src={initiate} alt="" />
                  </div>
                  <div className="card-heading">
                    Initiate Multi Vehicle Movement
                  </div>
                </div>

                <div
                  className=" mt-4 card-items"
                  onClick={() =>
                    nav("/gst/add-multi-vehicles", { state: state })
                  }
                >
                  <div className="bill-img">
                    <img src={addVehicle} alt="" />
                  </div>
                  <div className="card-heading">Add Multi Vehicle</div>
                </div>

                <div
                  className=" mt-4 card-items"
                  onClick={() =>
                    nav("/gst/change-multi-vehicles", { state: state })
                  }
                >
                  <div className="bill-img">
                    <img src={changeVehicle} alt="" />
                  </div>
                  <div className="card-heading">Change Multi Vehicle</div>
                </div>

                <div
                  className=" mt-4 card-items"
                  onClick={() => setEwayGenConsigner(true)}
                >
                  <div className="bill-img">
                    <img src={consigner} alt="" />
                  </div>
                  <div className="card-heading">
                    Get E-Way Bill generated by Consigner
                  </div>
                </div>

                <div
                  className=" mt-4 card-items"
                  onClick={() => setEwayBillByDate(true)}
                >
                  <div className="bill-img">
                    <img src={date} alt="" />
                  </div>
                  <div className="card-heading">Get E-Way Bill By Date</div>
                </div>
                <div
                  className=" mt-4 card-items"
                  onClick={() => setEwayBillRejectedByDate(true)}
                >
                  <div className="bill-img">
                    <img src={rejectDetails} alt="" />
                  </div>
                  <div className="card-heading">
                    Get E-Way Bill Rejected By Date
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GstCards;
