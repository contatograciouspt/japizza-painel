import dayjs from "dayjs";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";

//internal import
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
import AdminServices from "@/services/AdminServices";
import { notifyError, notifySuccess } from "@/utils/toast";

const useStaffSubmit = (id) => {
  const { state, dispatch } = useContext(AdminContext);
  const { adminInfo } = state;
  const { isDrawerOpen, closeDrawer, setIsUpdate, lang } =
    useContext(SidebarContext);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    dayjs(new Date()).format("YYYY-MM-DD")
  );
  const [language, setLanguage] = useState(lang || "en");
  const [resData, setResData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessedRoutes, setAccessedRoutes] = useState([]);

  const location = useLocation();
  // const { handlerTextTranslateHandler } = useTranslationValue();

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const handleRemoveEmptyKey = (obj) => {
    for (const key in obj) {
      if (obj[key].trim() === "") {
        delete obj[key];
      }
    }
    // console.log("obj", obj);
    return obj;
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // const nameTranslates = await handlerTextTranslateHandler(
      //   data.name,
      //   language
      // );

      const staffData = {
        name: handleRemoveEmptyKey({
          [language]: data.name,
          // ...nameTranslates,
        }),
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: data.role,
        access_list: accessedRoutes?.map((list) => list.value),
        joiningDate: selectedDate
          ? selectedDate
          : dayjs(new Date()).format("YYYY-MM-DD"),
        image: imageUrl,
        lang: language,
      };

      // console.log("staffData", staffData);
      // return;

      if (id) {
        // console.log('id is ',id)
        const res = await AdminServices.updateStaff(id, staffData);
        dispatch({ type: "USER_LOGIN", payload: res });
        const cookieTimeOut = 0.5;
        Cookies.set("adminInfo", JSON.stringify(res), {
          expires: cookieTimeOut,
          sameSite: "None",
          secure: true,
        });
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
      } else {
        const res = await AdminServices.addStaff(staffData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
      }
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err?.message);
      setIsSubmitting(false);
      closeDrawer();
    }
  };

  const getStaffData = async () => {
    try {
      const res = await AdminServices.getStaffById(id, {
        email: adminInfo.email,
      });

      if (res) {
        setResData(res);
        setValue("name", res.name[language ? language : "en"]);
        setValue("email", res.email);
        setValue("password");
        setValue("phone", res.phone);
        setValue("role", res.role);
        setSelectedDate(dayjs(res.joiningData).format("YYYY-MM-DD"));
        setImageUrl(res.image);
        const result = res?.access_list?.map((list) => {
          const newObj = {
            label: list,
            value: list,
          };
          return newObj;
        });
        setAccessedRoutes(result);
      }
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err?.message);
    }
  };

  const handleSelectLanguage = (lang) => {
    setLanguage(lang);

    if (Object.keys(resData).length > 0) {
      setValue("name", resData.name[lang ? lang : "en"]);
    }
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      setResData({});
      setValue("name");
      setValue("email");
      setValue("password");
      setValue("phone");
      setValue("role");
      setValue("joiningDate");
      setImageUrl("");
      clearErrors("name");
      clearErrors("email");
      clearErrors("password");
      clearErrors("phone");
      clearErrors("role");
      clearErrors("joiningDate");
      setImageUrl("");
      setLanguage(lang);
      setValue("language", language);
      return;
    }
    if (id) {
      getStaffData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, setValue, isDrawerOpen, adminInfo.email, clearErrors]);

  useEffect(() => {
    if (location.pathname === "/edit-profile" && Cookies.get("adminInfo")) {
      getStaffData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, setValue]);

  const routeAccessList = [
    { label: "Dashboard", value: "dashboard" },
    { label: "Products", value: "products" },
    { label: "Categories", value: "categories" },
    { label: "Attributes", value: "attributes" },
    { label: "Coupons", value: "coupons" },
    { label: "Customers", value: "customers" },
    { label: "Orders", value: "orders" },
    { label: "Staff", value: "our-staff" },
    { label: "Settings", value: "settings" },
    { label: "Languages", value: "languages" },
    { label: "Currencies", value: "currencies" },
    { label: "ViewStore", value: "store" },
    { label: "StoreCustomization", value: "customization" },
    { label: "StoreSettings", value: "store-settings" },
    { label: "Product Details", value: "product" },
    { label: "Order Invoice", value: "order" },
    { label: "Edit Profile", value: "edit-profile" },
    {
      label: "Customer Order",
      value: "customer-order",
    },
    // { label: "Coming Soon", value: "/coming-soon" },
  ];

  return {
    register,
    handleSubmit,
    onSubmit,
    language,
    errors,
    adminInfo,
    setImageUrl,
    imageUrl,
    selectedDate,
    setSelectedDate,
    isSubmitting,
    routeAccessList,
    accessedRoutes,
    setAccessedRoutes,
    handleSelectLanguage,
  };
};

export default useStaffSubmit;
