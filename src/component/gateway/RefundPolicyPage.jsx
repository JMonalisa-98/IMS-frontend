import "../../PrivacyPolicyPage.css";
import React, { useState, useEffect } from "react";
import { Bars } from "react-loader-spinner";
import SideBar from "../SideBar";
import NavBar from "../NavBar";

import { useNavigate } from "react-router-dom";

const RefundPolicyPage = () => {
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
                <h1>Refund Policy</h1>
                <div className="privacy-policy-content">
                  <p>
                    7 day return policy, which means you have 07 days after
                    receiving your item to request a return. <br />
                    <br />
                    To be eligible for a return, your item must be in the same
                    condition that you received it, unworn or unused, with tags,
                    and in its original packaging. You’ll also need the receipt
                    or proof of purchase.
                  </p>
                </div>
                <div className="privacy-policy-content">
                  <h3>Refunds</h3>
                  <p>
                    We will notify you once we’ve received and inspected your
                    return, and let you know if the refund was approved or not.
                    If approved, you’ll be automatically refunded on your
                    original payment method within 5 business days. Please
                    remember it can take some time for your bank or credit card
                    company to process and post the refund too. <br />
                    <br />
                    If more than 7 business days have passed since we’ve
                    approved your return, please contact us at{" "}
                    <span
                      style={{ color: "blue", textDecoration: "underline" }}
                    >
                      admin@orivesolutions.com
                    </span>
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

export default RefundPolicyPage;
