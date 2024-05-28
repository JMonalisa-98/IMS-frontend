import "../../PrivacyPolicyPage.css";
import React, { useState, useEffect } from "react";
import { Bars } from "react-loader-spinner";
import SideBar from "../SideBar";
import NavBar from "../NavBar";

import { useNavigate } from "react-router-dom";

const ShippingPolicy = () => {
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
                <h1>Shipping Policy</h1>

                <div className="privacy-policy-content">
                  <h3> Fast and Reliable Shipping</h3>
                  <p>
                    Experience seamless delivery with our fast and reliable
                    shipping options:
                    <br></br>
                    <br></br>
                    <b>Standard Shipping :</b> Expect your shoes to arrive
                    within 5-7 business days, ensuring timely delivery without
                    compromise.
                    <br></br>
                    <b>Express Shipping :</b> Elevate your shopping experience
                    with expedited delivery, receiving your footwear within 2-3
                    business days.
                    <br></br>
                    <b>Overnight Shipping :</b> Need it urgently? Opt for
                    overnight shipping for next business day delivery when you
                    order before [specific time] EST.
                    <br></br>
                  </p>
                </div>
                <div className="privacy-policy-content">
                  <h3>Transparent Shipping Rates:</h3>
                  <p>
                    We believe in transparency. Shipping rates are calculated
                    based on the selected shipping method and the weight of your
                    order. You can review the shipping cost during checkout for
                    full clarity.
                  </p>
                </div>
                <div className="privacy-policy-content">
                  <h3>International Shipping:</h3>
                  <p>
                    We cater to global shoe lovers. Enjoy international shipping
                    to select countries, with rates and delivery times varying
                    by destination. Please note that customs duties or taxes may
                    apply, which are the responsibility of the recipient.
                  </p>
                </div>
                <div className="privacy-policy-content">
                  <h3>Order Processing Excellence</h3>
                  <p>
                    Your satisfaction is our priority. Orders are processed
                    swiftly within 1-2 business days, excluding weekends and
                    holidays. Once shipped, you'll receive a comprehensive
                    shipping confirmation email with detailed tracking
                    information for your peace of mind.
                  </p>
                </div>
                <div className="privacy-policy-content">
                  <h3>Hassle-Free Returns</h3>
                  <p>
                    Not the perfect fit? No worries. We offer hassle-free
                    returns within [number] days of delivery, ensuring your
                    complete satisfaction with every purchase. Refer to our
                    Returns Policy for more details.
                  </p>
                </div>
                <div className="privacy-policy-content">
                  <h3>Customer-Centric Support</h3>
                  <p>
                    Have questions or need assistance? Our dedicated customer
                    support team is here to help. Feel free to contact us for
                    personalized support and guidance at any time.
                  </p>
                </div>
                <div className="privacy-policy-content">
                  <h3>Exclusive Benefits for Subscribers</h3>
                  <p>
                    Join our mailing list for exclusive offers and benefits,
                    including priority shipping, early access to sales, and
                    more. Subscribe now to unlock premium perks.
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

export default ShippingPolicy;
