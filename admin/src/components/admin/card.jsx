import React from "react";
import { formatCurrency } from "../../../../api/utils/currenyFormatter";

function Card({ data, removeUser, cancelRequest }) {

  return (
    <div>
      <div className="bg-white shadow p-3 rounded-md h-[275px]">
        <div className="flex flex-row justify-between">
          <div>
            <img src={data.avatar ? import.meta.env.VITE_SERVER_URL + data.avatar : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'} className="w-20 h-20 rounded-full" />
            <h1 className=" my-2  font-medium text-xl">{data?.firstname} {data?.lastname}</h1>
            <p className="text-xs font-thin mb-2 text-gray-500">
              {data.email}
            </p>
            <p className="text-xs font-thin mb-2 text-gray-500 capitalize ">
              {data.editorRequest}
            </p>
            <p className="text-xs font-thin mb-2 text-gray-500 capitalize ">
              Active Tasks: {data.aTasks}
            </p>
            <p className="text-xs font-thin mb-2 text-gray-500 capitalize ">
              Completed Tasks: {data.aTasks}
            </p>
            <p className="text-xs font-thin mb-2 text-gray-500 capitalize ">
              Wallet: {formatCurrency(data.wallet)}
            </p>
          </div>
        </div>
        {
          data.editorRequest === "pending" ?
            <button
              onClick={() => cancelRequest(data._id)}
              className="bg-blue-500 text-white w-full py-2 rounded-md my-2">
              Cancel Request
            </button>
            :
            <button
              onClick={() => removeUser(data._id)
              }
              className="bg-blue-500 text-white w-full py-2 rounded-md my-2">
              Remove
            </button>
        }
      </div>
    </div>
  );
}

export default Card;