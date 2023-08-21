import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import freelancerABI from "../../abis/freelancer.json";
import { toast } from "react-toastify";
import { freelanceAddress } from "../../constants/index";

export default function Job() {
  const navigate = useRouter();
  const hourRef = useRef();
  const descRef = useRef();

  const router = useRouter();
  const id = router.query.id;

  console.log(id);

  const createWriteContract = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const payContract = new ethers.Contract(
      freelanceAddress,
      freelancerABI.abi,
      signer
    );
    return payContract;
  };

  const createJobApp = async (evt) => {
    evt.preventDefault();
    const contract = await createWriteContract();

    const duration = hourRef.current.value;
    const pitch = descRef.current.value;

    const pid = toast.loading("Transaction in progress..");
    console.log(id, pitch, duration);

    try {
      const tx = await contract.applyForJob(id, pitch, duration);

      await tx.wait();

      toast.update(pid, {
        render: "Transaction successfull",
        type: "success",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });

      navigate.push("/jobs");
    } catch (error) {
      console.log(error);
      toast.update(pid, {
        render: `${error.reason}`,
        type: "error",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
    }
  };

  return (
    <div>
      <div>
        <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
          <div className=" mb-10 ml-auto w-fit">
            <ConnectButton />
          </div>
          <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
            <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
              Apply For Job
            </h1>
          </div>

          <form
            onSubmit={createJobApp}
            className="w-full mt-[65px] flex flex-col gap-[30px]"
          >
            <div className="flex flex-wrap gap-[40px]">
              <label className="flex-1 w-full flex flex-col">
                <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
                  Job Id *
                </span>

                <input
                  required
                  step="0.1"
                  value={id}
                  placeholder="0"
                  className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
                />
              </label>

              <label className="flex-1 w-full flex flex-col">
                <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
                  Duration of work *
                </span>

                <input
                  required
                  step="0.1"
                  ref={hourRef}
                  placeholder="Enter duration of work in hours"
                  className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
                />
              </label>
            </div>

            <label className="flex-1 w-full flex flex-col">
              <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
                Pitch what you can do *
              </span>

              <textarea
                required
                rows={10}
                ref={descRef}
                placeholder="Describe how you will solve the problem"
                className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
              />
            </label>

            <div className="flex justify-center items-center mt-[40px]">
              <button
                type="submit"
                className={`font-epilogue font-semibold px-6 text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] bg-black }`}
                //onClick={handleClick}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
