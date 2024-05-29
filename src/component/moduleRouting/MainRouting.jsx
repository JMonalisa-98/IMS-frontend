import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Signin from "../authentication/Signin";
import PinLogin from "../authentication/PinLogin";
import Mpin from "../authentication/Mpin";
import Dashboard from "../dashboard/Dashboard";
import BuyersSuppliers from "../buyersSuppliers/BuyersSuppliers";
import ShoesItem from "../inventory/ShoesItem";
import ClothingItem from "../inventory/ClothingItem";
import AccessoriesItem from "../inventory/AccessoriesItem";
import Categories from "../inventory/Categories";
import ItemsList from "../inventory/ItemsList";
import CreateCompany from "../authentication/CreateCompany";
import QuatationOrder from "../purchase/QuatationOrder";
import Quotation from "../purchase/Quotation";
import QuotationTable from "../purchase/QuotationTable";
import SalesForm from "../sales/SalesForm";
import Transactions from "../payment/Transactions";
import SalesTable from "../sales/SalesTable";
import Expense from "../accounts/Expense";
import Cash from "../accounts/Cash";
import Invoice from "../sales/Invoice";
import StockReport from "../reports/StockReport";
import MainReport from "../reports/MainReport";
import SalesReport from "../reports/SalesReport";
import Messaging from "../messaging/Messaging";
import Bill from "../messaging/Bill";
import InvAuth from "../accounts/InvAuth";
import StepperCode from "../accounts/StepperCode";
import Einvoice from "../accounts/Einvoice";
import PrivacyPolicyPage from "../gateway/PrivacyPolicyPage";
import Contact from "../gateway/Contact";
import RefundPolicyPage from "../gateway/RefundPolicyPage";
import EwayBill from "../accounts/EwayBill";
import GstAll from "../accounts/GstAll";
import StepperBillCode from "../accounts/StepperBillCode";
import ShippingPolicy from "../gateway/ShippingPolicy";
import TermsCondition from "../gateway/TermsCondition";
import GstCards from "../accounts/GstCards";
import StepperAddMultiVehicles from "../accounts/StepperAddMultiVehicles";
import StepperChangeMultiVehicle from "../accounts/StepperChangeMultiVehicles";
import GenerateEway from '../accounts/GenerateEway'
import StepperGenConsolidatedEwayBill from "../accounts/StepperGenConsolidatedEwayBill";
import StepperEwayIrn from "../accounts/StepperEwayIrn";
import StepperImvMovement from "../accounts/StepperImvMovement";
import StepperUpdateVehicleNumber from "../accounts/StepperUpdateVehicleNumber";

const MainRouting = () => {
  return (
    <Routes>
      <Route path="/" element={<Signin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/bills/:id" element={<Bill />} />
      <Route path="/set-mpin" element={<Mpin />} />
      <Route path="/mpin" element={<PinLogin />} />
      <Route path="/createcompany" element={<CreateCompany />} />
      <Route path="/buyers-suppliers" element={<BuyersSuppliers />} />
      <Route path="/inventory/categories" element={<Categories />} />
      <Route path="/inventory/items-list/:id" element={<ItemsList />} />
      <Route path="/inventory/shoes" element={<ShoesItem />} />
      <Route path="/inventory/clothing" element={<ClothingItem />} />
      <Route path="/inventory/accessories" element={<AccessoriesItem />} />
      <Route path="/quotation/quotation-order" element={<QuatationOrder />} />
      <Route path="/quotation" element={<Quotation />} />
      <Route path="/sales/sales-order" element={<SalesForm />} />
      <Route path="/sales/invoice" element={<Invoice />} />
      <Route path="/payment/transactions" element={<Transactions />} />
      <Route path="/sales/list" element={<SalesTable />} />
      <Route path="/accounts/cash-on-hand" element={<Cash />} />
      <Route path="/accounts/expense" element={<Expense />} />
      <Route path="/quotation/list" element={<QuotationTable />} />
      <Route path="/reports/stock-report" element={<StockReport />} />
      <Route path="/reports/sales-report" element={<SalesReport />} />
      <Route path="/reports/main-report" element={<MainReport />} />
      <Route path="/gst/e-invoice-auth" element={<InvAuth />} />
      <Route path="/gst/e-invoice-generate" element={<StepperCode />} />
      <Route path="/gst/e-invoice" element={<Einvoice />} />
      <Route path="/gst/generate/e-way-bill" element={<StepperBillCode />} />
      <Route path="/gst/generate/irn/e-way-bill" element={<StepperEwayIrn />} />
      <Route path="/gst" element={<GstAll />} />
      <Route path="/policy-page" element={<PrivacyPolicyPage />} />
      <Route path="/contact-page" element={<Contact />} />
      <Route path="/refund-page" element={<RefundPolicyPage />} />
      <Route path="/shipping-page" element={<ShippingPolicy />} />
      <Route path="/terms-conditions-page" element={<TermsCondition />} />
      <Route path="/gst/e-way-bill" element={<GstCards />} />
      <Route path="/gst/imv-movement" element={<StepperImvMovement />} />
      <Route path="/gst/add-multi-vehicles" element={<StepperAddMultiVehicles />} />
      <Route path="/gst/change-multi-vehicles" element={<StepperChangeMultiVehicle />} />
      <Route path="/gst/e-way-update-vehicle-number" element={<StepperUpdateVehicleNumber/>} />
      <Route path="/gst/e-way-generate" element={<GenerateEway/>} />
      <Route path="/gst/gen-consolidated-e-way-bill" element={<StepperGenConsolidatedEwayBill />} />

    </Routes>
  );
};

export default MainRouting;
