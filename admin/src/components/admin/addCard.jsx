import React, { useState } from "react";

import useLoading from "../../hooks/useLoading";
import toast from "react-hot-toast";
import axios from "axios";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Modal from "../modal";

function AddCard({ getData }) {
  const { setLoading } = useLoading();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState(["manager"]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter email");
      return;
    }

    if (!role.length) {
      toast.error("Please select atleast one role");
      return;
    }

    setLoading(true);
    await axios.post('user/invite-manager', { email: email, role }).then((res) => {
      setLoading(false);
      toast.success("Invite sent successfully");
      getData();
      setEmail("");
      toggleModal();
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      setLoading(false);
    })

  }

  return (
    <div>
      <div className="bg-white shadow  rounded-md border border-blue-400">
        <div
          className="flex flex-row justify-center items-center h-[273px] rounded-md border focus:border-blue-500"
          tabIndex={0}
          style={{ fontSize: "150px", fontWeight: "lighter" }}
        >
          <button
            onClick={toggleModal}
            className="bg-white flex flex-row justify-center text-blue-500  px-2 py-2 text-sm w-full"
            type="button"
          >
            <AiOutlinePlusCircle className="text-[100px]" />
          </button>
        </div>
      </div>
      <Modal
        open={isModalOpen}
        handleClose={toggleModal}
      >
        <div class="px-6  lg:px-8">
          <h3 class=" text-xl font-medium text-gray-900 dark:text-white">
            Invite Account Manager
          </h3>
          <p
            class="text-sm text-gray-600 dark:text-gray-400"
          >
            Enter the email of the user you want to invite as account manager
          </p>
          <form class="space-y-6 mt-4" action="#">
            <div>
              <label htmlFor="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter email</label>
              <input
                type="email"
                name="email"
                id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="name@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* checkbox */}
            <div class="flex items-center mb-4">
              <input
                id="default-checkbox"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                value="manager"
                checked={role.includes("manager")}
                onChange={(e) => {
                  if (e.target.checked) {
                    setRole([...role, "manager"])
                  } else {
                    setRole(role.filter((r) => r !== "manager"))
                  }
                }}
              />
              <label for="default-checkbox" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Account manager
              </label>
            </div>
            <div class="flex items-center">
              <input
                id="checked-checkbox"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                value="printing"
                checked={role.includes("printing")}
                onChange={(e) => {
                  if (e.target.checked) {
                    setRole([...role, "printing"])
                  } else {
                    setRole(role.filter((r) => r !== "printing"))
                  }
                }}
              />
              <label for="checked-checkbox" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Printing
              </label>
            </div>
            <div class="flex items-center">
              <input
                id="checked-checkbox"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                value="shipping"
                checked={role.includes("shipping")}
                onChange={(e) => {
                  if (e.target.checked) {
                    setRole([...role, "shipping"])
                  } else {
                    setRole(role.filter((r) => r !== "shipping"))
                  }
                }}
              />
              <label for="checked-checkbox" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Shipping
              </label>
            </div>

            <button
              onClick={handleSubmit}
              type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Invite</button>

          </form>
        </div>
      </Modal>
    </div>
  );
}

export default AddCard;