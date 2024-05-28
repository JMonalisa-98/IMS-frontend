import React, { useEffect, useState } from "react";
import SideBar from "../SideBar";
import NavBar from "../NavBar";
import { Bars } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import "../../Styles.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InvAuth = () => {
  const navigation = useNavigate();
  const [side, setSide] = useState(false);
  const [navClick, setNavClick] = useState(false);
  const [tokenGot, setTokenGot] = useState("");
  const [sekGot, setSekGot] = useState("");
  const [authData, setAuthData] = useState();
  const [usernameGot, setUsernameGot] = useState("");
  const [gstType, setGstType] = useState("");

  const [isLoading, setIsLoading] = useState(true);

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

  const [formData, setFormData] = useState({
    gstin: "",
    Username: "",
    Password: "",
  });

  const handleSaleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = (e) => {
    // e.preventDefault();
  };

  const handleSubmit = async (e) => {
    showToastMessage();
    e.preventDefault();
    await axios
      .post("http://localhost:3500/e-invoice", formData)
      .then((result) => {
        setAuthData(result);
        console.log(result.data.ErrorDetails !== null);
        console.log(result.data.ErrorDetails);
        if (result.data.ErrorDetails === null) {
          setTokenGot(result.data.Data.AuthToken);
          setSekGot(result.data.Data.Sek);
          setUsernameGot(result.data.Data.UserName);
          if (gstType === "inv") {
            navigation("/gst/e-invoice-generate", {
              state: {
                Username: result.data.Data.UserName,
                Sek: result.data.Data.Sek,
                authToken: result.data.Data.AuthToken,
                gst: formData.gstin,
              },
            });
          } else if (gstType === "eway") {
            navigation("/gst/e-way-bill", {
              state: {
                Username: result.data.Data.UserName,
                Sek: result.data.Data.Sek,
                authToken: result.data.Data.AuthToken,
                gst: formData.gstin,
              },
            });
          } else {
            navigation("/gst", {
              state: {
                Username: result.data.Data.UserName,
                Sek: result.data.Data.Sek,
                authToken: result.data.Data.AuthToken,
                gst: formData.gstin,
              },
            });
          }
        } else if (result.data.length === 0) {
          alert("Oopsss... Server Down!!");
        } else {
          alert(`${result.data.ErrorDetails[0].ErrorMessage}`);
        }
      })
      .catch((err) => console.error(err));
  };

  const showToastMessage = () => {
    toast.success("Success!!");
  };

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
        <div>
          <div className="layout-1" s>
            <SideBar navClick={navClick} side={side} />
            <div className="wrapper">
              <ToastContainer position="top-center" />
              <NavBar
                navClick={navClick}
                setNavClick={setNavClick}
                side={side}
                setSide={setSide}
              />

              <div className="overlay" style={{ background: "white" }}>
                <div style={{ padding: "20px 40px" }}>
                  <span style={{ color: "black", fontSize: "20px" }}>
                    E-Invoice Authentication
                  </span>
                </div>

                <form
                  className="form-input-fields"
                  style={{
                    background: "#F8F6F2",
                    width: "50%",
                    margin: "0 auto",
                    borderRadius: "10px",
                  }}
                  onSubmit={handleSave}
                >
                  <div className="data-input-fields">
                    <div class="mb-3 w-100">
                      <label for="customerName" class="form-label">
                        GSTIN
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        name="gstin"
                        value={formData.gstin}
                        onChange={(e) => handleSaleInput(e)}
                      />
                    </div>
                  </div>
                  <div className="data-input-fields">
                    <div class="mb-3 w-100">
                      <label for="mobileNumber" class="form-label">
                        USERNAME
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="exampleInputPassword1"
                        name="Username"
                        value={formData.Username}
                        onChange={(e) => handleSaleInput(e)}
                      />
                    </div>
                  </div>
                  <div className="data-input-fields">
                    <div class="mb-3 w-100">
                      <label for="salesOrderNo" class="form-label">
                        PASSWORD
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="exampleInputEmail1"
                        name="Password"
                        value={formData.Password}
                        onChange={(e) => handleSaleInput(e)}
                      />
                    </div>
                  </div>
                  <div className="data-input-fields">
                    <div class="mb-3 w-100">
                      <label htmlFor="gstType" className="form-label">
                        Gst Type
                      </label>
                      <select
                        className="form-select"
                        id="gstType"
                        name="gstType"
                        value={gstType}
                        onChange={(e) => setGstType(e.target.value)}
                      >
                        <option value="">Select GST Type</option>
                        <option value="inv">E-Invoice</option>
                        <option value="eway">E-Way Bill</option>
                        <option value="gst">GST</option>
                      </select>
                    </div>
                  </div>
                  <div className="data-input-fields">
                    <button
                      variant="contained"
                      style={{
                        backgroundColor: "#00AC9A",
                        height: "40px",
                        width: "100px",
                        border: "none",
                        color: "white",
                      }}
                      onClick={handleSubmit}
                      id="logout-button"
                    >
                      Submit
                    </button>
                  </div>
                </form>
                {authData && authData.length > 0 ? (
                  <div
                    className="other-sales-content-left"
                    style={{ marginLeft: "20px" }}
                  >
                    <div>Token and Key Generated</div>
                    <div className="sales-content-box">
                      <div>{tokenGot}</div>
                      <div>{sekGot}</div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvAuth;
