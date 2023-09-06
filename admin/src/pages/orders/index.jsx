import { FaUserCircle } from "react-icons/fa";
import { BsFillFileBarGraphFill } from "react-icons/bs";
import {
  MdHomeRepairService,
  MdOutlineDone,
  MdDoNotDisturb,
} from "react-icons/md";
import { HiCurrencyDollar } from "react-icons/hi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BsCalendarDate } from "react-icons/bs";
import axios from "axios";

import React, { useState } from "react";

import profile from "../../assets/images/Ellipse 1631.png";
import useLoading from "../../hooks/useLoading";
import useAuth from "../../hooks/authHook";
import toast from "react-hot-toast";
import ViewOrder from "./view";
import AssignTo from "./assignModal";

function Orders() {

  const { user } = useAuth()
  const { setLoading } = useLoading()
  const [order, setOrder] = useState([])
  const [open, setOpen] = useState(false)
  const [data, setData] = useState({})
  const [assignTo, setAssignTo] = useState(false)

  const fetchOrders = async () => {
    await axios.get("order").then((res) => {

      const orders = res.data.orders

      setOrder(orders);
    }
    ).catch((err) => {
      toast.error(err.response.data.message)
    }
    )

  }

  const updateOrder = async (id, status) => {
    await axios.patch("order/" + id, { status: status }).then((res) => {
      toast.success(res.data.message || "Order updated successfully")
      fetchOrders()
    }).catch((err) => {
      toast.error(err.response.data.message)
    })
  }

  const deleteOrder = async (id) => {
    await axios.delete("order/" + id).then((res) => {
      toast.success(res.data.message || "Order deleted successfully")
      fetchOrders()
    }).catch((err) => {
      toast.error(err.response.data.message)
    })
  }

  React.useEffect(() => {

    if (!user.role.includes("admin")) return
    fetchOrders()

  }, [])


  return (
    <div className="m-1 md:m-5">
      <div className="relative overflow-x-auto min-h-screen">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" className="px-6 py-3 ">
                <div className="flex flex-row">
                  <BsCalendarDate className="mr-2 mt-0.5 bg-gray-50 text-gray-700" />{" "}
                  Date
                </div>
              </th>
              <th scope="col" className="px-6 py-3 ">
                <div className="flex flex-row">
                  <BsCalendarDate className="mr-2 mt-0.5 bg-gray-50 text-gray-700" />{" "}
                  Due Date
                </div>
              </th>
              <th scope="col" className="px-6 py-3 ">
                <div className="flex flex-row">
                  <FaUserCircle className="mr-2 mt-0.5 bg-gray-50 text-gray-700" />{" "}
                  Name
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex flex-row">
                  <MdHomeRepairService className="mr-2 mt-0.5 " />
                  Service
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex flex-row">
                  <BsFillFileBarGraphFill className="mr-2 mt-0.5 " />
                  Status
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex flex-row">
                  <HiCurrencyDollar className="mr-2 mt-0.5 " />
                  Price
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex flex-row">
                  <HiCurrencyDollar className="mr-2 mt-0.5 " />
                  Payment
                </div>
              </th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>

            {
              order.map((item, index) => {
                return (
                  <Row
                    key={index}
                    id={item._id}
                    name={item.firstname + " " + item.lastname}
                    email={item.email}
                    products={item.products}
                    status={item.status}
                    price={item.total}
                    updateOrder={updateOrder}
                    payment={item.payment}
                    ps={item.paymentStatus}
                    setOpen={setOpen}
                    order={item}
                    setData={setData}
                    setAssignTo={setAssignTo}
                    deleteOrder={deleteOrder}
                  />
                )
              }
              )
            }


          </tbody>
        </table>
      </div>

      {
        open &&
        <ViewOrder
          open={open}
          handleClose={() => setOpen(false)}
          data={data}
        />
      }

      {
        assignTo &&
        <AssignTo
          open={assignTo}
          handleClose={() => setAssignTo(false)}
          data={data}
          fetchOrders={fetchOrders}
        />
      }

    </div>
  );
}

const Row = ({ name, email, products, status, price, id, updateOrder, payment, ps, setOpen, order, setData, setAssignTo, deleteOrder }) => {

  return (
    <tr
      onClick={() => {
        setOpen(true)
        setData(order)
      }}
      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <td>
        <p className="capitalize text-gray-400 font-thin pl-2 " style={{ fontSize: "10px" }}>
          {new Date(order.createdAt).toDateString(
            "en-US",
            { weekday: "long", year: "numeric", month: "long", day: "numeric" }
          )}
        </p>
      </td>
      <td>
        <p className="capitalize text-gray-400 font-thin pl-2 " style={{ fontSize: "10px" }}>
          {new Date(order.date).toDateString(
            "en-US",
            { weekday: "long", year: "numeric", month: "long", day: "numeric" }
          )}
        </p>
      </td>
      <td className="px-6 py-4">
        {" "}
        <div className="flex flex-row ">
          <img src={profile} className="w-10 h-10" />
          <div className="ml-2">
            <h1 className=" text-xs font-medium text-gray-900  ">
              {name}
            </h1>
            <p
              className=" text-gray-400 font-thin "
              style={{ fontSize: "10px" }}
            >
              {email}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 flex flex-col items-start ">
        {
          products.map((item, index) => {
            return (
              <p
                className=" text-gray-800 font-thin bg-green-200 p-1 mb-1 rounded "
                style={{ fontSize: "12px" }}
              >
                {item}
              </p>
            )
          }
          )
        }
      </td>
      <td className="px-6 py-4 ">
        <span className="bg-green-100 rounded-lg px-2 py-1 capitalize text-gray-800 ">
          {status}
        </span>
      </td>
      <td className="px-6 py-4">${price}</td>
      <td className="flex flex-col items-start">
        <div className={"text-gray-800 font-thin bg-green-200 p-1 mb-1 rounded " + payment == "credit" ? "bg-green-300" : "bg-blue-300"}>
          <p>
            {payment == "credit" ? "Credit Card" : "Purchase Order"}
          </p>
        </div>
        <p className=" text-gray-900 capitalize font-thin " style={{ fontSize: "12px" }}>
          {ps}
        </p>
      </td>
      <td className="px-6 py-4">
        <div className="group inline-block">
          <button className="outline-none focus:outline-none  px-3 py-1  rounded-sm flex items-center min-w-32">
            <span className="pr-1 font-semibold flex-1">
              {" "}
              <BsThreeDotsVertical />
            </span>
          </button>

          <ul className="bg-white border w-[100px] rounded-sm transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top min-w-32">
            {!order.assignTo && <button
              onClick={(event) => {
                event.stopPropagation();
                setAssignTo(true)
                setData(order)
              }}
              className="w-full rounded-sm px-3 py-1 hover:bg-gray-100 flex flex-row text-sm items-center text-gray-700">
              Assign To
            </button>}
            {
              status === 'pending' &&
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  updateOrder(id, 'declined')
                }}
                className="w-full rounded-sm px-3 py-1 hover:bg-gray-100 flex flex-row text-sm items-center text-gray-700">
                Decline
              </button>
            }
            {
              status === 'completed' &&
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  updateOrder(id, 'cancelled')
                }}
                className="w-full rounded-sm px-3 py-1 hover:bg-gray-100 flex flex-row text-sm items-center text-gray-700">
                Delete
              </button>
            }
            {
              status !== 'completed' &&
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  deleteOrder(id)
                }}
                className="w-full rounded-sm px-3 py-1 hover:bg-gray-100 flex flex-row text-sm items-center text-gray-700">
                Complete
              </button>
            }
          </ul>

        </div>
      </td>
    </tr>
  );
}

export default Orders;
