import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminSideBar from "../../components/sidebar/AdminSideBar"; // Sidebar
import "../../assets/styles/AdminObject.css"; // CSS Style
import "../../assets/styles/Suggestion.css";
import { Modal } from "react-bootstrap"; // Để sử dụng modal
const ImportOrderDetail = () => {
    const { importOrderId } = useParams();
    const navigate = useNavigate();

    const [importOrder, setImportOrder] = useState({
