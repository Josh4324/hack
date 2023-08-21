import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import freelancerABI from "../abis/freelancer.json";
import { toast } from "react-toastify";
import { freelanceAddress } from "../constants/index";

export default function Register() {
  const navigate = useRouter();
  const nameRef = useRef();
  const serviceRef = useRef();
  const hourRef = useRef();
  const portfolioRef = useRef();
  const descRef = useRef();

  const createReadContract = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const payContract = new ethers.Contract(
      freelanceAddress,
      freelancerABI.abi,
      provider
    );
    return payContract;
  };

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

  const getJobs = async () => {
    const contract = await createReadContract();
    const data = await contract.fetchJobs();
    console.log(data);
  };

  const register = async (evt) => {
    evt.preventDefault();
    const contract = await createWriteContract();

    const userName = nameRef.current.value;
    const serviceType = serviceRef.current.value;
    const ratePerHour = hourRef.current.value;
    const serviceDescription = descRef.current.value;
    const portfolioLink = portfolioRef.current.value;

    const id = toast.loading("Transaction in progress..");

    try {
      const tx = await contract.createProfile(
        userName,
        serviceType,
        ratePerHour,
        serviceDescription,
        portfolioLink
      );

      await tx.wait();

      toast.update(id, {
        render: "Transaction successfull",
        type: "success",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });

      navigate.push("/profile");
    } catch (error) {
      console.log(error);
      toast.update(id, {
        render: `${error.reason}`,
        type: "error",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
    }
  };

  useEffect(() => {
    getJobs();
  }, []);

  return (
    <div>
      <div>
        <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
          <div className=" mb-10 ml-auto w-fit">
            <ConnectButton />
          </div>

          <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
            <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
              Register
            </h1>
          </div>

          <form
            onSubmit={register}
            className="w-full mt-[65px] flex flex-col gap-[30px]"
          >
            <div className="flex flex-wrap gap-[40px]">
              <label className="flex-1 w-full flex flex-col">
                <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
                  Your UserName *
                </span>

                <input
                  required
                  ref={nameRef}
                  step="0.1"
                  placeholder="John Doe"
                  className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
                />
              </label>

              <label className="flex-1 w-full flex flex-col">
                <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
                  Service Type *
                </span>

                <input
                  required
                  ref={serviceRef}
                  step="0.1"
                  placeholder="Write a title"
                  className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
                />
              </label>
            </div>
            <div className="flex flex-wrap gap-[40px]">
              <label className="flex-1 w-full flex flex-col">
                <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
                  Rate Per Hour *
                </span>

                <input
                  required
                  ref={hourRef}
                  step="0.1"
                  placeholder="10 dollar"
                  className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
                />
              </label>

              <label className="flex-1 w-full flex flex-col">
                <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
                  Portfolio Link *
                </span>

                <input
                  required
                  ref={portfolioRef}
                  step="0.1"
                  placeholder="Enter Portfolio Link"
                  className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
                />
              </label>
            </div>

            <label className="flex-1 w-full flex flex-col">
              <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
                Describe Service *
              </span>

              <textarea
                ref={descRef}
                required
                rows={10}
                placeholder="Describe what you do"
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
