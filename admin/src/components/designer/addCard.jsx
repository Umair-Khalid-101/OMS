import React, { useState } from "react";

import useLoading from "../../hooks/useLoading";
import toast from "react-hot-toast";
import axios from "axios";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Modal from "../modal";
import useAuth from "../../hooks/authHook";

function AddCard({ getData }) {
  const { setLoading } = useLoading();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useAuth();
  const [email, setEmail] = useState("");

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter email");
      return;
    }

    setLoading(true);
    await axios.post('user/invite-designer', { email: email, head: user.id }).then((res) => {
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
          className="flex flex-row justify-center items-center h-[220px] rounded-md border focus:border-blue-500"
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
            Invite Designer
          </h3>
          <p
            class="text-sm text-gray-600 dark:text-gray-400"
          >
            Enter the email of the user you want to invite as a designer
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