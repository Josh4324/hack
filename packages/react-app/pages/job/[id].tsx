/* eslint-disable */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import freelancerABI from "../../abis/freelancer.json";
import { toast } from "react-toastify";
import { freelanceAddress } from "../../constants/index";

export default function JobDetail() {
  const router = useRouter();
  const id = router.query.id;
  const [jobData, setJob] = useState({});

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

  const getJob = async () => {
    const contract = await createReadContract();
    const data = await contract.getJob(id);
    setJob(data);
    console.log(data);
  };

  useEffect(() => {
    getJob();
  }, []);

  return (
    <div>
      <div>
        <div>
          <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
            <div className=" mb-10 ml-auto w-fit">
              <ConnectButton />
            </div>
            <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
              <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
                Job Details
              </h1>
            </div>

            <form className="w-full mt-[65px] flex flex-col gap-[30px]">
              <div className="flex flex-wrap gap-[40px]">
                <label className="flex-1 w-full flex flex-col">
                  <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
                    Type of Service Needed
                  </span>

                  <input
                    required
                    step="0.1"
                    defaultValue={jobData?.serviceType}
                    placeholder="Software Developement"
                    className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
                  />
                </label>

                <label className="flex-1 w-full flex flex-col">
                  <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
                    Budget For the Job
                  </span>

                  <input
                    required
                    defaultValue={jobData?.jobBudjet}
                    step="0.1"
                    placeholder="Enter the Budget for the Job"
                    className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-[40px]">
                <label className="flex-1 w-full flex flex-col">
                  <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
                    status
                  </span>

                  <input
                    required
                    step="0.1"
                    defaultValue={jobData?.status}
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
                    defaultValue={jobData?.jobDescription}
                    step="0.1"
                    placeholder="Enter the Link to the Job Requirement"
                    className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-[40px]">
                <label className="flex-1 w-full flex flex-col">
                  <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
                    Job Owner
                  </span>

                  <input
                    required
                    step="0.1"
                    defaultValue={jobData?.creator}
                    placeholder="10 dollar"
                    className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
                  />
                </label>

                <label className="flex-1 w-full flex flex-col">
                  <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
                    Freelancer
                  </span>

                  <input
                    required
                    defaultValue={jobData?.freelancer}
                    step="0.1"
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
                  defaultValue={jobData?.linkToRequirement}
                  rows={10}
                  placeholder="Describe the needed service"
                  className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
                />
              </label>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
