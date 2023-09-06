import React, { useState } from "react";

import "./index.css";
import Card from "../../components/designer/card";
import AddCard from "../../components/designer/addCard";
import { useEffect } from "react";
import axios from "axios";
import useLoading from "../../hooks/useLoading";
import { toast } from "react-hot-toast";
import useAuth from "../../hooks/authHook";

function Designer() {

  const { user } = useAuth();
  const { setLoading } = useLoading();
  const [data, setData] = useState([]);

  if (user.role.includes("manager") && user.role.includes("admin")) {
    return <div className="col-span-1 md:col-span-2 lg:col-span-5 m-1 md:m-5 ">
      <div className="bg-white rounded-lg px-4 py-6 text-center">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-300">
          You don't have access to this page
        </h1>
      </div>
    </div>
  }

  const getData = async () => {
    setLoading(true);
    await axios.get("user/designer-by-am?host=" + user.id).then((res) => {
      setData(res.data.users);
    }).catch((err) => {
      console.log(err);
    }).finally(() => { setLoading(false) })

  }

  useEffect(() => {
    if (!user.role.includes("manager")) return
    getData();

  }, [])

  const removeUser = async (id) => {
    setLoading(true)
    await axios.patch("user/update-user/" + id, {
      role: "client",
    }).then((res) => {
      getData()
      toast.success("User removed successfully");
    }).catch((err) => {
      console.log(err);
    }).finally(() => { setLoading(false) })

  }

  const cancelRequest = async (id) => {
    setLoading(true)

    await axios.delete("user/remove-invitation/" + id, {
      role: "client",
      editorRequest: ""
    }).then((res) => {
      getData()
      toast.success("Request cancelled successfully");
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      setLoading(false);
    })

  }

  return (
    <div className="m-1 md:m-5 ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 ">
        {
          data.map((item) => {
            return <Card data={item} removeUser={removeUser} getData={getData} cancelRequest={cancelRequest} />
          })
        }

        <AddCard getData={getData} />
      </div>
    </div>
  );
}

export default Designer;