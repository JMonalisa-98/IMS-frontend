import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { CssBaseline, Container, Paper, Box } from "@material-ui/core";
import SideBar from "../SideBar";
import NavBar from "../NavBar";
import { Bars } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import EwayIrn from "./EwayIrn";
import { IoMdCloseCircleOutline } from "react-icons/io";


function StepperEwayIrn() {
  const [isLoading, setIsLoading] = useState(true);
  const [side, setSide] = useState(false);
  const [navClick, setNavClick] = useState(false);
  const navigation = useNavigate();
  const [openError, setOpenError] = useState(false);
  const [errorMsg, setErrorMsg] = useState([]);

  const { state } = useLocation();


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const crossCheck = localStorage.getItem("cross");
    const expiryCheck = localStorage.getItem("expiryDate");
    if (!crossCheck) {
      if (expiryCheck) {
        navigation("/mpin");
      } else {
        navigation("/");
      }
    }
  }, []);

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
        <>
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
                    {errorMsg.slice(0, -1).map((item) => (
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
          <div id="stepper">
            <div className="layout-1">
              <SideBar navClick={navClick} side={side} />
              <div className="wrapper">
                <NavBar
                  navClick={navClick}
                  setNavClick={setNavClick}
                  side={side}
                  setSide={setSide}
                />
                <div className="overlay" style={{ background: "white" }}>
                  <div
                    style={{
                      padding: "20px 40px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ color: "black", fontSize: "20px" }}>
                      E-Way Bill Generate by IRN
                    </span>
                    <div style={{ display: "flex", gap: "10px" }}>
                     
                     
                      <button
                        className="irn-btn"
                        style={{ background: "#938989" }}
                        onClick={() => {
                          navigation("/gst/e-way-bill")
                        }}
                      >
                        Back
                      </button>
                      {/* <button>Get IRN Details by Document Id</button> */}
                    </div>
                  </div>
                  <div>
                    <CssBaseline />
                    <Container component={Box} p={4}>
                      <Paper component={Box} p={3}>
                        <EwayIrn state={state} 
                          setOpenError={setOpenError}
                          setErrorMsg={setErrorMsg}/>
                      </Paper>
                    </Container>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default StepperEwayIrn;
