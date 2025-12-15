import React, { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const { token, navigate } = useContext(ShopContext);

  useEffect(() => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để tiếp tục");
      navigate("/login");
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
