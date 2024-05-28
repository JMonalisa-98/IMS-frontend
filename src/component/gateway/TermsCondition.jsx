import "../../PrivacyPolicyPage.css";
import React, { useState, useEffect } from "react";
import { Bars } from "react-loader-spinner";
import SideBar from "../SideBar";
import NavBar from "../NavBar";

import { useNavigate } from "react-router-dom";

const TermsCondition = () => {
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
                <h1>Terms & Conditions</h1>

                <div className="privacy-policy-content">
                  <h3> </h3>
                  <p>
                    Welcome to <b>INSTA-E-MART</b> ! These terms and conditions
                    outline the rules and regulations for the use of our
                    website.
                    <br></br>
                    <br></br>
                    By accessing this website, we assume you accept these terms
                    and conditions. Do not continue to use <b>
                      INSTA-E-MART
                    </b>{" "}
                    if you do not agree to all of the terms and conditions
                    stated on this page.
                  </p>
                </div>
                <div className="privacy-policy-content">
                  <h3>License:</h3>
                  <p>
                    You are granted a limited, non-exclusive, and
                    non-transferable license to access and use the website for
                    personal, non-commercial purposes.
                  </p>
                </div>
                <div className="privacy-policy-content">
                  <h3>Usage Restrictions:</h3>
                  <p>
                    You agree not to modify, reproduce, distribute, or exploit
                    any content on the website for commercial purposes without
                    our prior written consent.
                  </p>
                </div>
                <div className="privacy-policy-content">
                  <h3>Intellectual Property:</h3>
                  <p>
                    All content, trademarks, and intellectual property on the
                    website are owned by us or our licensors.
                  </p>
                </div>
                <div className="privacy-policy-content">
                  <h3>Privacy:</h3>
                  <p>
                    We respect your privacy. Please review our Privacy Policy to
                    understand how we collect, use, and protect your personal
                    information.
                  </p>
                </div>
                <div className="privacy-policy-content">
                  <h3>Termination:</h3>
                  <p>
                    We reserve the right to terminate or suspend your access to
                    the website without prior notice if you violate these terms
                    and conditions.
                  </p>
                </div>
                <div className="privacy-policy-content">
                  <h3>Governing Law:</h3>
                  <p>
                    These terms and conditions are governed by the laws of
                    India.
                  </p>
                </div>
                <div className="privacy-policy-content">
                  <h3> Changes to Terms:</h3>
                  <p>
                    We reserve the right to update or modify these terms and
                    conditions at any time without prior notice. It is your
                    responsibility to check this page periodically for changes.
                  </p>
                </div>
                <div className="privacy-policy-content">
                  <h3>Contact Us</h3>
                  <p>
                    If you have any questions or concerns regarding our terms
                    and conditions, please contact us for further assistance.
                    <br></br>
                    By using our website, you agree to abide by these terms and
                    conditions.
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

export default TermsCondition;
