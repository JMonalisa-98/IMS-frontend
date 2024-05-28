import "../../PrivacyPolicyPage.css";
import React, { useState, useEffect } from "react";
import { Bars } from "react-loader-spinner";
import SideBar from "../SideBar";
import NavBar from "../NavBar";

import { useNavigate } from "react-router-dom";

const Contact = () => {
  const [side, setSide] = useState(false);
  const [navClick, setNavClick] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigate();

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
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
        <div className="layout-1">
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
            <div className="">
              <div className="privacy-policy-container">
                <h1>Contact Us</h1>

                <div className="privacy-policy-content">
                  <h3> Privacy Inquiries</h3>
                  <p>
                    If you have any questions or concerns about our privacy
                    practices, including inquiries about this Privacy Policy or
                    exercising your rights regarding your personal information,
                    we're here to assist you. Please feel free to reach out
                    using any of the following contact methods:
                  </p>
                </div>
                <div className="privacy-policy-content">
                  <h3>Contact Information:</h3>
                  <p>
                    <b>Phone :</b> +91 9777798142<br></br>
                    <b>Email :</b> admin@orivesolutions.com<br></br>
                    <b>Address :</b> DCB-014, DLF Cyber City Rd, Chandaka
                    Industrial Estate, Patia, Bhubaneswar, Odisha 751024, India{" "}
                    <br></br>
                    You can use any of the above means to contact us, and we'll
                    respond promptly to your queries.
                  </p>
                </div>
                <div className="privacy-policy-content">
                  <h3></h3>
                  <p>
                    Thank you for choosing <b>Insta-E Mart. </b>
                    We appreciate your trust and are committed to ensuring your
                    privacy rights are respected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
