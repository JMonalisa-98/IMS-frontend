import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import "../../Einvoice.css";
import React, { useRef, useState, useEffect } from "react";
import "../../Invoice.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Bars } from "react-loader-spinner";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import QRCode from "react-qr-code";

const Einvoice = () => {
  const navigation = useNavigate();

  const { state } = useLocation();

  let componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

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

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const [invoiceData, setInvoiceData] = useState();
  const [qrData, setQrData] = useState();

  useEffect(() => {
    setInvoiceData(JSON.parse(jwtDecode(state.SignedInvoice).data));
    setQrData(JSON.parse(jwtDecode(state.SignedQRCode).data));
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
        <div>
          <div className="head-t">
            <div
              className="tax-i"
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "100px",
              }}
            >
              <button className="invoice-btn" onClick={() => handlePrint()}>
                Print
              </button>

              <button
                className="invoice-btn"
                onClick={() => navigation("/sales/sales-order")}
              >
                Back
              </button>
            </div>
          </div>
          <div className="invoice-border" ref={componentRef}>
            <div className="invoice-body">
              <div className="invoice-body-top">
                <div>
                  <h3>E-Invoice</h3>
                </div>
                <div
                  style={{
                    height: "auto",
                    width: "150px",
                  }}
                >
                  <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={`${state.SignedQRCode}`}
                    viewBox={`0 0 256 256`}
                  />
                </div>
              </div>
              <div className="details">
                <h5>1. Invoice Details</h5>
                <hr />
                <div className="details-content">
                  <h6>
                    <span>IRN:</span> {invoiceData.Irn}
                  </h6>
                  <h6>
                    <span>Ack No:</span> {invoiceData.AckNo}
                  </h6>
                  <h6>
                    <span>Ack Date:</span> {invoiceData.AckDt}
                  </h6>
                </div>
              </div>
              <div className="details">
                <h5>2. Transaction Details</h5>
                <hr />
                <div className="details-content">
                  <h6>
                    <span>Document Type:</span> {invoiceData.DocDtls.Typ}
                  </h6>
                  <h6>
                    <span>Document No:</span> {invoiceData.DocDtls.No}
                  </h6>
                  <h6>
                    <span>Document Date:</span> {invoiceData.DocDtls.Dt}
                  </h6>
                </div>
              </div>
              <div className="details">
                <h5>3. Party Details</h5>
                <hr />
                <div className="party-details">
                  <div className="party-details-content">
                    <h6>
                      <span>Seller:</span> {invoiceData.SellerDtls.LglNm} <br />
                      <span>Gstin:</span> {invoiceData.SellerDtls.Gstin}
                    </h6>
                    <p>
                      {invoiceData.SellerDtls.Addr1},{" "}
                      {invoiceData.SellerDtls.Loc}, {invoiceData.SellerDtls.Pin}
                    </p>
                  </div>
                  <div class="vertical"></div>

                  <div className="party-details-content">
                    <h6>
                      <span>Buyer:</span> {invoiceData.BuyerDtls.LglNm} <br />
                      <span>Gstin:</span> {invoiceData.BuyerDtls.Gstin}
                    </h6>
                    <p>
                      {invoiceData.BuyerDtls.Addr1}, {invoiceData.BuyerDtls.Loc}
                      , {invoiceData.BuyerDtls.Pin}
                    </p>
                  </div>
                </div>
              </div>
              <div className="details">
                <h5>4. Goods Details</h5>
                <TableContainer component={Paper} className="goods-table">
                  <Table sx={{ minWidth: 600 }} border={1}>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align="center"
                          className="cell-padding"
                          style={{
                            borderRight: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          SN.
                        </TableCell>
                        <TableCell
                          align="center"
                          className="cell-padding"
                          style={{
                            borderRight: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          Product
                        </TableCell>
                        <TableCell
                          align="center"
                          className="cell-padding"
                          style={{
                            borderRight: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          HSN Code
                        </TableCell>
                        <TableCell
                          align="center"
                          className="cell-padding"
                          style={{
                            borderRight: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          Qty
                        </TableCell>
                        <TableCell
                          align="center"
                          className="cell-padding"
                          style={{
                            borderRight: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          Unit
                        </TableCell>
                        <TableCell
                          align="center"
                          className="cell-padding"
                          style={{
                            borderRight: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          Price (Rs)
                        </TableCell>
                        <TableCell
                          align="center"
                          className="cell-padding"
                          style={{
                            borderRight: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          Discount (Rs)
                        </TableCell>
                        <TableCell
                          align="center"
                          className="cell-padding"
                          style={{
                            borderRight: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          GST Rate (%)
                        </TableCell>
                        <TableCell
                          align="center"
                          className="cell-padding"
                          style={{
                            borderRight: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          Pre Tax Value (Rs)
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {invoiceData.ItemList.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell
                            align="center"
                            className="cell-padding"
                            style={{
                              borderRight: "1px solid rgba(224, 224, 224,1)",
                            }}
                          >
                            {index + 1}
                          </TableCell>
                          <TableCell
                            align="center"
                            className="cell-padding"
                            style={{
                              borderRight: "1px solid rgba(224, 224, 224, 1)",
                            }}
                          >
                            {" "}
                            {item.PrdDesc}
                          </TableCell>
                          <TableCell
                            align="center"
                            className="cell-padding"
                            style={{
                              borderRight: "1px solid rgba(224, 224, 224, 1)",
                            }}
                          >
                            {item.HsnCd}
                          </TableCell>
                          <TableCell
                            align="center"
                            className="cell-padding"
                            style={{
                              borderRight: "1px solid rgba(224, 224, 224, 1)",
                            }}
                          >
                            {item.Qty}
                          </TableCell>
                          <TableCell
                            align="center"
                            className="cell-padding"
                            style={{
                              borderRight: "1px solid rgba(224, 224, 224, 1)",
                            }}
                          >
                            {item.Unit}
                          </TableCell>
                          <TableCell
                            align="center"
                            className="cell-padding"
                            style={{
                              borderRight: "1px solid rgba(224, 224, 224, 1)",
                            }}
                          >
                            {item.UnitPrice}
                          </TableCell>
                          <TableCell
                            align="center"
                            className="cell-padding"
                            style={{
                              borderRight: "1px solid rgba(224, 224, 224, 1)",
                            }}
                          >
                            {item.Discount}
                          </TableCell>
                          <TableCell
                            align="center"
                            className="cell-padding"
                            style={{
                              borderRight: "1px solid rgba(224, 224, 224, 1)",
                            }}
                          >
                            {item.GstRt}
                          </TableCell>
                          <TableCell
                            align="center"
                            className="cell-padding"
                            style={{
                              borderRight: "1px solid rgba(224, 224, 224, 1)",
                            }}
                          >
                            {item.PreTaxVal}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <div className="details">
                <h5>5. Overall Values</h5>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 600 }} border={1}>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align="center"
                          style={{
                            borderRight: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          Assessable Value
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            borderRight: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          CGST Value
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            borderRight: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          SGST Value
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            borderRight: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          IGST Value
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            borderRight: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          CESS Value
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            borderRight: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          State CESS Value
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            borderRight: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          Refund Off Value
                        </TableCell>
                        <TableCell align="center">
                          Total Invoice Value
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell
                          align="center"
                          style={{
                            borderRight: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          {invoiceData.ValDtls.AssVal}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            borderRight: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          {invoiceData.ValDtls.CgstVal}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            borderRight: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          {invoiceData.ValDtls.SgstVal}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            borderRight: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          {invoiceData.ValDtls.IgstVal}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            borderRight: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          {invoiceData.ValDtls.CesVal}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            borderRight: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          {invoiceData.ValDtls.StCesVal}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            borderRight: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          {invoiceData.ValDtls.RndOffAmt}
                        </TableCell>
                        <TableCell align="center">
                          {invoiceData.ValDtls.TotInvVal}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Einvoice;
