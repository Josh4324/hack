/* eslint-disable */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import freelancerABI from "../abis/freelancer.json";
import { toast } from "react-toastify";
import { freelanceAddress } from "../constants/index";

export default function Job() {
  const navigate = useRouter();
  const budgetRef = useRef();
  const serviceRef = useRef();
  const hourRef = useRef();
  const reqRef = useRef();
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

  const createJob = async (evt) => {
    evt.preventDefault();
    const contract = await createWriteContract();

    const serviceType = serviceRef.current.value;
    const jobBudjet = ethers.utils.parseEther(budgetRef.current.value);
    //const ratePerHour = hourRef.current.value;
    const jobDescription = descRef.current.value;
    const linkToRequirement = reqRef.current.value;

    const id = toast.loading("Transaction in progress..");

    try {
      const tx = await contract.createJob(
        serviceType,
        jobBudjet,
        jobDescription,
        linkToRequirement
      );

      await tx.wait();

      toast.update(id, {
        render: "Transaction successfull",
        type: "success",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });

      navigate.push("/jobs");
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
              Create Job
            </h1>
          </div>

          <form
            onSubmit={createJob}
            className="w-full mt-[65px] flex flex-col gap-[30px]"
          >
            <div className="flex flex-wrap gap-[40px]">
              <label className="flex-1 w-full flex flex-col">
                <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
                  Type of Service Needed *
                </span>

                <input
                  required
                  step="0.1"
                  ref={serviceRef}
                  placeholder="Software Developement"
                  className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
                />
              </label>

              <label className="flex-1 w-full flex flex-col">
                <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
                  Budget For the Job *
                </span>

                <input
                  required
                  step="0.1"
                  ref={budgetRef}
                  placeholder="Enter the Budget for the Job"
                  className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-[40px]">
              <label className="flex-1 w-full flex flex-col">
                <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
                  Preffered Per Hour *
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
                  Link to Job Requirement *
                </span>

                <input
                  required
                  step="0.1"
                  ref={reqRef}
                  placeholder="Enter the Link to the Job Requirement"
                  className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
                />
              </label>
            </div>

            <label className="flex-1 w-full flex flex-col">
              <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
                Describe the needed service *
              </span>

              <textarea
                required
                rows={10}
                ref={descRef}
                placeholder="Describe the needed service"
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
